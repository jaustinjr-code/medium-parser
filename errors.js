class RssError extends Error {
  constructor(message = "Unable to retrieve RSS feed.", options) {
    super(message, options);
    this.name = "RssError";
  }

  mockError(options) {
    return new RssError((options = options));
  }
}

class FetchError extends Error {
  constructor(message = "Unable to fetch URI.", options) {
    super(message, options);
    this.name = "FetchError";
  }

  mockError(options) {
    return new FetchError((options = options));
  }
}

class ParseError extends Error {
  constructor(message = "Unable to parse content.", options) {
    super(message, options);
    this.name = "ParseError";
  }

  mockError(options) {
    return new ParseError((options = options));
  }
}

class StructureError extends Error {
  constructor(message = "Invalid content structure.", options) {
    super(message, options);
    this.name = "StructureError";
  }

  mockError(options) {
    return new StructureError((options = options));
  }
}

class UnknownAuthorError extends Error {
  constructor(message = "Invalid content owner.", options) {
    super(message, options);
    this.name = "UnknownAuthorError";
  }

  mockError(options) {
    return new UnknownAuthorError((options = options));
  }
}

module.exports = {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
};
