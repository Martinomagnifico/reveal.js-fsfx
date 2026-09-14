export interface RevealSlideEvent {
    type: string;
    currentSlide: HTMLElement;
    previousSlide: HTMLElement;
    indexh: number;
    indexv: number;
    bubbles: boolean;
    cancelable: true;
    target: HTMLElement;
    currentTarget: null;
    defaultPrevented: boolean;
    eventPhase: number;
}
export type EnvironmentInfo = {
    /**
     * True when the plugin's own file has a URL, so a stylesheet path can be
     * derived from it rather than guessed at. False inside an application bundle
     * and on a dev server, both of which own the CSS pipeline themselves.
     */
    hasResolvableSource: boolean;
    hasWindow: boolean;
    hasDocument: boolean;
    /** @deprecated The inverse of `hasResolvableSource`, under a name that states a conclusion rather than the test. */
    isBundled: boolean;
    /** @deprecated Nothing in the toolkit reads this. Kept so 1.0.x callers still compile. */
    isDevelopment: boolean;
    /** @deprecated Nothing in the toolkit reads this. Kept so 1.0.x callers still compile. */
    hasHMR: boolean;
    /** @deprecated Nothing in the toolkit reads this. Kept so 1.0.x callers still compile. */
    isViteDev: boolean;
};
/**
 * The part of the reveal.js API that the toolkit itself calls.
 *
 * Deliberately local rather than `import type { RevealApi } from 'reveal.js'`.
 * The deck type has been renamed and reshaped across major versions — it is
 * `Reveal.Api` in the `@types/reveal.js` packages for 4.x and 5.x, and
 * `RevealApi` in the first-party types Reveal 6 ships — so importing it pins
 * the toolkit to one of them. Structural typing does the rest: a deck from
 * reveal.js 4, 5 or 6 satisfies this interface, so plugin authors keep using
 * their own version's type and pass it straight in.
 *
 * Every member below was checked against @types/reveal.js@4.4.8,
 * @types/reveal.js@5.2.2 and reveal.js@6's own `reveal.d.ts`; all six are
 * present in all three with compatible signatures. Adding a member that some
 * supported version lacks would make that version's deck stop being assignable
 * here, so keep this list to what the toolkit actually calls.
 */
export interface RevealInstance {
    /** Same shape as `HTMLElement.addEventListener`, which is what reveal.js aliases it to. */
    on: HTMLElement['addEventListener'];
    /** Present in all supported versions; the toolkit does not use it, but it is the pair to `on`. */
    off: HTMLElement['removeEventListener'];
    dispatchEvent(args: {
        /** The deck's own element by default. */
        target?: HTMLElement;
        type: string;
        data?: unknown;
        bubbles?: boolean;
    }): Event;
    /**
     * Returns `object` rather than a mirrored config interface: the config type is
     * `Options` in 4.x/5.x and `RevealConfig` in 6, and the toolkit only ever reads
     * its own key out of it.
     */
    getConfig(): object;
    getCurrentSlide(): HTMLElement;
    /** `f` is optional here so a version that omits it stays assignable. */
    getIndices(slide?: HTMLElement): {
        h: number;
        v: number;
        f?: number;
    };
    getViewportElement(): HTMLElement | null;
    /** The deck's own element, the one that carries `has-light-background` and `has-dark-background`. Present in all supported versions. */
    getRevealElement(): HTMLElement | null;
}
