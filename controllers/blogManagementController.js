const { use } = require("../routes/blogRouter");
const service = require("../services/blogManagementService");

// GET - /admin/blogs/all - Shows All the Posts
exports.showAllPosts = async (req, res, next) => {
  try {
    const posts = await service.showAllPosts();
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

// GET - /admin/blogs/single-post/:id - Shows All the Posts
exports.singlePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await service.singlePost(id);
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/blogs/create-post - Creates a new post
exports.createPost = async (req, res, next) => {
  try {
    const thumbnail = req.files ? req.files.thumbnail : {};
    const user = req.userId;
    const { title, body, status, tags, category } = req.body;
    await service.createPost(
      title,
      body,
      status,
      tags,
      category,
      thumbnail,
      user
    );
    res.status(201).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /admin/blogs/edit-post/:id - Edits a post
exports.editPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const thumbnail = req.files ? req.files.thumbnail : {};
    const user = req.userId;
    const { title, body, status, tags, category } = req.body;
    await service.editPost(
      id,
      title,
      body,
      status,
      tags,
      category,
      thumbnail,
      user
    );
    res.status(201).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /admin/blogs/delete-post/:id - Deletes a post
exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.userId;
    await service.deletePost(id, user);
    res.status(201).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// POST - /admin/blogs/upload-image - Image Upload Handler
exports.uploadImage = async (req, res, next) => {
  try {
    const image = req.files ? req.files.image : null;
    const url = await service.uploadImage(image);
    res.status(200).json({ url });
  } catch (err) {
    next(err);
  }
};
