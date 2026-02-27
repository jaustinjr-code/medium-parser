import { NetworkError, HttpError, ParseError } from "./errors";

/**
 * Fetches an RSS feed from the given URL.
 * @param {string} feedUrl - The URL of the RSS feed to fetch
 * @returns {Promise<Object>} The parsed JSON response from the feed
 * @throws {NetworkError} If the network request fails
 * @throws {HttpError} If the feed server returns an error status
 * @throws {ParseError} If the response cannot be parsed as JSON
 */
export const fetchRssFeed = async (feedUrl) => {
  const res = await fetch(
    `https://api.allorigins.win/get?url=${feedUrl}`,
  ).catch((err) => {
    throw new NetworkError("Failed to fetch feed due to a network error.", {
      cause: err,
    });
  });

  if (!res.ok) {
    throw new HttpError(
      `Feed server returned ${res.status}`,
      { cause: res },
      res.status,
    );
  }

  return await res.json().catch((err) => {
    throw new ParseError(undefined, { cause: err });
  });
};

export default {
  fetchRssFeed,
};
