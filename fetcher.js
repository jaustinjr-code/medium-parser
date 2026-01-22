const { fetchRssFeed } = require("./rssFeedHelper");

/**
 * Uses All Origins to fetch a Medium RSS feed for a given author.
 * Author should be the Medium username only, e.g. '@jaustinjr.blog'
 * @param {String} authorUsername
 * @returns Promise<any>
 */
const getFeed = async (authorUsername) => {
  try {
    const mediumFeedUrl = "https://medium.com/feed";
    const url = encodeURIComponent(`${mediumFeedUrl}/${authorUsername}`);

    const feed = await fetchRssFeed(url);

    if (!(feed && feed.contents)) return {};

    return feed;
  } catch (error) {
    return {};
  }
};

module.exports = {
  getFeed,
};
