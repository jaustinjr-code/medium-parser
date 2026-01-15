/**
 * Uses All Origins to fetch a Medium RSS feed for a given author.
 * Author should be the Medium username only, e.g. '@jaustinjr.blog'
 * @param {String} authorUsername
 * @returns Promise<any>
 */
export const getFeed = async (authorUsername) => {
  const mediumFeedUrl = "https://medium.com/feed";
  const url = encodeURIComponent(`${mediumFeedUrl}/${authorUsername}`);
  let response = await fetch(`https://api.allorigins.win/get?url=${url}`).catch(
    (err) => {
      console.log("Something wrong happened.");
      console.error("All Origins failed.", err);
    }
  );

  if (!(response && response.ok)) return {};

  const feed = await response.json().catch((err) => {
    console.log("Something wrong happened.");
    console.error("Response JSON failed.", err);
  });

  if (!(feed && feed.contents)) return {};

  return feed;
};

export default { getFeed };
