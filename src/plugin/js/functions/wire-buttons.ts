import screenfull from "screenfull";
import { AUTO_BUTTON_CLASS, BUTTON_CLASS, type Config } from "../config";
import type { Deck } from "../types";
import { fullscreenEnabled } from "./fullscreen-enabled";

const hasGoNext = (button: HTMLElement): boolean =>
	Number.isFinite(Number.parseInt(button.dataset.fsGonext ?? "", 10));

/**
 * Set up the fullscreen buttons in the deck that are not set up yet, and deal
 * with the ones that cannot work because the browser has no Fullscreen API.
 *
 * Safe to run again: a button that has `fsfx-button` is done. What this writes
 * is in the buttons' attributes, so it also survives scroll view rebuilding the
 * slides from a copy of their HTML. It runs again for buttons that another
 * plugin adds after FsFx has started, such as one in a Simplemenu bar.
 *
 * A button with `data-fs-gonext` keeps working without the Fullscreen API: it
 * falls back to advancing the deck, which is the half of its job that does not
 * need fullscreen. So it is never hidden.
 */
export const prepareButtons = (revealElement: HTMLElement, config: Config): void => {
	const enabled = fullscreenEnabled(config);

	for (const button of Array.from(
		revealElement.querySelectorAll<HTMLElement>(`.${config.baseclass}`)
	)) {
		if (button.classList.contains(BUTTON_CLASS)) continue;

		// So the stylesheet can reach a button whose class the deck chose, and
		// let it inherit its colour.
		button.classList.add(BUTTON_CLASS);

		// Older decks style their buttons `display: none` and expect FsFx to
		// reveal the ones that work. Kept for those; see `compatibility` in the
		// readme. The generated button is styled by fsfx.css and never needs it.
		if (config.compatibility && !button.classList.contains(AUTO_BUTTON_CLASS)) {
			button.style.display = "inline-block";
		}

		if (!enabled && config.hideifnofs && !hasGoNext(button)) {
			button.style.cssText += "pointer-events: none;";
			button.style.cssText += button.dataset.nofsfxCss || config.nofsfxCss || "";
		}
	}
};

/**
 * Give every fullscreen button in the deck its click behaviour.
 *
 * The clicks are heard on the deck's own element, not on each button. Reveal's
 * scroll view rebuilds the slides from a copy of their HTML when it switches
 * off, which gives every button inside a slide a new element without any
 * listener on it. The deck's element stays, and so does a listener there, and
 * it also hears buttons that another plugin adds to the deck later.
 */
export const wireButtons = (deck: Deck, config: Config, viewport: Element): void => {
	const enabled = fullscreenEnabled(config);
	const revealElement = deck.getRevealElement();

	prepareButtons(revealElement, config);

	revealElement.addEventListener("click", (event) => {
		const target = event.target instanceof Element ? event.target : null;
		const button = target?.closest<HTMLElement>(`.${config.baseclass}`);
		if (!button || !revealElement.contains(button)) return;

		const goNext = Number.parseInt(button.dataset.fsGonext ?? "", 10);

		if (Number.isFinite(goNext)) {
			if (screenfull.isFullscreen || !enabled) {
				deck.next();
				return;
			}
			// The delay is the point: the slide changes once the browser has
			// finished resizing, rather than during it. A refused request
			// still advances the deck, which is the half of this button's
			// job that fullscreen is not needed for.
			screenfull
				.request(viewport)
				.catch(() => {})
				.finally(() => {
					setTimeout(() => deck.next(), goNext);
				});
			return;
		}

		if (enabled) {
			// A browser can refuse this — no user activation, or a policy
			// against it — and that rejection is nothing to crash over.
			screenfull.toggle(viewport).catch(() => {});
		}
	});
};
