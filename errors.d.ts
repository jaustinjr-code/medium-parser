export class RssError extends Error {
    constructor(message: string, options: any);
    options: any;
    cause: any;
}
export class FetchError extends Error {
    constructor(message: string, options: any);
    options: any;
    cause: any;
}
export class ParseError extends Error {
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
export class NetworkError extends Error {
    constructor(message: any, options: any);
    options: any;
    cause: any;
}
export class HttpError extends Error {
    constructor(message: any, options: any, status: any);
    status: any;
    options: any;
    cause: any;
}
