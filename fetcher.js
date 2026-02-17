import {
  UnknownAuthorError,
  RssError,
  NetworkError,
  HttpError,
  ParseError,
  StructureError,
  FetchError,
} from "./errors.js";
import { fetchRssFeed } from "./rssFeedHelper.js";

/**
 * Uses All Origins to fetch a Medium RSS feed for a given author.
 * Author should be the Medium username only, e.g. '@jaustinjr.blog'
 * @param {String} authorUsername
 * @returns Promise<any>
 */
export const getFeed = async (authorUsername) => {
  if (!validateAuthorUsername(authorUsername)) {
    return Promise.reject(new UnknownAuthorError());
  }

  let url;
  try {
    url = getMediumFeedUrl(authorUsername);
  } catch (error) {
    return Promise.reject(getUserFriendlyError(error));
  }

  const feed = await fetchRssFeed(url).catch((err) => {
    return Promise.reject(getUserFriendlyError(err));
  });

  if (!(feed && feed.contents)) {
    return Promise.reject(new StructureError());
  }

  return feed;
};

const validateAuthorUsername = (authorUsername) => {
  // Basic validation to check that it starts with '@' and has more characters
  return typeof authorUsername === "string" && /^@.+/.test(authorUsername);
};

const getMediumFeedUrl = (authorUsername) => {
  return encodeURIComponent(`https://medium.com/feed/${authorUsername}`);
};

const getUserFriendlyError = (error) => {
  if (error instanceof UnknownAuthorError) {
    return new UnknownAuthorError();
  } else if (
    error instanceof FetchError ||
    error instanceof NetworkError ||
    error instanceof HttpError ||
    error instanceof ParseError ||
    error instanceof URIError
  ) {
    return new RssError(undefined, { cause: error });
  } else {
    return error;
  }
};

export default {
  getFeed,
};
