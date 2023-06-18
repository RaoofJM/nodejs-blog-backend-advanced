const service = require("../services/categoryService");

// GET - /admin/categories - Shows all categories
exports.showAllCategories = async (req, res, next) => {
  try {
    const categories = await service.showAllCategories();
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/categories/detail/:id - Shows details of one category
exports.detailCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await service.detailCategory(id);
    res.status(200).json({ category });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/categories/posts/:id - Shows posts of one category
exports.showPostsCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const posts = await service.showPostsCategory(id);
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/categories/create - Adds one category
exports.createCategory = async (req, res, next) => {
  const { name, description, parentCategory } = req.body;
  try {
    await service.createCategory(name, description, parentCategory);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /admin/categories/edit/:id - Edits one category
exports.editCategory = async (req, res, next) => {
  const { name, description, parentCategory } = req.body;
  const id = req.params.id;
  try {
    await service.editCategory(id, name, description, parentCategory);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /admin/categories/delete/:id - Deletes one category
exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.deleteCategory(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(er);
  }
};
