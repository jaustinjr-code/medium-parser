const {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
  NetworkError,
  HttpError,
} = require("../../errors");

const mockRssError = (message, options) => new RssError(message, options);
const mockFetchError = (message, options) => new FetchError(message, options);
const mockParseError = (message, options) => new ParseError(message, options);
const mockStructureError = (message, options) =>
  new StructureError(message, options);
const mockUnknownAuthorError = (message, options) =>
  new UnknownAuthorError(message, options);
const mockNetworkError = (message, options) =>
  new NetworkError(message, options);
const mockHttpError = (status, message, options) =>
  new HttpError(status, message, options);

module.exports = {
  mockRssError,
  mockFetchError,
  mockParseError,
  mockStructureError,
  mockUnknownAuthorError,
  mockNetworkError,
  mockHttpError,
};
