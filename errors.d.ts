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
    constructor(message: string, options: any);
    options: any;
    cause: any;
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
    constructor(message: string, options: any);
    options: any;
    cause: any;
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
    constructor(message: string, options: any);
    options: any;
    cause: any;
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
    constructor(message: string, options: any);
    options: any;
    cause: any;
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
    constructor(message: string, options: any);
    options: any;
    cause: any;
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
    constructor(message: any, options: any);
    options: any;
    cause: any;
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
    constructor(message: any, options: any, status: any);
    status: any;
    options: any;
    cause: any;
}
declare namespace _default {
    export { RssError };
    export { FetchError };
    export { ParseError };
    export { StructureError };
    export { UnknownAuthorError };
    export { NetworkError };
    export { HttpError };
}
export default _default;
