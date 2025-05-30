// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import * as config from "astro:env/client";
import STATS from "../content/snapshot/article-stats.json";
import COMMENTS from "../content/snapshot/article-comments.json";

type Comment = (typeof COMMENTS)[number];

/**
 * Whether to enable backend, required by click and comment feature.
 */
export const kEnableBackend = false;
/**
 * Whether to enable click tracking.
 */
export const kEnableClick = true && kEnableBackend;
/**
 * Whether to enable comment posting and viewing.
 */
export const kEnableComment = true && kEnableBackend;
/**
 * Whether to enable like reaction.
 */
export const kEnableReaction = true && kEnableBackend;
/**
 * Whether to enable post search (needs Js).
 */
export const kEnableSearch = true;
/**
 * Whether to enable PDF Archive.
 */
export const kEnableArchive = false;
/**
 * Whether to enable printing
 */
export const kEnablePrinting = true && kEnableArchive;

/**
 * The title of the website.
 */
export const kSiteTitle: string = config.SITE_TITLE || "My Blog";

/**
 * The title of the website.
 */
export const kSiteLogo: string = kSiteTitle;
/**
 * The title of the website, used in the index page.
 */
export const kSiteIndexTitle: string = config.SITE_INDEX_TITLE || kSiteTitle;
/**
 * The description of the website.
 */
export const kSiteDescription: string = config.SITE_DESCRIPTION || "My blog.";
/**
 * The baidu verification code, used for SEO.
 */
export const kBaiduVeriCode: string | undefined =
  config.BAIDU_VERIFICATION_CODE;

/**
 * The URL base of the website.
 * - For a GitHub page `https://username.github.io/repo`, the URL base is `/repo/`.
 * - For a netlify page, the URL base is `/`.
 */
export const kUrlBase = (config.URL_BASE || "").replace(/\/$/, "");

/**
 * The click info obtained from the backend.
 */
export const kArticleStats = STATS;

/**
 * The comment info obtained from the backend.
 */
export const kCommentInfo = (() => {
  const kCommentInfo = new Map<string, Comment[]>();
  for (const comment of COMMENTS) {
    const { articleId } = comment;
    if (!kCommentInfo.has(articleId)) {
      kCommentInfo.set(articleId, []);
    }
    kCommentInfo.get(articleId)?.push(comment);
  }
  return kCommentInfo;
})();
export const kCommentList = COMMENTS;
/**
 * The friend link info.
 */
export const kFriendLinks = [
  {
    name: "7mile",
    url: "https://7li.moe/",
    desc: "一切都有其意义，包括停滞不前的日子。",
  },
  {
    name: "Margatroid",
    url: "https://blog.mgt.moe/",
    desc: "SIGSLEEP Fellow",
  },
];
/**
 * A candidate list of servers to cover people in different regions.
 */
export const kServers = (() => {
  // const kServers = ["http://localhost:13333"];

  const kServers = (config.BACKEND_ADDR || "")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (kEnableBackend && kServers.length === 0) {
    throw new Error(
      "kServers is empty, please set BACKEND_ADDR in .env, or disable kEnableBackend in consts.ts"
    );
  }

  return kServers;
})();
