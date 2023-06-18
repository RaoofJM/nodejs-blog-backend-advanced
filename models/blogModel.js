const mongoose = require("mongoose");

const schemas = require("./secure/blogValidation");

// Main Mongoose Schema for Blog
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "draft",
    enum: ["public", "draft", "archived"],
  },
  thumbnail: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: [],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.index({ title: "text" });

// Set Post Validation in Statics
blogSchema.statics.postValidation = function (body) {
  return schemas.addPostSchema.validate(body, { abortEarly: false });
};

// Set Single Image Upload Validation in Statics
blogSchema.statics.singleImageValidation = function (body) {
  return schemas.singleImageSchema.validate(body, { abortEarly: false });
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
