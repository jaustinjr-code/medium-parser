const { UnknownAuthorError } = require("./errors");
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

  const feed = await fetchRssFeed(url);
  if (!(feed && feed.contents)) return {};

  return feed;
};

const validateAuthorUsername = (authorUsername) => {
  // Basic validation to check that it starts with '@' and has more characters
  return typeof authorUsername === "string" && /^@.+/.test(authorUsername);
};

module.exports = {
  getFeed,
};
