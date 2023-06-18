const mongoose = require("mongoose");

const schemas = require("./secure/tagValidation");

// Main Mongoose Schema for tag
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "white",
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

// Set tag Validation in Statics
tagSchema.statics.tagValidation = function (body) {
  return schemas.tagScheme.validate(body, { abortEarly: false });
};

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
