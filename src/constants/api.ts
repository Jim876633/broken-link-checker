export const WS_REQ_TYPE = {
  /** sitemap url*/
  SITEMAP_URL: "SITEMAP_URL",
  /** crawler url */
  CRAWLER_URL: "CRAWLER_URL",
} as const;

export const WS_RES_TYPE = {
  /** 開始搜尋 */
  START: "START",
  /** 搜尋完成 */
  FINISH: "FINISH",
  /** 搜尋錯誤 */
  ERROR: "ERROR",
  /** 搜尋結果 */
  RESULT: "RESULT",
} as const;
