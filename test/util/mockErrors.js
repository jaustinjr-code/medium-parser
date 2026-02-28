import {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
  NetworkError,
  HttpError,
} from "../../errors";

export const mockRssError = (message, options) =>
  new RssError(message, options);
export const mockFetchError = (message, options) =>
  new FetchError(message, options);
export const mockParseError = (message, options) =>
  new ParseError(message, options);
export const mockStructureError = (message, options) =>
  new StructureError(message, options);
export const mockUnknownAuthorError = (message, options) =>
  new UnknownAuthorError(message, options);
export const mockNetworkError = (message, options) =>
  new NetworkError(message, options);
export const mockHttpError = (message, options, status) =>
  new HttpError(message, options, status);

export default {
  mockRssError,
  mockFetchError,
  mockParseError,
  mockStructureError,
  mockUnknownAuthorError,
  mockNetworkError,
  mockHttpError,
};
