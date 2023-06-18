const newsScrapperController = require("../controllers/newsScrapperController");
const {
  requireRoles,
  authenticated,
  verifiedEmail,
} = require("../middlewares/auth");

const express = require("express");

const router = express.Router();

// GET - /news-scrapper - Shows all the NewsScrappers
router.get(
  "/",
  authenticated,
  verifiedEmail,
  requireRoles,
  newsScrapperController.showAll
);

// GET - /news-scrapper/detail/:id - Shows One NewsScrapper
router.get(
  "/detail/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  newsScrapperController.deleteNewsScrapper
);

// POST - /news-scrapper/create - Creates a NewsScrapper
router.post(
  "/create",
  authenticated,
  verifiedEmail,
  requireRoles,
  newsScrapperController.createNewsScrapper
);

// PUT - /news-scrapper/edit/:id - Edits a NewsScrapper
router.put(
  "/edit/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  newsScrapperController.editNewsScrapper
);

// DELETE - /news-scrapper/delete/:id - Deletes a NewsScrapper
router.delete(
  "/delete/:id",
  authenticated,
  verifiedEmail,
  requireRoles,
  newsScrapperController.deleteNewsScrapper
);

// POST - /news-scrapper/scrap - Scraps the news
router.post("/scrap", newsScrapperController.scrap);
router.post("/amazoon", newsScrapperController.amazoonScrap);

module.exports = router;
