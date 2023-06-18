const axios = require("axios");
const cheerio = require("cheerio");
const redis = require("redis");

const { parentPort, workerData } = require("worker_threads");

const { newsScrappers } = workerData;
const { createError } = require("../middlewares/errors");

const client = redis.createClient();

let articles = [];

(async () => {
  if (!client.isOpen) await client.connect();

  for (const newsScrapper of newsScrappers) {
    const response = await axios.get(newsScrapper._doc.url);
    const $ = cheerio.load(response.data);
    $(newsScrapper._doc.selector).each((i, element) => {
      const title = $(element).find(newsScrapper._doc.titleTag).text().trim();
      const link = $(element).find(newsScrapper._doc.linkTag).attr("href");
      const description = $(element)
        .find(newsScrapper._doc.descriptionTag)
        .text()
        .trim();
      articles.push({ title, link, description });
    });
  }

  await client.set("scrapped_news", JSON.stringify(articles));
  await client.expire("scrapped_news", 900);

  parentPort.postMessage(articles);
})();
