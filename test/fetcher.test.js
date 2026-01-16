test("fetcher module exists", () => {
  const fetcher = require("../fetcher");
  expect(fetcher).toBeDefined();
});

test("fetcher.getFeed function exists", () => {
  const fetcher = require("../fetcher");
  expect(fetcher.getFeed).toBeDefined();
});

test("fetcher.getFeed function works", async () => {
  const fetcher = require("../fetcher");
  const feed = await fetcher.getFeed("@jaustinjr.blog");
  expect(feed).toBeDefined();
  expect(feed.contents).toBeDefined();
});
