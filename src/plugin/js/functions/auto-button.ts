import { positionTools, type RevealInstance } from "reveal.js-plugintoolkit";
import { ANCHOR_CLASS, AUTO_BUTTON_CLASS, type AutoPosition } from "../config";
import type { Deck } from "../types";
import { isSet } from "./resolve-position";

/**
 * Add the single always-visible fullscreen button, unless the deck already has
 * one of its own outside the slides — a button in a menubar, say. A button
 * inside a slide is not looked at: it travels with that slide, which is the
 * case the generated one exists to cover.
 *
 * The button goes into an anchor from the toolkit, which holds the top or bottom
 * edge of what the reader sees: the window for a deck that has the page to
 * itself, the deck's own box when embedded, in scroll view as well. The button
 * is then placed against that edge by fsfx.css. Top, unless the position names
 * only a bottom.
 *
 * @returns Whether a button was generated. A button the deck wrote itself is
 * left to take its colour from whatever holds it, so nothing else is needed.
 */
export const autoButton = (
	deck: Deck,
	baseclass: string,
	position: AutoPosition | false
): boolean => {
	const revealElement = deck.getRevealElement();
	const slides = revealElement.querySelector(".slides");
	if (!slides) return false;

	const alreadyHasFsButton = Array.from(revealElement.children).some(
		(sibling) =>
			sibling !== slides &&
			(sibling.classList.contains(baseclass) || sibling.querySelector(`.${baseclass}`))
	);

	if (alreadyHasFsButton) return false;

	const { top, bottom } = position || {};
	const edge = isSet(bottom) && !isSet(top) ? "bottom" : "top";
	const anchor = positionTools.addAnchor(deck as unknown as RevealInstance, {
		edge,
		className: ANCHOR_CLASS,
		// A custom property, so a deck can still lift the button above something
		// of its own without reaching for `!important`.
		zIndex: "var(--fsfx-z, 2)",
	});
	if (!anchor) return false;

	const fsbtn = document.createElement("button");
	fsbtn.className = `${baseclass} ${AUTO_BUTTON_CLASS} icon-fs`;
	fsbtn.dataset.fsToggle = "icon-fsexit";
	// Labelled, because the face of it is an icon from a font and a screen
	// reader would otherwise read out the "+" that draws it.
	fsbtn.setAttribute("aria-label", "Toggle fullscreen");
	fsbtn.type = "button";
	anchor.appendChild(fsbtn);

	return true;
};
