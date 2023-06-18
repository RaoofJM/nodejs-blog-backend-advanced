const Tag = require("../models/tagModel");
const Blog = require("../models/blogModel");
const { createError } = require("../middlewares/errors");

// All Tags
exports.showAll = async () => {
  const tags = await Tag.find();
  return tags;
};

// Tags of one post
exports.postTags = async (id) => {
  const posts = await Tag.find({ posts: { $in: [id] } });
  return posts;
};

// Create a new tag
exports.createTag = async (name, description, color, posts) => {
  await Tag.tagValidation({ name, description, color });

  const tag = await Tag.findOne({ name });
  if (tag) {
    throw createError(402, "", "name is already taken");
  }

  await Tag.create({ name, color, description, posts });
};

// Edit Tag
exports.editTag = async (id, name, description, color) => {
  const tag = await Tag.findById(id);
  if (!tag) {
    throw createError(404, "", "no tag found");
  }

  await Tag.tagValidation({ name, description, color });

  tag.name = name;
  tag.color = color;
  tag.description = description;
  await tag.save();
};

// Delete Tag
exports.deleteTag = async (id) => {
  const tag = await Tag.findByIdAndRemove(id);
  if (!tag) {
    throw createError(404, "", "no tag found");
  }

  const posts = await Blog.find({ tags: { $in: [id] } });

  for (const post of posts) {
    const startIndex = post.tags.findIndex(
      (s) => s.toString() == id.toString()
    );
    post.tags.splice(startIndex, 1);
    await post.save();
  }
};
