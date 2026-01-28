const {
  UnknownAuthorError,
  RssError,
  NetworkError,
  HttpError,
  ParseError,
} = require("./errors");
const { fetchRssFeed } = require("./rssFeedHelper");

/**
 * Uses All Origins to fetch a Medium RSS feed for a given author.
 * Author should be the Medium username only, e.g. '@jaustinjr.blog'
 * @param {String} authorUsername
 * @returns Promise<any>
 */
const getFeed = async (authorUsername) => {
  if (!validateAuthorUsername(authorUsername)) {
    return Promise.reject(new UnknownAuthorError());
  }

  const mediumFeedUrl = "https://medium.com/feed";
  const url = encodeURIComponent(`${mediumFeedUrl}/${authorUsername}`);

  const feed = await fetchRssFeed(url).catch((err) => {
    return Promise.reject(getUserFriendlyError(err));
  });
  if (!(feed && feed.contents)) return {};

  return feed;
};

const validateAuthorUsername = (authorUsername) => {
  // Basic validation to check that it starts with '@' and has more characters
  return typeof authorUsername === "string" && /^@.+/.test(authorUsername);
};

const getUserFriendlyError = (error) => {
  switch (error) {
    case error instanceof UnknownAuthorError:
      return new UnknownAuthorError();
    case error instanceof NetworkError:
    case error instanceof HttpError:
      return new RssError(
        (options = {
          cause: error,
        }),
      );
    case error instanceof ParseError:
      return new ParseError({ cause: error });
    default:
      return new RssError();
  }
};

module.exports = {
  getFeed,
};
