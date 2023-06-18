const service = require("../services/userManagementService");

// GET - /admin/users - Shows All the Users
exports.showAllUsers = async (req, res, next) => {
  try {
    const users = await service.showAllUsers();
    await res.status(200).json({ users });
  } catch (err) {
    next();
  }
};

// PUT - /admin/users/add-role/:id - Adds a Role
exports.addRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const roleName = req.body.name;
    const { user, usedRoles, unusedRoles } = await service.addRole(
      id,
      roleName
    );
    res.status(200).json({ user, usedRoles, unusedRoles });
  } catch (err) {
    next(err);
  }
};

// PUT - /admin/users/remove-role/:id - Removes a Role
exports.removeRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const roleName = req.body.name;
    const { user, usedRoles, unusedRoles } = await service.removeRole(
      id,
      roleName
    );
    res.status(200).json({ user, usedRoles, unusedRoles });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/users/detail-user/:id - Shows Details of a User
exports.detailUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await service.detailUser(id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
