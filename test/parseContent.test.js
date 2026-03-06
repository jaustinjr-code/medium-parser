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
});
