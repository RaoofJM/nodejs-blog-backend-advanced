const service = require("../services/roleManagementService");

// GET - /admin/roles - Shos All the Role
exports.showAllRoles = async (req, res, next) => {
  try {
    const { roles, rolesCount } = await service.showAllRoles();
    res.status(200).json({ roles, total: rolesCount });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/roles/add-role - Add Role Handler
exports.addRole = async (req, res, next) => {
  try {
    const name = req.body.name;
    await service.addRole(name);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/roles/edit-role/:id / Edit Role Handler
exports.editRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await service.editRole(id, name);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/delete-role/:id / Delete Role
exports.deleteRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.deleteRole(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/roles/detail-role/:id - Shows The Users of a Role
exports.detailRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { role, users } = await service.detailRole(id);
    res.status(200).json({ role, users });
  } catch (err) {
    next(err);
  }
};
