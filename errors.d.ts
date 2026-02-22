export class RssError extends Error {
  constructor(message: string, options: any);
  options: any;
  cause: any;
}

export class StructureError extends Error {
  constructor(message: string, options: any);
  options: any;
  cause: any;
}

export class UnknownAuthorError extends Error {
  constructor(message: string, options: any);
  options: any;
  cause: any;
}

declare namespace _default {
  export { RssError };
  export { StructureError };
  export { UnknownAuthorError };
}
export default _default;
