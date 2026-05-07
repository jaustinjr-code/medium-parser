import { RssError, UnknownAuthorError } from "./errors.js";
import { getFeed } from "./fetcher.js";
import { parseRssFeed } from "./rssHelper.js";

/**
 * Fetches, parses, and reformats the Medium RSS feed for the given author.
 * @param {String} authorUsername - The Medium username only, e.g. '@jaustinjr'.
 * @returns {Promise<Object>} The parsed feed metadata and a list article content.
 */
export const parseFeed = async (authorUsername) => {
  const feed = await getFeed(authorUsername).catch((err) => {
    if (err instanceof UnknownAuthorError) return Promise.reject(err);
    return Promise.reject(new RssError(undefined, { cause: err }));
  });

  const parsedFeed = await parseRssFeed(feed).catch((err) => {
    return Promise.reject(new RssError(undefined, { cause: err }));
  });

  const parsedContent = parseContent(parsedFeed);

  return parsedContent;
};

/**
 * Parses the feed contents and reformats for content header images.
 * @param {Object} parsedFeed - The parsed Medium feed in JSON.
 * @returns {Object} The parsed and reformatted Medium feed for header images.
 */
export const parseContent = (parsedFeed) => {
  const parsedContent = {
    ...parsedFeed,
    items: parsedFeed.items.map((item) => {
      return {
        ...item,
        images: parseImages(item["content:encoded"] || item.content),
      };
    }),
  };

  return parsedContent;
};

const parseImages = (content) => {
  if (typeof content !== "string") return [];
  const sourceImageRegex = /(?<=src\s*=\s*["'])([^"']+)(?=["'])/g;
  return content.match(sourceImageRegex) || [];
};

export default { parseFeed, parseContent };
