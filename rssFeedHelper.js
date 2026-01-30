const { NetworkError, HttpError, ParseError } = require("./errors");

const fetchRssFeed = async (feedUrl) => {
  const res = await fetch(
    `https://api.allorigins.win/get?url=${feedUrl}`,
  ).catch((err) => {
    throw new NetworkError("Failed to fetch feed. Check your connection.", {
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

module.exports = {
  fetchRssFeed,
};
