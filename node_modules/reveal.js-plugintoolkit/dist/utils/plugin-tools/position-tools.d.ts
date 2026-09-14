import { RevealInstance } from '../../types';
export type AnchorEdge = "top" | "bottom";
export interface AnchorOptions {
    /** The edge of what the reader sees that the anchor holds. Default `top`. */
    edge?: AnchorEdge;
    /** Default `2`: above the slides, below Reveal's own controls and overlays. */
    zIndex?: number | string;
    /** Classes for the anchor, so the plugin's stylesheet can reach it and what it holds. */
    className?: string;
    /** `hide` (the default) takes the anchor out of Reveal's print view, `keep` leaves it in. */
    print?: "hide" | "keep";
}
/**
 * Add an anchor for an element that sits over the slides and has to stay on screen: a menubar, a button, a logo.
 *
 * The anchor is a zero-height element, a direct child of the deck, that holds one edge of what the reader sees, in every view:
 *
 * - A deck that has the page to itself: fixed to the window.
 * - An embedded deck: sticky inside the deck, so it stays at the deck's edge when the page scrolls and when the deck scrolls in scroll view.
 * - Right to left: follows Reveal's `rtl` option, and also when `configure()` changes it later. Without it, the page's own `dir`.
 * - Print view: hidden, unless `print: 'keep'`.
 *
 * Its order among the deck's children does not matter, nor how many anchors other plugins add. The styles are written on the anchor itself, so they cannot clash with another plugin's copy of the toolkit. A stylesheet can still override one of them with `!important`.
 *
 * The anchor has no height, so `height: 100%` inside it is nothing. `--toolkit-anchor-height` on the anchor is the height of what the reader sees, kept up to date, for an element that fills it from edge to edge: a side menu, a backdrop.
 *
 * Put the plugin's element inside and place it against the anchor's edge in the plugin's own CSS:
 *
 * ```css
 * .my-plugin-anchor > .my-plugin-button {
 *     position: absolute;
 *     top: 20px;                  // bottom: 20px for a bottom anchor
 *     inset-inline-end: 20px;     // or inset-inline: 0 for a bar across
 * }
 * ```
 *
 * Call it from a plugin's `init` or later. Every call adds a new anchor, so a plugin keeps the one it gets.
 *
 * @param deck - The reveal.js deck instance.
 * @param options - The edge, z-index, classes and print behaviour.
 * @returns The anchor, already in the deck, or `null` if the deck has no element.
 */
export declare const addAnchor: (deck: RevealInstance, options?: AnchorOptions) => HTMLElement | null;
