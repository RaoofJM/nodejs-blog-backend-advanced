const { createError } = require("../middlewares/errors");
const Blog = require("../models/blogModel");

const redis = require("redis");

const client = redis.createClient();
// All Posts
exports.showAllPosts = async () => {
  if (!client.isOpen) await client.connect();

  const cachedPosts = JSON.parse(await client.get("public_posts"));
  if (cachedPosts) {
    return cachedPosts;
  }

  const posts = await Blog.find({ status: "public" }).populate([
    "user",
    "comments",
    "tags",
    "category",
  ]);

  if (!posts) {
    throw createError(404, "", "no post found");
  }

  await client.set("public_posts", JSON.stringify(posts));
  await client.expire("public_posts", 900);

  return posts;
};

// Singe Post
exports.singlePost = async (id) => {
  const post = await Blog.findById(id).populate([
    "user",
    "comments",
    "tags",
    "category",
  ]);

  if (!post || post.status !== "public") {
    throw createError(404, "", "no post found");
  }

  post.views++;
  post.save();

  return post;
};

// Like Post
exports.likePost = async (id) => {
  const post = await Blog.findById(id);

  if (!post || post.status !== "public") {
    throw createError(404, "", "no post found");
  }

  post.likes++;
  post.save();
};
