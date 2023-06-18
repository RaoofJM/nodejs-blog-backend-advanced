const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const { createError } = require("../middlewares/errors");

//Get All
exports.getAllComments = async () => {
  const comments = await Comment.find();
  return comments;
};

//Get One Post't Comments
exports.getCommentsOfPost = async (id) => {
  const comments = await Comment.find({ post: id });
  return comments;
};

// Add Comment
exports.addComment = async (
  fullname,
  email,
  body,
  parentComment,
  user,
  post
) => {
  await Comment.commentValidation({ fullname, email, body });

  const thePost = await Blog.findById(post);
  const theUser = await User.findById(user);

  if (!thePost) {
    throw createError(401, "", "post is not found");
  }

  const commnet = await Comment.create({
    fullname,
    email,
    body,
    parentComment,
    user: theUser ? theUser.id : null,
    post,
  });
  if (theUser) {
    theUser.comments.push(commnet._id);
    await theUser.save();
  }
  thePost.comments.push(commnet._id);
  await thePost.save();
};

// Edit Comment
exports.editComment = async (id, body, status, userId) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw createError(404, "", "no comment found");
  }

  if (comment.user) {
    if (comment.user.toString() !== userId.toString()) {
      throw createError(404, "", "comment's writer and the user don't match");
    }
  } else {
    throw createError(404, "", "this comment doesn't have a user");
  }

  await Comment.commentValidation({
    fullname: comment.fullname,
    email: comment.email,
    body,
    status,
  });

  comment.body = body;
  await comment.save();
};

// Admin Edit Comment
exports.adminEditComment = async (id, body, status) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw createError(404, "", "no comment found");
  }

  await Comment.commentValidation({
    fullname: comment.fullname,
    email: comment.email,
    body,
    status,
  });

  comment.body = body;
  comment.status = status;
  await comment.save();
};

// Admin Delete Comment
exports.adminDeleteComment = async (id) => {
  const comment = await Comment.findByIdAndDelete(id);
  const user = await User.findById(comment.user);
  const post = await Blog.findById(comment.post);

  if (user) {
    const startIndexOfUserComment = user.comments.findIndex(
      (s) => s.toString() == comment._id.toString()
    );
    user.comments.splice(startIndexOfUserComment, 1);
    await user.save();
  }

  const startIndexOfPostComment = post.comments.findIndex(
    (s) => s.toString() == comment._id.toString()
  );
  post.comments.splice(startIndexOfPostComment, 1);

  await post.save();
};
