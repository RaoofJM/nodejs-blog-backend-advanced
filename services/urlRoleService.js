const { url } = require("inspector");
const { createError } = require("../middlewares/errors");
const Role = require("../models/roleModel");
const UrlRole = require("../models/urlRoleModel");

// Show All Urls
exports.showAll = async () => {
  const urls = await UrlRole.find().populate("roles");
  return { urls };
};

// Url Detail
exports.showDetail = async (id) => {
  const url = await UrlRole.findById(id).populate("roles");

  if (!url) {
    throw createError(404, "", "url not found");
  }

  return url;
};

// Add Url
exports.addUrlRole = async (url, description, roles) => {
  await UrlRole.urlRoleValidation({ url });

  roles = roles ? roles.split(",") : null;
  description = description ? description : "";

  const isUrlInUse = await UrlRole.findOne({ url });
  if (isUrlInUse) {
    throw createError(402, "", "url is already taken");
  }

  const theUrl = await UrlRole.create({ url, description });

  if (roles) {
    for (const name of roles) {
      const role = await Role.findOne({ name });
      if (role) {
        role.urls.push(theUrl.id);
        theUrl.roles.push(role.id);
        await role.save();
        await theUrl.save();
      }
    }
  }
};

// Edit Url
exports.editUrlRole = async (id, url, description, roles) => {
  const theUrl = await UrlRole.findById(id);

  if (!theUrl) {
    throw createError(404, "", "url not found");
  }

  await UrlRole.urlRoleValidation({ url });

  roles = roles ? roles.split(",") : null;

  const isUrlInUse = await UrlRole.findOne({ url, _id: { $ne: theUrl._id } });
  if (isUrlInUse) {
    throw createError(402, "", "url is already taken");
  }

  for (const role of theUrl.roles) {
    const theRole = await Role.findById(role.toString());

    const startIndexOfUrl = theRole.urls.findIndex(
      (s) => s.toString() == theUrl.id.toString()
    );
    theRole.urls.splice(startIndexOfUrl, 1);

    await theRole.save();
  }

  theUrl.roles = [];

  if (roles) {
    for (const name of roles) {
      const role = await Role.findOne({ name });

      const isTheUrlAlreadyInUse = role.urls.find((s) => s === theUrl.id);

      if (role) {
        if (!isTheUrlAlreadyInUse) role.urls.push(theUrl.id);
        theUrl.roles.push(role.id);
        await role.save();
        await theUrl.save();
      }
    }
  }

  theUrl.url = url;
  theUrl.description = description ? description : "";
  theUrl.save();
};

// Delete Url
exports.deleteUrlRole = async (id) => {
  const url = await UrlRole.findByIdAndRemove(id).populate("roles");

  if (!url) {
    throw createError(404, "", "url not found");
  }

  for (const role of url.roles) {
    const startIndex = role.urls.findIndex(
      (s) => s.toString() == id.toString()
    );
    role.urls.splice(startIndex, 1);
    await role.save();
  }
};
