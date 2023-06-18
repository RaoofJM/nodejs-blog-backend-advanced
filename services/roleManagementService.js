const { createError } = require("../middlewares/errors");
const Role = require("../models/roleModel");
const User = require("../models/userModel");

// Show All Roles
exports.showAllRoles = async () => {
  const roles = await Role.find().populate(["urls", "users"]);
  const rolesCount = await Role.find().countDocuments();
  return { roles, rolesCount };
};

// Add Role
exports.addRole = async (name) => {
  await Role.roleValidation({ name });

  const isRoleNameInUse = await Role.findOne({ name });
  if (isRoleNameInUse) {
    throw createError(402, "", "name is already taken");
  }

  await Role.create({ name });
};

// Edit Role
exports.editRole = async (id, name) => {
  const role = await Role.findOne({
    _id: id,
  });

  if (!role) {
    throw createError(404, "", "role not found");
  }

  await Role.roleValidation({ name });

  role.name = name;
  await role.save();
};

// Delete Role
exports.deleteRole = async (id) => {
  const role = await Role.findByIdAndRemove(id);

  if (!role) {
    throw createError(404, "", "role not found");
  }

  const users = await User.find({ roles: { $in: [id] } });

  for (const user of users) {
    const startIndex = user.roles.findIndex(
      (s) => s.toString() == id.toString()
    );
    user.roles.splice(startIndex, 1);
    await user.save();
  }
};

// Detail Role
exports.detailRole = async (id) => {
  const role = await Role.findOne({
    _id: id,
  }).populate(["urls", "users"]);

  if (!role) {
    throw createError(404, "", "role not found");
  }

  const users = await User.find({ roles: { $in: [role._id] } });

  return { role, users };
};
