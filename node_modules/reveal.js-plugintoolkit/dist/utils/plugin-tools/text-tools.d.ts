/**
 * Text handling shared between plugins.
 */
/**
 * Turn a label into something usable as an id or a fragment.
 *
 * Lowercased, spaces removed, and everything that is not a letter, a number or a
 * hyphen dropped. Letters and numbers are matched by Unicode property, so
 * accented and non-Latin titles keep their characters instead of being emptied
 * out.
 *
 * @example sanitizeText('Chapter One!') // 'chapterone'
 */
export declare const sanitizeText: (text: string) => string;
