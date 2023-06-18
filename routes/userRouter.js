const express = require("express");

const userController = require("../controllers/userController");
const {
  authenticated,
  requireRoles,
  verifiedEmail,
} = require("../middlewares/auth");

const router = express.Router();

// POST - /login - Login Handler
router.post("/login", userController.login);

// POST - /access-token - Create new access token
router.post("/access-token", userController.newAccessToken);

// POST - /verify-email-request - Emails a link that verifies the email
router.post(
  "/verify-email-request",
  authenticated,
  userController.verifyEmailRequest
);

// GET - /verify-email/:token - Verifies user's email
router.get("/verify-email/:token", authenticated, userController.verifyEmail);

// POST - /register - Register Handler
router.post("/register", userController.register);

// POST - /logout - Logout Handler
router.post("/logout", authenticated, verifiedEmail, userController.logout);

// POST - /forget-password - Forget Password Handler
router.post("/forget-password", userController.forgetPassword);

// POST - /reset-forgeted-password:token - Reset Password Handler
router.post(
  "/reset-forgeted-password/:token",
  userController.resetForgetedPassword
);

// PUT - /change-password/:id - Change Password Handler
router.put(
  "/change-password/:id",
  authenticated,
  userController.changePassword
);

// PUT - /edit-profile/:id - Edit Profile Handler
router.put("/edit-profile/:id", authenticated, userController.editProfile);

// GET - /user-info/:id - Returns the user's info
router.get("/user-info", authenticated, userController.userInfo);

// GET - /save-post/:id - Saves a post
router.get("/save-post/:id", authenticated, userController.savePost);

// GET - /unsave-post/:id - Unsaves a post
router.get("/unsave-post/:id", authenticated, userController.unsavePost);

module.exports = router;
