const service = require("../services/commentService");

// GET - /comments/all-comments - Shows all the coments
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await service.getAllComments();
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

// GET - /comments/post-comment/:id - Shows comments of a post
exports.getCommentsOfPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comments = await service.getCommentsOfPost(id);
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

// POST - /comments/add-comment - Adds a new comment
exports.addComment = async (req, res, next) => {
  try {
    const { fullname, email, body, parentComment, user, post } = req.body;
    await service.addComment(fullname, email, body, parentComment, user, post);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /comments/edit-comment/:id - Edits a comment
exports.editComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const { body, status } = req.body;
    await service.editComment(id, body, status, userId);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /comments/admin-edit-comment/:id - Edits a comment as an admin
exports.adminEditComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { body, status } = req.body;
    await service.adminEditComment(id, body, status);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /comments/delete-comment/:id - Deletes a comment as an admin
exports.adminDeleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.adminDeleteComment(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};
