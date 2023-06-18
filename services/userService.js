const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("redis");

const User = require("../models/userModel");
const { sendEmail } = require("../utils/mailer");
const { createError } = require("../middlewares/errors");
const RefreshToken = require("../models/refreshTokenModel");
const ms = require("ms");

const client = redis.createClient();

// Login
exports.login = async (email, password, rememberMe, deviceIdentifier) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "", "no user found");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createError(422, "", "wrong password");
  }

  const accessToken = jwt.sign(
    {
      user: {
        userId: user._id.toString(),
        email: user.email,
        fullname: user.fullname,
      },
      usage: "auth-access",
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const isRefreshTokenAlreadyCreated = await RefreshToken.findOne({
    deviceIdentifier,
  });

  let theRefreshToken;

  if (!isRefreshTokenAlreadyCreated) {
    const refreshTokenExpiresIn = rememberMe ? "15d" : "1d";
    const expiresInMs = ms(refreshTokenExpiresIn); // Convert expiresIn string to milliseconds
    const refreshTokenExpirationTime = Date.now() + expiresInMs; // Add expiresInMs to current timestamp

    const refreshToken = jwt.sign(
      {
        user: {
          userId: user._id.toString(),
          email: user.email,
          fullname: user.fullname,
        },
        usage: "auth-refresh",
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiresIn }
    );

    theRefreshToken = refreshToken;

    await RefreshToken.create({
      token: refreshToken,
      user: user._id.toString(),
      expiresAt: new Date(refreshTokenExpirationTime),
      deviceIdentifier,
    });
  }

  return {
    accessToken: accessToken,
    refreshToken: theRefreshToken,
    userId: user._id.toString(),
  };
};

// Create new access token
exports.newAccessToken = async (token, deviceIdentifier) => {
  if (!client.isOpen) await client.connect();

  const decodedToken = jwt.decode(token);

  if (decodedToken.usage === "auth-refresh") {
    try {
      const isUserLoggedIn = await RefreshToken.findOne({ deviceIdentifier });

      if (!isUserLoggedIn) {
        throw createError(401, "", "login again");
      }

      const finalDecodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!finalDecodedToken) {
        await RefreshToken.findOneAndRemove({ deviceIdentifier });
        throw createError(401, "", "login again");
      }

      const isTokenDisabled = await client.get(token);

      if (isTokenDisabled == "disabled") {
        throw createError(401, "", "This refresh token is disabled");
      }

      const user = await User.findById(decodedToken.user.userId);

      const accessToken = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
          },
          usage: "auth-access",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      return accessToken;
    } catch (err) {
      if (err.message === "jwt expired") {
        await RefreshToken.findOneAndRemove({ deviceIdentifier });
        throw createError(401, "", "login again");
      }
      throw createError(401, "", "login again");
    }
  } else {
    throw createError(401, "", "token is not valid");
  }
};

