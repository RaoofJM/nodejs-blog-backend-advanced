const { createError } = require("../middlewares/errors");
const service = require("../services/newsScrapperService");

// GET - /news-scrapper - Shows all the NewsScrappers
exports.showAll = async (req, res, next) => {
  try {
    const newsScrappers = await service.showAll();
    res.status(200).json({ newsScrappers });
  } catch (err) {
    next(err);
  }
};

// GET - /news-scrapper/detail/:id - Shows One NewsScrapper
exports.detailNewsScrapper = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newsScrapper = await service.detailNewsScrapper(id);
    res.status(200).json({ newsScrapper });
  } catch (err) {
    next(err);
  }
};

// POST - /news-scrapper/create - Creates a NewsScrapper
exports.createNewsScrapper = async (req, res, next) => {
  try {
    const { url, selector, titleTag, linkTag, descriptionTag } = req.body;
    await service.createNewsScrapper(
      url,
      selector,
      titleTag,
      linkTag,
      descriptionTag
    );
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// PUT - /news-scrapper/edit/:id - Edits a NewsScrapper
exports.editNewsScrapper = async (req, res, next) => {
  try {
    const { url, selector, titleTag, linkTag, descriptionTag } = req.body;
    const id = req.params.id;
    await service.editNewsScrapper(
      id,
      url,
      selector,
      titleTag,
      linkTag,
      descriptionTag
    );
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// DELETE - /news-scrapper/delete/:id - Deletes a NewsScrapper
exports.deleteNewsScrapper = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.deleteNewsScrapper(id);
    res.status(200).json({ message: "done" });
  } catch (err) {
    next(err);
  }
};

// POST - /news-scrapper/scrap - Scraps the news
exports.scrap = async (req, res, next) => {
  try {
    const limit = req.body.limit;
    const articels = await service.scrap(limit);
    res.status(200).json({ articels });
  } catch (err) {
    next(err);
  }
};

exports.amazoonScrap = async (req, res, next) => {
  try {
    const link = req.body.link;
    const result = await service.amazoonScrap(link);
    if (result.error) throw createError(500, "", result.error);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};
