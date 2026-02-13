import { jest } from "@jest/globals";

// Mock helper module
jest.unstable_mockModule("../rssFeedHelper.js", () => ({
  fetchRssFeed: jest.fn(),
}));

let helper;
let fetcher;
let errors;

// Dynamic imports
beforeAll(async () => {
  helper = await import("../rssFeedHelper.js");
  fetcher = await import("../fetcher.js");
  errors = await import("./util/mockErrors.js");
});

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
   *  5. JSON parse fails, return user-friendly error
   *  6. All Origins fetch completes with HTTP failure, return user-friendly error
   *  7. All Origins fetch completes without feed content, return user-friendly error
   */

  // Test getFeed failure #1
  test("fetcher.getFeed handles failure", async () => {
    const mockResult = errors.mockUnknownAuthorError();

    await expect(fetcher.getFeed("incorrect account")).rejects.toEqual(
      mockResult,
    );
  });

  // Test getFeed failure #2
  test("fetcher.getFeed fetch error thrown by helper.fetchRssFeed", async () => {
    const mockValue = errors.mockFetchError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@incorrect.account").catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #3
  test("fetcher.getFeed network error thrown by helper.fetchRssFeed", async () => {
    const mockValue = errors.mockNetworkError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #4
  test("fetcher.getFeed receives incorrect response structure from helper.fetchRssFeed", async () => {
    const mockValue = {
      json: jest.fn().mockResolvedValue({ invalid: "structure" }),
    };
    const mockActual = { contents: "Valid content" };
    const mockResult = errors.mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(helper.fetchRssFeed).not.toEqual(mockActual);
  });

  // Test getFeed failure #5
  test("fetcher.getFeed parse error thrown by helper.fetchRssFeed", async () => {
    const mockValue = errors.mockParseError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #6
  test("fetcher.getFeed HTTP error thrown by helper.fetchRssFeed", async () => {
    const mockValue = errors.mockHttpError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed("@jaustinjr.blog").catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #7
  test("fetcher.getFeed content error thrown by fetcher.getFeed from complete helper.fetchRssFeed", async () => {
    const mockValue = { contents: null };
    const mockResult = errors.mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

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
