const mongoose = require("mongoose");

const schemas = require("./secure/roleValidation");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  urls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UrlRole",
      default: [],
    },
  ],
});

// Set Role Validation in Statics
roleSchema.statics.roleValidation = function (body) {
  return schemas.addRoleSchema.validate(body, { abortEarly: false });
};

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
