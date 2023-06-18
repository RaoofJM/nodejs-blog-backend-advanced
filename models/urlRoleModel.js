const mongoose = require("mongoose");

const schemas = require("./secure/urlRoleValidation");

const urlRoleSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: [],
    },
  ],
});

// Set Url Role Validation in Statics
urlRoleSchema.statics.urlRoleValidation = function (body) {
  return schemas.urlRoleValidation.validate(body, { abortEarly: false });
};

const UrlRole = mongoose.model("UrlRole", urlRoleSchema);

module.exports = UrlRole;
