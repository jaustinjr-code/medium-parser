import { jest } from "@jest/globals";

let originalFetcher;
let fetcher;
let parser;
let errors;
let mockContent;

// Dynamic imports
beforeAll(async () => {
  // Use for calling the original fetcher implementation
  originalFetcher = await import("../fetcher.js");

  // Mock fetcher instances after this
  jest.unstable_mockModule("../fetcher.js", () => ({
    getFeed: jest.fn(),
  }));

  fetcher = await import("../fetcher.js");
  parser = await import("../parser.js");
  errors = await import("./util/mockErrors.js");
  mockContent = await import("./util/mockContent.js");
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
    invalidFetcherResponse: {
      emptyContents: { contents: "" },
      nonStringContents: { contents: 12345 },
      missingXmlTag: { contents: `<rss><channel></channel></rss>` },
      missingRssTag: {
        contents: `<?xml version="1.0" encoding="UTF-8"?><channel></channel>`,
      },
      missingChannelTag: {
        contents: `<?xml version="1.0" encoding="UTF-8"?><rss></rss>`,
      },
    },
    validFeedResponse: {
      // Minimal valid RSS feed structure for testing, requires xml tag, rss tag, and channel tag
      contents: `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:cc="http://cyber.law.harvard.edu/rss/creativeCommonsRssModule.html"><channel></channel></rss>`,
    },
    invalidParsedResult: {
      missingItems: { link: "https://" },
      missingLink: { items: [] },
    },
    validEmptyParsedResult: {
      items: [],
      link: undefined,
    },
    nullContentResponse: { contents: null },
    undefinedContentResponse: {},
  };

  // Test functions
  test("fetcher functions exist", () => {
    expect(originalFetcher.getFeed).toBeDefined();
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
   *    - empty feed
   *    - non-string feed
   *    - missing XML tag feed
   *    - missing RSS tag feed
   *    - missing channel tag feed
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
    const mockResponse = dummyValue.validFeedResponse;
    const mockResult = dummyValue.validEmptyParsedResult;
    fetcher.getFeed.mockResolvedValueOnce(mockResponse);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(fetcher.getFeed).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);

    fetcher.getFeed.mockClear();
  });

  // Test parseFeed success #2
  test("parser.parseFeed returns content with valid structure", async () => {
    const mockResponse = mockContent.response;
    const mockResult = mockContent.parsedResult;
    fetcher.getFeed.mockResolvedValueOnce(mockResponse);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);

    fetcher.getFeed.mockClear();
  });

  // Test parseFeed success #3
  test("parser.parseFeed retries and succeeds after failed attempt", async () => {
    const mockResponse = mockContent.response;
    const mockResult = mockContent.parsedResult;
    const mockError = errors.mockRssError();

    // First call to getFeed fails, second call succeeds
    fetcher.getFeed
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockResponse);

    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockError);

    const result = await parser.parseFeed(dummyValue.correctAccountInput);

    expect(fetcher.getFeed).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test parseFeed failure #1
  test("should reject with UnknownAuthorError for invalid author username input", async () => {
    const mockResult = errors.mockUnknownAuthorError();
    fetcher.getFeed.mockImplementation((authorUsername) =>
      originalFetcher.getFeed(authorUsername),
    );

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
    const mockValue = new Error();
    const mockResult = errors.mockParseError(undefined, { cause: mockValue });
    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.missingXmlTag,
    );

    await parser.parseFeed(dummyValue.correctAccountInput).catch((err) => {
      expect(err).toEqual(mockResult);
      // rss-parser throws Error("Unable to parse XML"), no need to check message
      expect(err.cause).toBeInstanceOf(Error);
    });

    expect(fetcher.getFeed).toHaveBeenCalled();
  });

  // Test parseFeed failure #3
  test("should reject with ParseError for invalid RSS content", async () => {
    const mockResult = errors.mockParseError();

    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.emptyContents,
    );
    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.nonStringContents,
    );
    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.missingXmlTag,
    );
    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.missingRssTag,
    );
    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);

    fetcher.getFeed.mockResolvedValueOnce(
      dummyValue.invalidFetcherResponse.missingChannelTag,
    );
    await expect(
      parser.parseFeed(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);
  });

  // Test parseFeed failure #4
  test("should reject with StructureError for invalid parsed content structure", async () => {
    const mockResult = errors.mockStructureError();
    parser.parseContent.mockResolvedValueOnce(
      dummyValue.invalidParsedResult.missingItems,
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
