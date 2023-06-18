const service = require("../services/blogService");

// GET - /p/all - Shows All the Posts
exports.showAllPosts = async (req, res, next) => {
  try {
    const posts = await service.showAllPosts();
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

// GET - /p/single-post/:id - Shows All the Posts
exports.singlePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await service.singlePost(id);
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

// GET - /p/like/:id - Likes a post
exports.likePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.likePost(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};
