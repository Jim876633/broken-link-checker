import chalk from "chalk";
import { Page } from "playwright";
import { WebSocket } from "ws";
import { WS_RES_TYPE } from "../constants/api.ts";
import { getBaseWsRes } from "../utils/helper/apiHelper.ts";

/**
 * @param {string} url
 * 檢查是否為 asset url
 */
export const isAssetUrl = (url: string) => {
  const assetUrlRegex =
    /\.(png|jpe?g|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|otf|mp4|webm|ogg|mp3|wav|flac|aac|zip|rar|tar|gz|7z|pdf|docx?|xlsx?|pptx?|txt|csv|tsv|json|xml|rss|atom|gz|zip|rar|tar|tgz|exe|dmg|iso|bin|img|eps|psd|ai|indd|cdr|odt|ods|odp|odg|odf|ods|odt|ott|ots|tif|xlsx|xlsm)$/;
  return assetUrlRegex.test(url);
};

/**
 * @param {string} url
 * 判斷是否為 hash url
 */
export const isHashUrl = (url: string) => {
  const urlObj = new URL(url);
  return urlObj.hash !== "" || url.endsWith("#");
};

/**
 *
 * @param {string} url
 * 取得 url 的 origin url
 */
export const getOriginUrlFromUrl = (url: string) => {
  try {
    const { origin } = new URL(url);
    return origin;
  } catch (error) {
    console.error("Can't get origin url:", error);
    return "";
  }
};

/**
 * @param {string} url
 * 檢查連結是否存在
 */
export const checkUrlExist = async (url: string) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      process.stdout.write(chalk.green(`.${url}\n`));
    } else {
      process.stdout.write(chalk.red(`!${url}\n`));
    }
    return { isExist: response.ok, statusCode: response.status };
  } catch (error) {
    process.stdout.write(chalk.bgRed(`!${url}\n`));
    process.stdout.write("\n");
    return { isExist: false, statusCode: null };
  }
};

/**
 * @parm page
 * 取得一個網頁中所有的連結 (playwright page)
 */
export const getAllUrlItemList = async (page: Page) => {
  return await page.$$eval(
    "a, link, area, form, img, script, iframe, video, audio, source, track",
    (elements) => {
      const isHttpOrHttps = (url: string) => {
        return url.startsWith("http://") || url.startsWith("https://");
      };
      return elements
        .map((element) => {
          const tagName = element.tagName.toLowerCase();
          let urlItem;
          switch (tagName) {
            case "a":
              urlItem = {
                url: (element as HTMLAnchorElement | HTMLLinkElement).href,
                type: "a",
              };
              break;
            // case "link":
            //   urlItem = {
            //     url: element.href,
            //     type: "link",
            //   };
            //   break;
            // case "area":
            //   urlItem = {
            //     url: element.href,
            //     type: "area",
            //   };
            //   break;
            case "img":
              urlItem = {
                url: (element as HTMLImageElement).src,
                type: "img",
              };
              break;
            // case "script":
            //   urlItem = {
            //     url: element.src,
            //     type: "script",
            //   };
            //   break;
            // case "iframe":
            //   urlItem = {
            //     url: element.src,
            //     type: "iframe",
            //   };
            //   break;
            // case "video":
            //   urlItem = {
            //     url: element.src,
            //     type: "video",
            //   };
            //   break;
            // case "audio":
            //   urlItem = {
            //     url: element.src,
            //     type: "audio",
            //   };
            //   break;
            // case "source":
            //   urlItem = {
            //     url: element.src,
            //     type: "source",
            //   };
            //   break;
            // case "track":
            //   urlItem = {
            //     url: element.src,
            //     type: "track",
            //   };
            //   break;
            default:
              urlItem = {};
          }
          return urlItem;
        })
        .filter((urlItem) => !!urlItem.url && isHttpOrHttps(urlItem.url));
    }
  );
};

export const handleError = (err: unknown, ws: WebSocket) => {
  if (err instanceof Error) {
    ws.send(getBaseWsRes(WS_RES_TYPE.ERROR, err.message));
  } else {
    console.error("Unknown error", err);
    ws.send(getBaseWsRes(WS_RES_TYPE.ERROR, "Unknown error"));
  }
};

/* -------------------------------------------------------------------------- */
/*                                    type                                    */
/* -------------------------------------------------------------------------- */

export type CheckUrlExistType = {
  isExist: boolean;
  statusCode: number | null;
};
