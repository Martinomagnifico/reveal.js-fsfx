import { RevealInstance } from '../../types';
/**
 * Make `data-state` work in scroll view the way it does in the regular view.
 *
 * In the regular view Reveal puts a slide's `data-state` on the viewport as classes, together with the state of the stack a vertical slide sits in, and fires an event named after each. Scroll view does neither: the slide on screen can have a state, and nothing on the page gets the class. That leaves a plugin, or a deck's own CSS, with no way to hide or show something per slide once the deck is scrolled. This fills that in for scroll view, and leaves the regular view to Reveal.
 *
 * - The classes go on the viewport, as Reveal's do: the body for a deck that has the page to itself, the deck itself when embedded, so two decks on one page keep their states apart.
 * - A state that was not on the previous slide fires an event named after it, as in the regular view. It fires after `slidechanged` rather than before, because scroll view only reports the new slide through that event.
 * - Stack states are read while the stacks are still intact, so call it from a plugin's `init`. Called after the deck has already switched to scroll view, slides get their own states, and stacks catch up after the first switch back.
 *
 * Any plugin may call it. The first call on a deck installs; later calls do nothing.
 *
 * ```css
 * .hide-my-thing .my-plugin-thing { visibility: hidden; }
 * ```
 *
 * @param deck - The reveal.js deck instance.
 */
export declare const addSlideStates: (deck: RevealInstance) => void;
