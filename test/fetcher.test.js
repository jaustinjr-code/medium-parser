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
   */

  // Test getFeed failure #1
  test("fetcher.getFeed handles failure", async () => {
    const mockResult = new Error("Medium author could not be found.", {
      cause: Error(),
    });
    const spy = jest.spyOn(fetcher, "getFeed");

    const result = await fetcher.getFeed("incorrect account");

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  // Test getFeed failure #2
  test("fetcher.getFeed unknown author error thrown by helper.fetchRssFeed", async () => {
    const mockResult = new Error("Unknown Medium author.", {
      cause: Error(),
    });
    helper.fetchRssFeed.mockRejectedValueOnce(mockResult);

    const result = await fetcher.getFeed("incorrect account");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  // Test getFeed failure #3
  test("fetcher.getFeed fetch error thrown by helper.fetchRssFeed", async () => {
    const mockResult = new Error("Unable to fetch author feed.", {
      cause: Error(),
    });
    helper.fetchRssFeed.mockRejectedValueOnce(mockResult);

    const result = await fetcher.getFeed("@jaustinjr.blog");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  // Test getFeed failure #4
  test("fetcher.getFeed receives incorrect response structure from helper.fetchRssFeed", async () => {
    const mockValue = {
      json: jest.fn().mockResolvedValue({ invalid: "structure" }),
    };
    const mockActual = { contents: "Valid content" };
    const mockResult = new Error("Received an invalid feed structure.", {
      cause: Error(),
    });
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    const result = await fetcher.getFeed("@jaustinjr.blog");

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(helper.fetchRssFeed).not.toEqual(mockActual);
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
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
