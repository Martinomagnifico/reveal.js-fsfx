/**
 * Wait until a Reveal theme is applied to the page.
 *
 * For plugins that read colours or sizes back off the page. Under a bundler or a
 * dev server the CSS is injected by JavaScript, so it can land *after* the
 * plugin initialises; anything measured before that returns the browser's
 * defaults, and a value read once at startup keeps those defaults for the rest
 * of the session.
 *
 * A deck that styles itself without a Reveal theme never sets the marker, which
 * is why this gives up rather than waiting forever. Callers that can act late
 * should keep watching with a longer timeout after a `false`, so a theme that
 * arrives eventually is still picked up.
 *
 * @param timeout - How long to wait before giving up, in ms.
 * @returns `true` if a theme was seen, `false` if the wait timed out.
 */
export declare const whenThemeApplied: (timeout?: number) => Promise<boolean>;
/**
 * Whether a Reveal theme is applied right now, without waiting.
 */
export declare const isThemeApplied: () => boolean;
