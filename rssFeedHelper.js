const fetchRssFeed = async (feedUrl) => {
  const res = await fetch(
    `https://api.allorigins.win/get?url=${feedUrl}`,
  ).catch((err) => {
    console.log("Something wrong happened.");
    console.error("All Origins failed.", err);
  });

  return await res.json().catch((err) => {
    console.log("Something wrong happened.");
    console.error("Response JSON failed.", err);
  });
};

module.exports = {
  fetchRssFeed,
};
