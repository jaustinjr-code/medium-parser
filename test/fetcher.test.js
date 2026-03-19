import { jest } from "@jest/globals";

// Mock helper module
jest.unstable_mockModule("../rssHelper.js", () => ({
  fetchRssFeed: jest.fn(),
}));

let helper;
let fetcher;
let errors;

// Dynamic imports
beforeAll(async () => {
  helper = await import("../rssHelper.js");
  fetcher = await import("../fetcher.js");
  errors = await import("./util/mockErrors.js");
});

describe("Fetcher Module", () => {
  const dummyValue = {
    incorrectUsernameInput: {
      // Medium: Username may only use letters, numbers, ".", and "_". 30 character limit and starts with "@".
      wrongFormat: "incorrect account",
      wrongAtFormat: "incorrect@account",
      emptyString: "",
      nonString: 12345,
      badCharacters: "@#$%^&*/\\[]{}?`~()!-+",
    },
    notfoundAccountInput: "@notfound.account",
    correctAccountInput: "@jaustinjr.blog",
    loneSurrogateInput: "@long.surrogate\uD800",
    invalidStructureResponse: { invalid: "structure" },
    validStructureResponse: { contents: "Dummy content" },
    nullContentResponse: { contents: null },
    undefinedContentResponse: {},
  };

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
   *  1. feed and content is returned
   * failure:
   *  1. Invalid author username, return user-friendly error
   *  2. RSS feed fails to locate user account, return user-friendly error
   *  3. All Origins fetch fails, return user-friendly error
   *  4. Contents not found in feed response, return user-friendly error
   *  5. JSON parse fails, return user-friendly error
   *  6. All Origins fetch completes with HTTP failure, return user-friendly error
   *  7. All Origins fetch completes without feed content (null), return user-friendly error
   *  8. All Origins fetch completes without feed content (undefined), return user-friendly error
   *  9. Lone surrogate input fails author validation, return user-friendly error
   */

  // Test getFeed success #1
  test("fetcher.getFeed function works", async () => {
    const mockResult = dummyValue.validStructureResponse;
    helper.fetchRssFeed.mockResolvedValueOnce(mockResult);

    const result = await fetcher.getFeed(dummyValue.correctAccountInput);

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test getFeed failure #1
  test("should reject with UnknownAuthorError for invalid author username", async () => {
    const mockResult = errors.mockUnknownAuthorError();

    await expect(
      fetcher.getFeed(dummyValue.incorrectUsernameInput.wrongFormat),
    ).rejects.toEqual(mockResult);

    await expect(
      fetcher.getFeed(dummyValue.incorrectUsernameInput.wrongAtFormat),
    ).rejects.toEqual(mockResult);

    await expect(
      fetcher.getFeed(dummyValue.incorrectUsernameInput.emptyString),
    ).rejects.toEqual(mockResult);

    await expect(
      fetcher.getFeed(dummyValue.incorrectUsernameInput.nonString),
    ).rejects.toEqual(mockResult);

    await expect(
      fetcher.getFeed(dummyValue.incorrectUsernameInput.badCharacters),
    ).rejects.toEqual(mockResult);
  });

  // Test getFeed failure #2
  test("should reject with RssError when helper.fetchRssFeed throws a FetchError", async () => {
    const mockValue = errors.mockFetchError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.notfoundAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #3
  test("should reject with RssError when helper.fetchRssFeed throws a NetworkError", async () => {
    const mockValue = errors.mockNetworkError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #4
  test("should reject with StructureError when helper.fetchRssFeed returns an incorrect response structure", async () => {
    const mockValue = {
      json: jest.fn().mockResolvedValue(dummyValue.invalidStructureResponse),
    };
    const mockActual = dummyValue.validStructureResponse;
    const mockResult = errors.mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
    expect(helper.fetchRssFeed).not.toEqual(mockActual);
  });

  // Test getFeed failure #5
  test("should reject with RssError when helper.fetchRssFeed throws a ParseError", async () => {
    const mockValue = errors.mockParseError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #6
  test("should reject with RssError when helper.fetchRssFeed throws a HttpError", async () => {
    const mockValue = errors.mockHttpError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });
    helper.fetchRssFeed.mockRejectedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #7
  test("should reject with StructureError when helper.fetchRssFeed returns null content", async () => {
    const mockValue = dummyValue.nullContentResponse;
    const mockResult = errors.mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #8
  test("should reject with StructureError when helper.fetchRssFeed returns undefined content", async () => {
    const mockValue = dummyValue.undefinedContentResponse;
    const mockResult = errors.mockStructureError();
    helper.fetchRssFeed.mockResolvedValueOnce(mockValue);

    await fetcher.getFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
    });

    expect(helper.fetchRssFeed).toHaveBeenCalled();
  });

  // Test getFeed failure #9
  test("should reject with RssError when fetcher.getFeed throws a UnknownAuthorError from lone surrogate", async () => {
    const mockResult = errors.mockUnknownAuthorError();

    await fetcher.getFeed(dummyValue.loneSurrogateInput).catch((err) => {
      expect(err).toEqual(mockResult);
    });
  });
});
