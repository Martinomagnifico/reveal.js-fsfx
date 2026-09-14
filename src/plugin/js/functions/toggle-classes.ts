import screenfull from "screenfull";
import { FULLSCREEN_CLASS } from "../config";

/**
 * Follow the browser in and out of fullscreen: the deck's element gets
 * `fullscreen`, and every `[data-fs-toggle]` element gets the class it names.
 *
 * Only what is inside the fullscreen element counts as being in fullscreen. With
 * two embedded decks on a page, one of them in fullscreen, the other deck and its
 * buttons stay as they are. Every deck runs this, and all of them come to the
 * same answer for each element, so it does not matter which one runs last.
 *
 * The deck's own class is set whether or not anything carries `data-fs-toggle`.
 * It is what a deck styles against when it cannot add that attribute itself.
 *
 * The `[data-fs-toggle]` elements are looked up each time rather than once:
 * Reveal's scroll view rebuilds the slides from a copy of their HTML when it
 * switches off, and the elements in there are new ones. That rebuild also has
 * the classes put right again, because going in or out of fullscreen changes
 * the size of the deck, which can be what switches scroll view off.
 */
export const toggleClasses = (revealElement: HTMLElement): void => {
	const apply = () => {
		const fullscreenElement = screenfull.isFullscreen ? screenfull.element : undefined;
		const inFullscreen = (element: Element): boolean =>
			!!fullscreenElement && fullscreenElement.contains(element);

		revealElement.classList.toggle(FULLSCREEN_CLASS, inFullscreen(revealElement));

		for (const element of Array.from(
			document.querySelectorAll<HTMLElement>("[data-fs-toggle]")
		)) {
			const className = element.dataset.fsToggle;
			if (className) {
				element.classList.toggle(className, inFullscreen(element));
			}
		}
	};

	screenfull.on("change", apply);

	const slides = revealElement.querySelector(".slides");
	if (slides) {
		new MutationObserver(apply).observe(slides, { childList: true });
	}
};
