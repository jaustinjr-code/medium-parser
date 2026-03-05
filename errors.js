/**
 * Custom error classes for the Medium RSS feed parser.
 */

/**
 * Error thrown when an RSS feed cannot be retrieved.
 * @class RssError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class RssError extends Error {
  constructor(message = "Unable to retrieve RSS feed.", options) {
    super(message, options);
    this.name = "RssError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error thrown when fetching a resource fails.
 * @class FetchError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class FetchError extends Error {
  constructor(message = "Unable to fetch URI.", options) {
    super(message, options);
    this.name = "FetchError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error thrown when content parsing fails.
 * @class ParseError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class ParseError extends Error {
  constructor(message = "Unable to parse content.", options) {
    super(message, options);
    this.name = "ParseError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error thrown when parsed content does not match expected structure.
 * @class StructureError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class StructureError extends Error {
  constructor(message = "Invalid content structure.", options) {
    super(message, options);
    this.name = "StructureError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error thrown when content owner/author is unknown or invalid.
 * @class UnknownAuthorError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class UnknownAuthorError extends Error {
  constructor(message = "Invalid content owner.", options) {
    super(message, options);
    this.name = "UnknownAuthorError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error representing a network-level failure (timeouts, DNS failures, etc.).
 * @class NetworkError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 */
export class NetworkError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "NetworkError";
    this.options = options;
    this.cause = options?.cause;
  }
}

/**
 * Error representing an HTTP error response.
 * @class HttpError
 * @extends {Error}
 * @param {string} [message] - Human-readable error message.
 * @param {Object} [options] - Optional error options forwarded to `Error`.
 * @param {*} [options.cause] - Underlying cause of the error.
 * @param {number} [status] - HTTP status code associated with the error.
 */
export class HttpError extends Error {
  constructor(message, options, status) {
    super(message, options);
    this.name = "HttpError";
    this.status = status;
    this.options = options;
    this.cause = options?.cause;
  }
}

export default {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
  NetworkError,
  HttpError,
};
