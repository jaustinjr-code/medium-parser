class RssError extends Error {
  constructor(message = "Unable to retrieve RSS feed.", options) {
    super(message, options);
    this.name = "RssError";
  }
}

class FetchError extends Error {
  constructor(message = "Unable to fetch URI.", options) {
    super(message, options);
    this.name = "FetchError";
  }
}

class ParseError extends Error {
  constructor(message = "Unable to parse content.", options) {
    super(message, options);
    this.name = "ParseError";
  }
}

class StructureError extends Error {
  constructor(message = "Invalid content structure.", options) {
    super(message, options);
    this.name = "StructureError";
  }
}

class UnknownAuthorError extends Error {
  constructor(message = "Invalid content owner.", options) {
    super(message, options);
    this.name = "UnknownAuthorError";
  }
}

module.exports = {
  RssError,
  FetchError,
  ParseError,
  StructureError,
  UnknownAuthorError,
};
