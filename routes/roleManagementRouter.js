const express = require("express");

const roleManagementController = require("../controllers/roleManagementController");
const {
  authenticated,
  requireRoles,
  verifiedEmail,
} = require("../middlewares/auth");

const router = express.Router();

// GET - /admin/roles - Shos All the Role
router.get(
  "/",
  authenticated,
  verifiedEmail,
  requireRoles,
  roleManagementController.showAllRoles
);

// POST - /admin/roles/add-role - Add Role Handler
router.post(
  "/add-role",
  authenticated,
  verifiedEmail,
  requireRoles,
  roleManagementController.addRole
);

// POST - /admin/roles/edit-role/:id / Edit Role Handler
router.put(
  "/edit-role/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  roleManagementController.editRole
);

// GET - /admin/delete-role/:id / Delete Role
router.delete(
  "/delete-role/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  roleManagementController.deleteRole
);

// GET - /admin/roles/detail-role/:id - Shows The Users of a Role
router.get(
  "/detail-role/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  roleManagementController.detailRole
);

module.exports = router;
