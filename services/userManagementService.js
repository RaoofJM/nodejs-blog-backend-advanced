const User = require("../models/userModel");
const Role = require("../models/roleModel");
const { createError } = require("../middlewares/errors");

// Show All Users
exports.showAllUsers = async () => {
  const users = await User.find().populate("roles");
  return users;
};

// Add Role
exports.addRole = async (id, roleName) => {
  const user = await User.findOne({ _id: id }).populate("roles");

  if (!user) {
    throw createError(404, "", "no user found");
  }

  if (!roleName) {
    throw createError(422, "", "role's name is required");
  }

  let unusedRoles = await Role.find({ _id: { $nin: user.roles } });
  let usedRoles = user.roles;

  const roles = await Role.countDocuments({
    name: { $regex: new RegExp(roleName, "i") },
  });

  const isRoleAlreadyUsed = usedRoles.find((s) => s.name == roleName);
  if (isRoleAlreadyUsed) {
    // The role is already assigned to the user
    throw createError(402, "", "the role is already in use");
  } else if (roles == 0) {
    // The role doesn't exist
    throw createError(404, "", "no role found");
  } else if (roles > 1) {
    // There is more than one role found
    throw createError(402, "", "there is more than one role");
  } else {
    // ٍEverything is ok
    const role = await Role.findOne({ name: roleName });
    user.roles.push(role);
    role.users.push(user._id);

    await user.save();
    await role.save();

    const updatedUser = await User.findOne({ _id: id }).populate("roles");
    unusedRoles = await Role.find({ _id: { $nin: user.roles } });
    usedRoles = updatedUser.roles;

    return { user, usedRoles, unusedRoles };
  }
};

// Remove Role
exports.removeRole = async (id, roleName) => {
  const user = await User.findOne({ _id: id }).populate("roles");

  if (!user) {
    throw createError(404, "", "no user found");
  }

  if (!roleName) {
    throw createError(422, "", "role's name is required");
  }

  let unusedRoles = await Role.find({ _id: { $nin: user.roles } });
  let usedRoles = user.roles;

  const isRoleAlreadyUsed = usedRoles.find((s) => s.name == roleName);

  if (!isRoleAlreadyUsed) {
    // The role is already assigned to the user
    throw createError(404, "", "there is not a role like this on in use");
  } else {
    // ٍEverything is ok
    const role = await Role.findOne({ name: roleName });

    const startIndexOfUserRole = user.roles.findIndex(
      (s) => s.toString() == role._id.toString()
    );
    user.roles.splice(startIndexOfUserRole, 1);

    const startIndexOfRoleUser = role.users.findIndex(
      (s) => s.toString() == user._id.toString()
    );
    role.users.splice(startIndexOfRoleUser, 1);

    await user.save();
    await role.save();

    updatedUser = await User.findOne({ _id: id }).populate("roles");
    unusedRoles = await Role.find({ _id: { $nin: user.roles } });
    usedRoles = updatedUser.roles;

    return { user, usedRoles, unusedRoles };
  }
};

// Detail User
exports.detailUser = async (id) => {
  const user = await User.findOne({ _id: id }).populate("roles");

  if (!user) {
    throw createError(404, "", "no user found");
  }

  return user;
};
