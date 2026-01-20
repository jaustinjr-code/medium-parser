const fetchRssFeed = async (feedUrl) => {
  return await fetch(`https://api.allorigins.win/get?url=${feedUrl}`).catch(
    (err) => {
      console.log("Something wrong happened.");
      console.error("All Origins failed.", err);
    },
  );
};

module.exports = {
  fetchRssFeed,
};
