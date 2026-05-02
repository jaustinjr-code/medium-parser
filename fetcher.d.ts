declare namespace _default {
    export { getFeed };
}
export default _default;
/**
 * Uses All Origins to fetch a Medium RSS feed for a given author.
 * Author should be the Medium username only, e.g. '@jaustinjr.blog'
 * @param {String} authorUsername
 * @returns Promise<any>
 */
declare function getFeed(authorUsername: string): Promise<any>;
