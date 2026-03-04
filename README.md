# medium-parser

A lightweight Node.js library for fetching and parsing Medium RSS feeds using the AllOrigins proxy.

## Table of Contents

- [medium-parser](#medium-parser)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Example](#basic-example)
    - [Handling Errors](#handling-errors)
  - [API Reference](#api-reference)
    - [`getFeed(authorUsername)`](#getfeedauthorusername)
    - [Error Classes](#error-classes)
  - [Dependencies](#dependencies)
  - [Limitations](#limitations)
  - [License](#license)

---

## Introduction

`medium-parser` that provides a fetch of the Medium author's RSS feed by username and returns the parsed response in JSON. The package is compatible with ESM, CommonJS, and TypeScript.

> [!NOTE]
> The package uses [AllOrigins](https://allorigins.win/) to bypass CORS restrictions. If AllOrigins is unavailable, requests will fail.

## Installation

```bash
npm install medium-parser
```

## Usage

### Basic Example

```js
import mediumFetcher from 'medium-parser/fetcher';

async function main() {
  try {
    const feed = await mediumFetcher.getFeed('@jaustinjr.blog');
    console.log(feed.contents);
  } catch (err) {
    console.error('Failed to fetch feed:', err);
  }
}

main();
```

### Handling Errors

The library exports several error classes, allowing callers to distinguish between different failure modes, three of which are public:

```js
import { fetcher, errors } from 'medium-parser';

try {
  await fetcher.getFeed('invalid'); // will throw UnknownAuthorError
} catch (err) {
  if (err instanceof errors.UnknownAuthorError) {
    // username validation failed or username was not found
  } else if (err instanceof errors.StructureError) {
    // response missing expected fields
  } else if (err instanceof errors.RssError) {
    // network/parse/http error wrapped
  } else {
    // other unexpected error
  }
}
```

## API Reference

### `getFeed(authorUsername)`

- **Parameters:** `authorUsername` (string) – must start with `@` and contain letters, numbers, `.`, or `_` (max 30 chars).
- **Returns:** `Promise<Object>` resolving with the parsed RSS feed.
- **Throws:** One of the custom error classes listed below.

### Error Classes

The package exports the following errors:

- `UnknownAuthorError` – validation failure for username.
- `StructureError` – RSS response didn't have expected shape.
- `RssError` – generic wrapper for network/HTTP/parse errors.
  - `NetworkError` – network request failed.
  - `HttpError` – response returned non-OK status.
  - `ParseError` – failure parsing JSON.
  - `FetchError` – low-level fetch failure.

## Dependencies

This library has no runtime dependencies other than the `fetch` API (available in Node.js 18+ or with a polyfill).

> [!IMPORTANT]
> Make sure `fetch` is available in your environment. For older Node versions, install a polyfill like [`node-fetch`](https://www.npmjs.com/package/node-fetch) and set `global.fetch`.

## Limitations

- **CORS Proxy Reliance:** The package depends entirely on AllOrigins. Downtime or rate limits on their service will break functionality.
- **No Caching:** Each call issues a fresh network request; there is no built-in caching mechanism.
- **Minimal Validation:** Only basic username validation is performed; Medium usernames may change or contain other characters in the future.
- **Only Medium RSS Feeds:** JSON export of specific Medium articles or other APIs are not supported.

## License

`medium-parser` is licensed under the [MIT License](LICENSE).

---

Happy parsing! 👋
