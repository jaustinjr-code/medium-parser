const fetcher = require("../fetcher");
const helper = require("../rssFeedHelper");

describe("Fetcher Module", () => {
  // Test modules
  test("modules exist", () => {
    expect(fetcher).toBeDefined();
    expect(helper).toBeDefined();
  });

  // Test functions
  test("fetcher functions exist", () => {
    expect(fetcher.getFeed).toBeDefined();
    expect(helper.fetchRssFeed).toBeDefined();
  });

  // Test getFeed function success
  test("fetcher.getFeed function works", async () => {
    const mockFeed = { contents: "Mocked content" };
    const spy = jest.spyOn(helper, "fetchRssFeed");
    spy.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(() => mockFeed),
    });

    const feed = await fetcher.getFeed("@jaustinjr.blog");

    expect(spy).toHaveBeenCalled();
    expect(feed).toBeDefined();

    spy.mockRestore();
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
    const spy = jest.spyOn(helper, "fetchRssFeed");
    spy.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("JSON parse error")),
    });

    const feed = await fetcher.getFeed("@jaustinjr.blog");

    expect(spy).toHaveBeenCalled();
    expect(feed).toEqual({});
  });
});
