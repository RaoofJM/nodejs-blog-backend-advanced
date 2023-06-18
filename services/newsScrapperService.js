const NewsScrapper = require("../models/newsScrapperModel");
const { createError } = require("../middlewares/errors");
const axios = require("axios");
const cheerio = require("cheerio");
const redis = require("redis");

const { Worker } = require("worker_threads");
const appRootPath = require("app-root-path");

const client = redis.createClient();

// Show all new scrappers
exports.showAll = async () => {
  const newsScrappers = await NewsScrapper.find();
  return newsScrappers;
};

// Show one news scrapper
exports.detailNewsScrapper = async (id) => {
  const newsScrapper = await NewsScrapper.findById(id);
  return newsScrapper;
};

// Creates a news scrapper
exports.createNewsScrapper = async (
  url,
  selector,
  titleTag,
  linkTag,
  descriptionTag
) => {
  await NewsScrapper.newsScrapperValidation({
    url,
    selector,
    titleTag,
    linkTag,
    descriptionTag,
  });

  const newsScrapper = await NewsScrapper.create({
    url,
    selector,
    titleTag,
    linkTag,
    descriptionTag,
  });
};

// Edits one news scrapper
exports.editNewsScrapper = async (
  id,
  url,
  selector,
  titleTag,
  linkTag,
  descriptionTag
) => {
  const newsScrapper = await NewsScrapper.findById(id);

  if (!newsScrapper) {
    throw createError(404, "", "no news scrapper found");
  }

  await NewsScrapper.findByIdAndUpdate(id, {
    url,
    selector,
    titleTag,
    linkTag,
    descriptionTag,
  });
};

// Deletes a news scrapper
exports.deleteNewsScrapper = async (id) => {
  const newsScrapper = await NewsScrapper.findById(id);

  if (!newsScrapper) {
    throw createError(404, "", "no news scrapper found");
  }

  await NewsScrapper.findByIdAndRemove(id);
};

// Scrap
exports.scrap = async (limit) => {
  if (!client.isOpen) await client.connect();

  const cachedAricles = JSON.parse(await client.get("scrapped_news"));
  if (cachedAricles) {
    return cachedAricles.slice(0, limit);
  }

  if (limit) {
    limit = +limit;
    if (!limit) throw createError(402, "", "limit is not acceptable");
  }

  const newsScrappers = await NewsScrapper.find();

  const workerData = {
    limit,
    newsScrappers,
  };
  const worker = new Worker(`./utils/newsScrapperWorker.js`, {
    workerData,
  });

  return new Promise((resolve, reject) => {
    worker.on("message", (result) => {
      resolve(result.slice(0, limit));
    });

    worker.on("error", (err) => {
      reject(err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

exports.amazoonScrap = async (link) => {
  if (!link) throw createError(404, " ", "link required");

  const workerData = {
    link,
  };
  const worker = new Worker(`./utils/amazoon.js`, {
    workerData,
  });

  return new Promise((resolve, reject) => {
    worker.on("message", (result) => {
      resolve(result);
    });

    worker.on("error", (err) => {
      console.log("sss");
      reject(err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};
