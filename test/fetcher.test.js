jest.mock("../rssFeedHelper", () => ({
  fetchRssFeed: jest.fn(),
}));

const helper = require("../rssFeedHelper");
const fetcher = require("../fetcher");

describe("Fetcher Module", () => {
  // Test modules
  test("modules exist", () => {
    expect(fetcher).toBeDefined();
    expect(helper).toBeDefined();
  });

  // Test functions
  test("fetcher functions exist", () => {
    expect(helper.fetchRssFeed).toBeDefined();
    expect(fetcher.getFeed).toBeDefined();
  });

  // Test getFeed function success
  test("fetcher.getFeed function works", async () => {
    const mockFeed = { contents: "Mocked content" };
    helper.fetchRssFeed.mockResolvedValueOnce(mockFeed);

    const feed = await fetcher.getFeed("@jaustinjr.blog");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(feed).toBeDefined();
    expect(feed).toEqual(mockFeed);
  });

  // Test getFeed function failure
  test("fetcher.getFeed function handles fetch failure", async () => {
    const spy = jest.spyOn(fetcher, "getFeed");

    const result = await fetcher.getFeed("incorrect account");

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  // Test fetchRssFeed function failure
  test("fetcher.getFeed function handles fetcher.fetchRssFeed failure", async () => {
    const mockFeed = {};
    helper.fetchRssFeed.mockRejectedValueOnce(mockFeed);

    const feed = await fetcher.getFeed("@jaustinjr.blog");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(feed).toEqual({});
  });
});
