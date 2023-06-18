const fs = require("fs");

const sharp = require("sharp");
const shortid = require("shortid");
const appRoot = require("app-root-path");

const Blog = require("../models/blogModel");
const Tag = require("../models/tagModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const { createError } = require("../middlewares/errors");

// All Posts
exports.showAllPosts = async () => {
  const posts = await Blog.find().populate([
    "user",
    "comments",
    "tags",
    "category",
  ]);

  if (!posts) {
    throw createError(404, "", "no post found");
  }

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

  if (!post) {
    throw createError(404, "", "no post found");
  }

  return post;
};

// Create Post
exports.createPost = async (
  title,
  body,
  status,
  tags,
  category,
  thumbnail,
  user
) => {
  const fileName = `${shortid.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
  tags = tags ? tags.split(",") : null;

  await Blog.postValidation({
    title,
    body,
    status,
    category,
    thumbnail,
    user,
  });

  const theCategory = await Category.findOne({ name: category });
  if (!theCategory) {
    throw createError(404, "", "no category found");
  }

  await sharp(thumbnail.data)
    .jpeg({ quality: 60 })
    .toFile(uploadPath)
    .catch(() => {
      throw createError(422, "", "image didn't upload");
    });

  const post = await Blog.create({
    title,
    body,
    status,
    category: theCategory.id,
    user,
    thumbnail: fileName,
  });

  const theUser = await User.findById(user);
  theUser.posts.push(post.id);
  await theUser.save();

  theCategory.posts.push(post.id);
  await theCategory.save();

  if (tags) {
    for (const tag of tags) {
      const theTag = await Tag.findOne({ name: tag });
      if (!theTag) {
        const createdTag = await Tag.create({ name: tag, posts: [post.id] });
        post.tags.push(createdTag.id);
        await post.save();
      } else {
        theTag.posts.push(post.id);
        post.tags.push(theTag.id);
        await theTag.save();
        await post.save();
      }
    }
  }
};

// Edit Post
exports.editPost = async (
  id,
  title,
  body,
  status,
  tags,
  category,
  thumbnail,
  user
) => {
  const post = await Blog.findById(id);

  if (!post) {
    throw createError(404, "", "post not found");
  }

  const fileName = `${shortid.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
  tags = tags ? tags.split(",") : null;

  if (thumbnail.name) {
    await Blog.postValidation({
      title,
      body,
      status,
      category,
      thumbnail,
      user,
    });
  } else {
    await Blog.postValidation({
      title,
      body,
      status,
      category,
      user,
      thumbnail: {
        name: "sss",
        size: 0,
        mimetype: "image/jpeg",
      },
    });
  }

  const theUser = await User.findById(user).populate("roles");
  const isUserAdmin = theUser.roles.find((s) => s.name == "admin");

  if (post.user.toString() === user.toString() || isUserAdmin) {
    if (thumbnail.name) {
      fs.unlink(
        `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
        async (err) => {
          if (err) return console.log(err);
          await sharp(thumbnail.data)
            .jpeg({ quality: 60 })
            .toFile(uploadPath)
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }

    const newCategory = await Category.findOne({ name: category });
    if (newCategory.id.toString() !== post.category.toString()) {
      if (!newCategory) {
        throw createError(404, "", "no category found");
      }
      const oldCategory = await Category.findById(post.category.toString());

      newCategory.posts.push(post.id);
      post.category = newCategory.id;

      const startIndexOfPost = oldCategory.posts.findIndex(
        (s) => s.toString() == post.id.toString()
      );
      oldCategory.posts.splice(startIndexOfPost, 1);

      await post.save();
      await newCategory.save();
      await oldCategory.save();
    }

    for (const tag of post.tags) {
      const theTag = await Tag.findById(tag.toString());

      const startIndexOfPost = theTag.posts.findIndex(
        (s) => s.toString() == post.id.toString()
      );
      theTag.posts.splice(startIndexOfPost, 1);

      await theTag.save();
    }

    post.tags = [];

    if (tags) {
      for (const tag of tags) {
        const theTag = await Tag.findOne({ name: tag });

        const isTheTagAlreadyInUse = theTag.posts.find((s) => s === post.id);

        if (!theTag) {
          const createdTag = await Tag.create({
            name: tag,
            posts: [post.id],
          });
          post.tags.push(createdTag.id);
          await post.save();
        } else {
          if (!isTheTagAlreadyInUse) theTag.posts.push(post.id);
          post.tags.push(theTag.id);
          await theTag.save();
          await post.save();
        }
      }
    }

    post.title = title;
    post.status = status;
    post.body = body;
    post.updatedAt = Date.now();
    post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

    await post.save();
  } else {
    throw createError(401, "", "don't have the permission to edit");
  }
};

// Delete Post
exports.deletePost = async (id, userId) => {
  const post = await Blog.findById(id);

  if (!post) {
    throw createError(404, "", "post not found");
  }

  const user = await User.findById(userId).populate("roles");
  const isUserAdmin = user.roles.find((s) => s.name == "admin");

  if (post.user.toString() === user.id.toString() || isUserAdmin) {
    const post = await Blog.findByIdAndRemove(id);
    const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        throw createError(400, "", "image didn't delete");
      }
    });

    const category = await Category.findById(post.category);
    const startIndexOfCategoryPost = category.posts.findIndex(
      (s) => s.toString() == post.id.toString()
    );
    category.posts.splice(startIndexOfCategoryPost, 1);
    await category.save();

    for (const tag of post.tags) {
      const theTag = await Tag.findById(tag);
      const startIndexOfTagPost = theTag.posts.findIndex(
        (s) => s.toString() == post.id.toString()
      );
      theTag.posts.splice(startIndexOfTagPost, 1);
      await theTag.save();
    }

    const startIndexOfUserPost = user.posts.findIndex(
      (s) => s.toString() == post.id.toString()
    );
    user.posts.splice(startIndexOfUserPost, 1);
    await user.save();
  } else {
    throw createError(401, "", "don't have the permission to delete");
  }
};

// Upload Image
exports.uploadImage = async (image) => {
  if (!image) {
    throw createError(404, "", "no image found");
  }

  await Blog.singleImageValidation({ image });

  const fileName = `${shortid.generate()}_${image.name}`;
  await sharp(image.data)
    .jpeg({
      quality: 60,
    })
    .toFile(`./public/uploads/${fileName}`)
    .catch((err) => {
      if (err) throw createError("402", "", "image didn't upload");
    });

  const url = `${process.env.DOMAIN}/uploads/${fileName}`;

  return url;
};
