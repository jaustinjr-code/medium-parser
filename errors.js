class RssError extends Error {
  constructor(message = "Unable to retrieve RSS feed.", options) {
    super(message, options);
    this.name = "RssError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class FetchError extends Error {
  constructor(message = "Unable to fetch URI.", options) {
    super(message, options);
    this.name = "FetchError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class ParseError extends Error {
  constructor(message = "Unable to parse content.", options) {
    super(message, options);
    this.name = "ParseError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class StructureError extends Error {
  constructor(message = "Invalid content structure.", options) {
    super(message, options);
    this.name = "StructureError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class UnknownAuthorError extends Error {
  constructor(message = "Invalid content owner.", options) {
    super(message, options);
    this.name = "UnknownAuthorError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class NetworkError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "NetworkError";
    this.options = options;
    this.cause = options?.cause;
  }
}

class HttpError extends Error {
  constructor(message, options, status) {
    super(message, options);
    this.name = "HttpError";
    this.status = status;
    this.options = options;
    this.cause = options?.cause;
  }
}

module.exports = {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
  NetworkError,
  HttpError,
};
