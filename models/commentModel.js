const mongoose = require("mongoose");

const schemas = require("./secure/commentValidation");

// Main Mongoose Schema for Comment
const commentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  status: {
    type: String,
    default: "waiting",
    enum: ["waiting", "rejected", "confirmed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set Comment Validation in Statics
commentSchema.statics.commentValidation = function (body) {
  return schemas.addCommentScheme.validate(body, { abortEarly: false });
};

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
