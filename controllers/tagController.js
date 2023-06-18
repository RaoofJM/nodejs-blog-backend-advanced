const service = require("../services/tagService");

// GET - /admin/tags/ - Show All Tags
exports.showAll = async (req, res, next) => {
  try {
    const tags = await service.showAll();
    res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/tags/post-tags/:id - Show Tags of one Post
exports.postTags = async (req, res, next) => {
  try {
    const id = req.params.id;
    const posts = await service.postTags(id);
    res.status(200).json({ posts: posts });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/tags/create-tag - Create tag
exports.createTag = async (req, res, next) => {
  try {
    const { name, description, color, posts } = req.body;
    await service.createTag(name, description, color, posts);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /admin/tags/edit-tag/:id - Edits a tag
exports.editTag = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, color } = req.body;
    await service.editTag(id, name, description, color);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /admin/tags/delete-tag/:id - Deletes a tag
exports.deleteTag = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.deleteTag(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};
