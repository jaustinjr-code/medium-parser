import { RssError, UnknownAuthorError } from "./errors.js";
import { getFeed } from "./fetcher.js";
import { parseRssFeed } from "./rssHelper.js";

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
