const {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
} = require("../../errors");

const mockRssError = (message, options) => new RssError(message, options);
const mockFetchError = (message, options) => new FetchError(message, options);
const mockParseError = (message, options) => new ParseError(message, options);
const mockStructureError = (message, options) =>
  new StructureError(message, options);
const mockUnknownAuthorError = (message, options) =>
  new UnknownAuthorError(message, options);

module.exports = {
  mockRssError,
  mockFetchError,
  mockParseError,
  mockStructureError,
  mockUnknownAuthorError,
};
