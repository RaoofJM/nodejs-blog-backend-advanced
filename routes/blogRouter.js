const express = require("express");

const blogController = require("../controllers/blogController");

const router = express.Router();

// GET - /p/all - Shows All the Posts
router.get("/all", blogController.showAllPosts);

// GET - /p/single-post/:id - Shows All the Posts
router.get("/single-post/:id", blogController.singlePost);

// GET - /p/like/:id - Likes a post
router.get("/like/:id", blogController.likePost);

module.exports = router;
