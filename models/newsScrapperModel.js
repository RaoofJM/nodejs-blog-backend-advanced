const mongoose = require("mongoose");

const schemas = require("./secure/newsScrapperValidation");

// Main Mongoose Schema for News Scrapper
const newsScrapperSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  selector: {
    type: String,
    required: true,
  },
  titleTag: {
    type: String,
    required: true,
  },
  linkTag: {
    type: String,
    required: true,
  },
  descriptionTag: {
    type: String,
    required: true,
  },
});

// Set tag Validation in Statics
newsScrapperSchema.statics.newsScrapperValidation = function (body) {
  return schemas.newsScrapperScheme.validate(body, { abortEarly: false });
};

const NewsScrapper = mongoose.model("NewsScrapper", newsScrapperSchema);

module.exports = NewsScrapper;
