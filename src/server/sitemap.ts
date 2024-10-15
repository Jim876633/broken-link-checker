import { Browser, chromium } from "playwright";
import { WebSocket } from "ws";
import { WS_RES_TYPE } from "../constants/api.ts";
import { getBaseWsRes } from "../utils/helper/apiHelper.ts";
import {
  checkUrlExist,
  CheckUrlExistType,
  getAllUrlItemList,
  handleError,
} from "./utils.ts";

// get link item (all / broken) from sitemap

async function getLinkItemFromSitemap(sitemapUrl: string, ws: WebSocket) {
  try {
    const pathsFromSitemap = await getWebsitePathsFromSitemap(sitemapUrl);
    const sitemapUrlList = [...new Set(pathsFromSitemap)];

    if (sitemapUrlList.length === 0) {
      throw new Error("No paths found in sitemap");
    }

    ws.send(getBaseWsRes(WS_RES_TYPE.START, "Sitemap URL is available"));

    const browser = await chromium.launch();
    const checkUrlExistMap = new Map();
    const chunkSize = 10;

    for (let i = 0; i < sitemapUrlList.length; i += chunkSize) {
      const chunk = sitemapUrlList.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map((url) => processUrl(url, browser, checkUrlExistMap, ws))
      );
    }

    await browser.close();
  } catch (err) {
    handleError(err, ws);
  }
}

async function processUrl(
  url: string,
  browser: Browser,
  checkUrlExistMap: Map<string, Promise<CheckUrlExistType | null>>,
  ws: WebSocket
) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url, {
    timeout: 60000,
    waitUntil: "domcontentloaded",
  });

  const urlItemList = await getAllUrlItemList(page);
  const urlList = new Set();

  for (const item of urlItemList) {
    if (item.url && !urlList.has(item.url)) {
      urlList.add(item.url);

      if (!checkUrlExistMap.has(item.url)) {
        const checkUrlExistItem = checkUrlExist(item.url);
        checkUrlExistMap.set(item.url, checkUrlExistItem);
      }

      const checkUrlExistItem = await checkUrlExistMap.get(item.url);

      if (checkUrlExistItem) {
        const urlScanResult = {
          parentUrl: url,
          url: item.url,
          type: item.type,
          isExist: checkUrlExistItem.isExist,
          statusCode: checkUrlExistItem.statusCode,
        };
        ws.send(getBaseWsRes(WS_RES_TYPE.RESULT, urlScanResult));
      }
    }
  }

  await context.close();
}

// get all paths from sitemap
async function getWebsitePathsFromSitemap(url: string) {
  try {
    const sitemapResponse = await fetch(url);
    const sitemapXml = await sitemapResponse.text();
    const urlRegex = /<loc>(.*?)<\/loc>/gi;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(sitemapXml)) !== null) {
      const url = match[1];
      urls.push(url.endsWith("/") ? url : url + "/");
    }
    return urls;
  } catch (err) {
    return [];
  }
}

export { getLinkItemFromSitemap };
