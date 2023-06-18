const express = require("express");

const {
  authenticated,
  requireRoles,
  verifiedEmail,
} = require("../middlewares/auth");
const tagController = require("../controllers/tagController");

const router = express.Router();

// GET - /admin/tags/ - Show All Tags
router.get(
  "/",
  authenticated,
  verifiedEmail,
  requireRoles,
  tagController.showAll
);

// GET - /admin/tags/post-tags/:id - Show Tags of one Post
router.get(
  "/post-tags/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  tagController.postTags
);

// POST - /admin/tags/create-tag - Create tag
router.post(
  "/create-tag",
  authenticated,
  verifiedEmail,
  requireRoles,
  tagController.createTag
);

// PUT - /admin/tags/edit-tag/:id - Edits a tag
router.put(
  "/edit-tag/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  tagController.editTag
);

// DELETE - /admin/tags/delete-tag/:id - Deletes a tag
router.delete(
  "/delete-tag/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  tagController.deleteTag
);

module.exports = router;