// Verify Email Request
exports.verifyEmailRequest = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "", "user not found");
  }

  const isEmailAlreadyVerified = user.isEmailVerified;
  if (isEmailAlreadyVerified) {
    throw createError(422, "", "the email is already verified");
  }

  const token = jwt.sign(
    { userId: user._id, email: email, usage: "emailVerify" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const verifyLink = `${process.env.DOMAIN}/verify-email/${token}`; // Replace your domain
  console.log(verifyLink);

  const isEmailSent = await sendEmail(
    user.email,
    user.fullname,
    "verify email",
    `<a href="${verifyLink}">click here for verifying email/a>`
  );

  if (!isEmailSent) {
    throw createError(422, "", "email didn't send - server problem");
  }
};

// Verify Email
exports.verifyEmail = async (token) => {
  if (!client.isOpen) await client.connect();

  const isTokenDisabled = await client.get(token);
  if (isTokenDisabled == "disabled") {
    throw createError(
      401,
      "This token is disabled",
      "no permission to access the resource"
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw createError(401, "", "don't have the premission");
  }

  if (decodedToken.usage !== "emailVerify") {
    throw createError(422, "", "this token is not for email verfication");
  }
  const user = await User.findOne({ _id: decodedToken.userId });

  if (!user) {
    throw createError(404, "", "no user found with this id");
  }

  user.isEmailVerified = true;
  await user.save();
  await client.set(token, "disabled");
  await client.expire(token, 24 * 60 * 60);
};

// Register
exports.register = async (fullname, email, password, confirmPassword) => {
  await User.userValidation({ fullname, email, password, confirmPassword });

  const user = await User.findOne({ email });
  if (user) {
    throw createError(422, "", "email is already registerd");
  }

  await User.create({
    fullname,
    email,
    password,
  });

  //Send Welcome Email
  //sendEmail(email, fullname, "Welcome!", "Thank you for chosing us");

  return true;
};

// Logout
exports.logout = async (accessToken, deviceIdentifier, userId) => {
  if (!client.isOpen) await client.connect();

  const decodedToken = jwt.decode(accessToken);

  if (!decodedToken) {
    throw createError(401, "", "token is wrong");
  }
  const disabledToken = await client.get(accessToken);
  if (disabledToken == "disabled") {
    throw createError(402, "", "The access token is completly disabled");
  }

  await client.set(accessToken, "disabled");
  await client.expire(accessToken, 24 * 60 * 60);
  await RefreshToken.findOneAndRemove({
    deviceIdentifier,
    user: decodedToken.user.userId,
  });
};

// Forget Password
exports.forgetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404, "", "user not found");
  }

  const token = jwt.sign(
    { userId: user._id, usage: "forgetPassword" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const resetLink = `${process.env.DOMAIN}/reset-password/${token}`; // Replace your domain
  console.log(resetLink);

  const isEmailSent = await sendEmail(
    user.email,
    user.fullname,
    "forget password",
    `<a href="${resetLink}">click here for changing password/a>`
  );

  if (!isEmailSent) {
    throw createError(422, "", "email didn't send - server problem");
  }
};

// Reset Forgeted Password
exports.resetPassword = async (token, password, confirmPassword) => {
  if (!client.isOpen) await client.connect();

  const isTokenDisabled = await client.get(token);
  if (isTokenDisabled == "disabled") {
    throw createError(
      401,
      "This token is disabled",
      "no permission to access the resource"
    );
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    throw createError(401, "", "don't have the premission");
  }

  if (decodedToken.usage !== "forgetPassword") {
    throw createError(422, "", "this token is not for password resetting");
  }

  if (password !== confirmPassword) {
    throw createError(422, "", "password and confirm password don't match");
  }

  const user = await User.findOne({ _id: decodedToken.userId });

  if (!user) {
    throw createError(404, "", "no user found with this id");
  }

  user.password = password;
  await user.save();
  await client.set(token, 24 * 60 * 60);
};

// Change Password
exports.changePassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, "", "no user found");
  }

  await User.userValidation({
    fullname: user.fullname,
    email: user.email,
    password: newPassword,
    confirmPassword: confirmNewPassword,
  });

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    throw createError(422, "", "wrong password");
  }

  user.password = newPassword;
  await user.save();
};

// Edit Profile
exports.editProfile = async (userId, newEmail, newFullName) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError(404, "", "no user found");
  }

  await User.userValidation({
    fullname: newFullName,
    email: newEmail,
    password: "Password",
    confirmPassword: "Password",
  });

  if (user.email !== newEmail) user.isEmailVerified = false;
  user.email = newEmail;
  user.fullname = newFullName;

  await user.save();
};

// User Info
exports.userInfo = async (userId) => {
  const user = await User.findById(userId).populate(["savedPosts", "comments"]);

  if (!user) {
    throw createError(404, "", "no user found");
  }

  return user;
};

// Saves a post
exports.savePost = async (userId, postId) => {
  const user = await User.findById(userId);
  const post = await User.findById(postId);

  if (!user || !post) {
    throw createError(404, "", "no user or post found");
  }

  const isPostAlreadySaved = user.savedPosts.find(
    (s) => s.toString() == post.id.toString()
  );
  if (isPostAlreadySaved) throw createError(402, "", "post is already saved");

  user.savedPosts.push(post.id);
  user.save();
};

// Unsaves a post
exports.unsavePost = async (userId, postId) => {
  const user = await User.findById(userId);
  const post = await User.findById(postId);
  console.log(post);

  if (!user || !post) {
    throw createError(404, "", "no user or post found");
  }

  const isPostAlreadySaved = user.savedPosts.find(
    (s) => s.toString() == post.id.toString()
  );
  if (!isPostAlreadySaved) throw createError(402, "", "post is not saved");

  const startIndex = user.savedPosts.findIndex(
    (s) => s.toString() == post.id.toString()
  );
  user.savedPosts.splice(startIndex, 1);
  user.save();
};
