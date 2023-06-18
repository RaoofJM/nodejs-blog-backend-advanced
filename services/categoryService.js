const { createError } = require("../middlewares/errors");
const Category = require("../models/categoryModel");

// Show All Categories
exports.showAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

// Detail Category
exports.detailCategory = async (id) => {
  const category = await Category.findOne({
    _id: id,
  }).populate("parentCategory");

  if (!category) {
    throw createError(404, "", "category not found");
  }

  return category.posts;
};

// Category's Posts
exports.showPostsCategory = async (id) => {
  const category = await Category.findOne({
    _id: id,
  }).populate("posts");

  if (!category) {
    throw createError(404, "", "category not found");
  }

  return { category };
};

// Create Category
exports.createCategory = async (name, description, parentCategory) => {
  await Category.categoryValidation({ name, description, parentCategory });

  const isCategoryNameInUse = await Category.findOne({ name });
  if (isCategoryNameInUse) {
    throw createError(402, "", "name is already taken");
  }

  const theParentCategory = await Category.findOne({
    $and: [{ name: parentCategory }, { name: { $ne: name } }],
  });

  await Category.create({
    name,
    description,
    parentCategory: theParentCategory ? theParentCategory._id : null,
    posts: [],
  });
};

// Edit Category
exports.editCategory = async (id, name, description, parentCategory) => {
  const category = await Category.findById(id);

  if (!category) {
    throw createError(404, "", "no category found");
  }

  await Category.categoryValidation({ name, description, parentCategory });

  const theParentCategory = await Category.findOne({
    $and: [{ name: parentCategory }, { name: { $ne: name } }],
  });

  category.parentCategory = theParentCategory ? theParentCategory._id : null;
  category.name = name;
  category.description = description;
  await category.save();
};

// Delete Category
exports.deleteCategory = async (id) => {
  const category = await Category.findOne({
    _id: id,
  });

  if (!category) {
    throw createError(404, "", "category not found");
  }

  const categories = await Category.find({ parentCategory: id });

  for (const theCategory of categories) {
    theCategory.parentCategory = null;
    await theCategory.save();
  }

  await Category.findByIdAndRemove(id);
};
