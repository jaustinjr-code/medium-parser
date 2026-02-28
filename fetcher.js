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

  // URIError thrown if the input contains lone surrogates, call after validation to ensure user-friendly error
  let url = encodeURIComponent(`https://medium.com/feed/${authorUsername}`);

  const feed = await fetchRssFeed(url).catch((err) => {
    return Promise.reject(getUserFriendlyError(err));
  });

  if (!(feed && feed.contents)) {
    return Promise.reject(new StructureError());
  }

  return feed;
};

const validateAuthorUsername = (authorUsername) => {
  // Medium: Username may only use letters, numbers, ".", and "_". 30 character limit and starts with "@".
  return (
    typeof authorUsername === "string" &&
    /^@([a-zA-Z0-9_.]+)$/.test(authorUsername)
  );
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
