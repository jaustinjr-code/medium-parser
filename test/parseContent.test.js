import { jest } from "@jest/globals";

let originalFetcher;
let fetcher;
let parser;
let errors;

// Dynamic imports
beforeAll(async () => {
  // Use for calling the original implementation
  originalFetcher = await import("../fetcher.js");

  // Mock fetcher instances after this
  jest.unstable_mockModule("../fetcher.js", () => ({
    getFeed: jest.fn(),
  }));

  fetcher = await import("../fetcher.js");
  parser = await import("../parser.js");
  errors = await import("./util/mockErrors.js");
});

afterEach(() => {
  fetcher.getFeed.mockClear();
});

describe("Parser Module: parseContent", () => {
  const dummyValue = {
    correctAccountInput: "@jaustinjr.blog",
    validStructureResponse: { contents: "Dummy content" },
  };

  // Test functions
  test("fetcher functions exist", () => {
    expect(fetcher.getFeed).toBeDefined();
    expect(parser.parseContent).toBeDefined();
  });

  /**
   * parseContent specs
   * use:
   *  - parseContent(content)
   * success:
   *  1. parsed content from input is returned
   * failure:
   *  1. invalid content input, return user-friendly error
   *    - null content
   *    - undefined content
   *    - empty content
   *    - non-string content
   *    - invalid RSS content structure
   *  2. content parsing fails, return user-friendly error
   *  3. invalid parsed content structure, return user-friendly error
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
   */

  // Test parseContent success #1
  test("parser.parseContent function works", async () => {
    const mockResult = dummyValue.validStructureResponse;
    fetcher.getFeed.mockResolvedValueOnce(mockResult);

    const result = await parser.parseContent(
      dummyValue.validStructureResponse.contents,
    );

    expect(result).toBeDefined();
    expect(result).toEqual(mockResult);
  });

  // Test parseContent failure #1
  test("should reject with InvalidContentInputError for invalid content input", async () => {
    const mockResult = errors.mockInvalidContentInputError();

    await expect(parser.parseContent(null)).rejects.toEqual(mockResult);
    await expect(parser.parseContent(undefined)).rejects.toEqual(mockResult);
    await expect(parser.parseContent("")).rejects.toEqual(mockResult);
    await expect(parser.parseContent(123)).rejects.toEqual(mockResult);
    await expect(parser.parseContent({})).rejects.toEqual(mockResult);
  });

  // Test parseContent failure #2
  test("should reject with ParseError for content parsing failure", async () => {
    const mockResult = errors.mockParseError();

    // Simulate parsing failure by passing in content that causes an error
    await expect(parser.parseContent("Invalid RSS content")).rejects.toEqual(
      mockResult,
    );
  });

  // Test parseFeed failure #3
  test("should reject with StructureError for invalid parsed content structure", async () => {
    const mockResult = errors.mockStructureError();

    // TODO: fix error "TypeError: Cannot assign to read only property 'parseContent' of object '[object Module]'"
    // const spy = jest.spyOn(parser, "parseContent");
    // spy.mockResolvedValueOnce(dummyValue.invalidParsedResult.missingItems);
    // spy.mockResolvedValueOnce(dummyValue.invalidParsedResult.missingLink);

    await expect(
      parser.parseContent(dummyValue.correctAccountInput),
    ).rejects.toEqual(mockResult);
  });
});
