const mongoose = require("mongoose");

const schemas = require("./secure/categoryValidation");

// Main Mongoose Schema for category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set category Validation in Statics
categorySchema.statics.categoryValidation = function (body) {
  return schemas.categoryScheme.validate(body, { abortEarly: false });
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
