const express = require("express");

const categoryController = require("../controllers/categoryController");
const {
  authenticated,
  requireRoles,
  verifiedEmail,
} = require("../middlewares/auth");

const router = express.Router();

// GET - /admin/categories - Shows All Categories
router.get(
  "/",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.showAllCategories
);

// GET - /admin/categories/:id - Shows details of one category
router.get(
  "/detail/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.detailCategory
);

// GET - /admin/categories/posts/:id - Shows posts of one category
router.get(
  "/posts/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.detailCategory
);

// POST - /admin/categories/create - Adds one category
router.post(
  "/create",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.createCategory
);

// PUT - /admin/categories/edit/:id - Edits one category
router.put(
  "/edit/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.editCategory
);

// DELETE - /admin/categories/delete/:id - Deletes one category
router.delete(
  "/delete/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  categoryController.deleteCategory
);

module.exports = router;
