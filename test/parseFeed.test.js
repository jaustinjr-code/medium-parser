import { jest } from "@jest/globals";

// Mock helper module
jest.unstable_mockModule("../fetcher.js", () => ({
  getFeed: jest.fn(),
}));

let fetcher;
let parser;
let errors;

// Dynamic imports
beforeAll(async () => {
  fetcher = await import("../fetcher.js");
  parser = await import("../parser.js");
  errors = await import("./util/mockErrors.js");
});

describe("Parser Module: parseFeed", () => {
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

  // Test functions
  test("fetcher functions exist", () => {
    expect(fetcher.getFeed).toBeDefined();
    expect(parser.parseContent).toBeDefined();
    expect(parser.parseFeed).toBeDefined();
  });

  /**
   * parseFeed specs
   * use:
   *  - parseFeed(authorUsername)
   * success:
   *  1. parsed content from author username is returned
   *  2. parsed content structure is valid and matches expected structure
   *  3. retry content is parsed and returned after failed attempt
   * failure:
   *  1. invalid author username input, return user-friendly error
   *  2. content parsing fails, return user-friendly error
   *  3. invalid feed output, return user-friendly error
   *    - null feed
   *    - undefined feed
   *    - empty feed
   *    - non-string feed
   *  4. invalid parsed content structure, return user-friendly error
   *    - items content
   *    - image content
   *    - article title content
   *    - article description content
   *    - article SEO content
   *    - article encoded content, content:encoded
   *    - category content
   *    - topic content
   *    - publish date content
   *    - link content
   *    - guide link content
   *  5. retry failed feed fetch, return user-friendly error
   */

  // Test parseFeed success #1
  test("parser.parseFeed function works", async () => {
    const mockResult = dummyValue.validStructureResponse;
    fetcher.getFeed.mockResolvedValueOnce(mockResult);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(fetcher.getFeed).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test parseFeed success #2
  test("parser.parseFeed returns content with valid structure", async () => {
    const mockResult = dummyValue.validStructureResponse;
    parser.parseContent.mockResolvedValueOnce(mockResult);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test parseFeed success #3
  test("parser.parseFeed retries and succeeds after failed attempt", async () => {
    const mockResult = dummyValue.validStructureResponse;
    const mockError = errors.mockRssError();

    // First call to getFeed fails, second call succeeds
    fetcher.getFeed
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockResult);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(fetcher.getFeed).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test parseFeed failure #1
  test("should reject with UnknownAuthorError for invalid author username input", async () => {
    const mockResult = errors.mockUnknownAuthorError();

    await expect(
      parser.parseFeed(dummyValue.incorrectUsernameInput.wrongFormat),
    ).rejects.toEqual(mockResult);

    await expect(
      parser.parseFeed(dummyValue.incorrectUsernameInput.wrongAtFormat),
    ).rejects.toEqual(mockResult);

    await expect(
      parser.parseFeed(dummyValue.incorrectUsernameInput.emptyString),
    ).rejects.toEqual(mockResult);

    await expect(
      parser.parseFeed(dummyValue.incorrectUsernameInput.nonString),
    ).rejects.toEqual(mockResult);

    await expect(
      parser.parseFeed(dummyValue.incorrectUsernameInput.badCharacters),
    ).rejects.toEqual(mockResult);
  });

  // Test parseFeed failure #2
  test("should reject with ParseError for content parsing failure", async () => {
    const mockValue = errors.mockParseError();
    const mockResult = errors.mockParseError(undefined, { cause: mockValue });
    fetcher.getFeed.mockRejectedValueOnce(mockValue);

    await parser.parseFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(fetcher.getFeed).toHaveBeenCalled();
  });

  // Test parseFeed failure #3
  test("should reject with InvalidFeedError for invalid feed output", async () => {
    const mockResult = errors.mockInvalidFeedError();
    fetcher.getFeed.mockResolvedValueOnce(null);

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(undefined);

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce("");

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(12345);

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);
  });

  // Test parseFeed failure #4
  test("should reject with StructureError for invalid parsed content structure", async () => {
    const mockResult = errors.mockStructureError();
    parser.parseContent.mockResolvedValueOnce(
      dummyValue.invalidStructureResponse,
    );

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);
  });

  // Test parseFeed failure #5
  test("should reject with RssError after retrying failed feed fetch", async () => {
    const mockValue = errors.mockRssError();
    const mockResult = errors.mockRssError(undefined, { cause: mockValue });

    // Simulate both initial and retry attempts failing
    fetcher.getFeed
      .mockRejectedValueOnce(mockValue)
      .mockRejectedValueOnce(mockValue);

    await parser.parseFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      expect(err.cause).toBe(mockValue);
    });

    expect(fetcher.getFeed).toHaveBeenCalledTimes(2);
  });
});
