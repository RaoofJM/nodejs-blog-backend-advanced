const service = require("../services/urlRoleService");

// GET - /admin/url-roles - Shos All the Urls
exports.showAll = async (req, res, next) => {
  try {
    const urls = await service.showAll();
    res.status(200).json({ urls: urls });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/url-roles/detail-url/:id - Url Detail
exports.showDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const url = await service.showDetail(id);
    res.status(200).json({ url });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/url-roles/add-url - Add Url Handler
exports.addUrlRole = async (req, res, next) => {
  try {
    const { url, description, roles } = req.body;
    await service.addUrlRole(url, description, roles);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /admin/url-roles/edit-url/:id - Edits a Url
exports.editUrlRole = async (req, res, next) => {
  try {
    const { url, description, roles } = req.body;
    const id = req.params.id;
    await service.editUrlRole(id, url, description, roles);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /admin/url-roles/delete-url/:id - Deletes a Url
exports.deleteUrlRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.deleteUrlRole(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};
