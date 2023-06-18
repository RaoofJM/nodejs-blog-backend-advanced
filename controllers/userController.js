const { createError } = require("../middlewares/errors");
const service = require("../services/userService");

// POST - /login - Login Handler
exports.login = async (req, res, next) => {
  try {
    const deviceIdentifier = await req.headers.deviceidentifier;
    const { email, password, rememberMe } = req.body;
    const { accessToken, refreshToken, userId } = await service.login(
      email,
      password,
      rememberMe,
      deviceIdentifier
    );
    res.status(200).json({ accessToken, refreshToken, userId });
  } catch (err) {
    next(err);
  }
};

// POST - /access-token - Create new access token
exports.newAccessToken = async (req, res, next) => {
  try {
    const deviceIdentifier = await req.headers.deviceidentifier;
    const authHeader = await req.get("Authorization");
    const token = authHeader.substring(7); // remove Bearer prefix from token
    const accessToken = await service.newAccessToken(token, deviceIdentifier);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// POST - /verify-email-request - Emails a link that verifies the email
exports.verifyEmailRequest = async (req, res, next) => {
  try {
    const email = req.body.email;
    await service.verifyEmailRequest(email);
    res.status(200).json({ message: "verify email sent" });
  } catch (err) {
    next(err);
  }
};

// GET - /verify-email/:token - Verifies user's email
exports.verifyEmail = async (req, res, next) => {
  const token = req.params.token;
  try {
    await service.verifyEmail(token);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// POST - /logout - Logout Handler
exports.logout = async (req, res, next) => {
  const deviceIdentifier = await req.headers.deviceidentifier;
  const userId = req.userId;
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) throw createError(401, "", "no token recived");
    const token = authHeader.split(" ")[1];
    await service.logout(token, deviceIdentifier, userId);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// POST - /register - Register Handler
exports.register = async (req, res, next) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;
    await service.register(fullname, email, password, confirmPassword);
    res.status(201).json({ message: "register success" });
  } catch (err) {
    next(err);
  }
};

// POST - /forget-password - Forget Password Handler
exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    await service.forgetPassword(email);
    res.status(200).json({ message: "email sent" });
  } catch (err) {
    next(err);
  }
};

// POST - /reset-pass - Reset Password Handler
exports.resetForgetedPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;
  try {
    await service.resetPassword(token, password, confirmPassword);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /change-password/:id - Change Password Handler
exports.changePassword = async (req, res, next) => {
  const id = req.params.id;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  try {
    await service.changePassword(
      id,
      currentPassword,
      newPassword,
      confirmNewPassword
    );
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /edit-profile/:id - Edit Profile Handler
exports.editProfile = async (req, res, next) => {
  const id = req.params.id;
  const { newEmail, newFullName } = req.body;
  try {
    await service.editProfile(id, newEmail, newFullName);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// GET - /user-info/:id - Returns the user's info
exports.userInfo = async (req, res, next) => {
  const id = req.userId;
  try {
    const user = await service.userInfo(id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// GET - /save-post/:id - Saves a post
exports.savePost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    await service.savePost(userId, postId);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// GET - /unsave-post/:id - Unsaves a post
exports.unsavePost = async (req, res, next) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    await service.unsavePost(userId, postId);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};
