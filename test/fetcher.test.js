jest.mock("../rssFeedHelper", () => ({
  fetchRssFeed: jest.fn(),
}));

const helper = require("../rssFeedHelper");
const fetcher = require("../fetcher");
const {
  mockRssError,
  mockFetchError,
  mockParseError,
  mockStructureError,
  mockUnknownAuthorError,
  mockNetworkError,
  mockHttpError,
} = require("./util/mockErrors");

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

  /**
   * getFeed specs
   * use:
   *  - getFeed(authorUsername)
   * success:
   *  1. parsed content is returned
   * failure:
   *  1. Response is not ok, return user-friendly error
   *  2. RSS feed fails to locate user account, return user-friendly error
   *  3. All Origins fetch fails, return user-friendly error
   *  4. Contents not found in feed response, return user-friendly error
   *  5. All Origins fetch completes with HTTP failure, return user-friendly error
   */

  // Test getFeed failure #1
  test("fetcher.getFeed handles failure", async () => {
    const mockResult = mockUnknownAuthorError();
    const spy = jest.spyOn(fetcher, "getFeed");

    await fetcher.getFeed("incorrect account").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(spy).toHaveBeenCalled();
  });

  // Test getFeed failure #2
  test("fetcher.getFeed fetch error thrown by helper.fetchRssFeed", async () => {
    const mockResult = mockRssError();
    const mockValue = mockFetchError();
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@incorrect.account").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #3
  test("fetcher.getFeed network error thrown by helper.fetchRssFeed", async () => {
    const mockResult = mockRssError();
    const mockValue = mockNetworkError();
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #4
  test("fetcher.getFeed receives incorrect response structure from helper.fetchRssFeed", async () => {
    const mockValue = {
      json: jest.fn().mockResolvedValue({ invalid: "structure" }),
    };
    const mockActual = { contents: "Valid content" };
    const mockResult = mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(helper.fetchRssFeed).not.toEqual(mockActual);
  });

  // Test getFeed failure #5
  test("fetcher.getFeed parse error thrown by helper.fetchRssFeed", async () => {
    const mockResult = mockRssError();
    const mockValue = mockParseError();
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #6
  test("fetcher.getFeed parse error thrown by helper.fetchRssFeed", async () => {
    const mockResult = mockRssError();
    const mockValue = mockHttpError();
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed success #1
  test("fetcher.getFeed function works", async () => {
    const mockResult = { contents: "Mocked content" };
    helper.fetchRssFeed.mockResolvedValueOnce(mockResult);

    const result = await fetcher.getFeed("@jaustinjr.blog");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });
});
