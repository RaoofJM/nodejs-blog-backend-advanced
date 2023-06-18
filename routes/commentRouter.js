const express = require("express");

const {
  authenticated,
  requireRoles,
  verifiedEmail,
} = require("../middlewares/auth");
const commentController = require("../controllers/commentController");

const router = express.Router();

// GET - /comments/all-comments - Shows all the coments
router.get(
  "/all-comments",
  authenticated,
  verifiedEmail,
  requireRoles,
  commentController.getAllComments
);

// GET - /comments/post-comment/:id - Shows comments of a post
router.get("/post-comment/:id", commentController.getCommentsOfPost);

// POST - /comments/add-comment - Adds a new comment
router.post("/add-comment", commentController.addComment);

// PUT - /comments/edit-comment/:id - Edits a comment
router.put("/edit-comment/:id", authenticated, commentController.editComment);

// PUT - /comments/admin-edit-comment/:id - Edits a comment as an admin
router.put(
  "/admin-edit-comment/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  commentController.adminEditComment
);

// DELETE - /comments/delete-comment/:id - Deletes a comment as an admin
router.delete(
  "/delete-comment/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  commentController.adminDeleteComment
);

module.exports = router;
