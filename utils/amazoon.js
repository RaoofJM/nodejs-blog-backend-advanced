const cheerio = require("cheerio");
const fetch = require("node-fetch");
const axios = require("axios");

const { parentPort, workerData } = require("worker_threads");

const { link } = workerData;

async function makeRequest(url) {
  try {
    console.log(link);

    const response = await axios.get(url);

    const htmlContent = await response.data;
    console.log(htmlContent);
    return htmlContent;
  } catch (error) {
    return { error: "try again" };
  }
}

(async () => {
  await makeRequest(link)
    .then((data) => {
      if (data && !data.error) {
        const $ = cheerio.load(data);
        const englishTitle = $("#productTitle").text().trim();
        let dollarPrice = $(".a-offscreen").first().text().trim();
        dollarPrice = dollarPrice.replace("AED", "");
        dollarPrice = parseFloat(dollarPrice);
        const toomanPrice = dollarPrice * 54000;

        parentPort.postMessage({ englishTitle, dollarPrice, toomanPrice });
      } else {
        parentPort.postMessage({ error: "try againn" });
      }
    })
    .catch((err) => {
      return { error: "something went wrong" };
    });
})();
