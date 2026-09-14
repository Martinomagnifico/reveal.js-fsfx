import {
	AUTO_BUTTON_CLASS,
	type AutoConfig,
	type Config,
	LEGACY_AUTO_COLORS,
	NO_BUTTON_STATE,
} from "../config";

/**
 * Whether the deck named a colour of its own. Empty is the default, and the values
 * FsFx 1.2.0 shipped as defaults count as not named either, so a deck that copied
 * them still follows its theme.
 */
const isOwnColor = (value: string, legacy: string): boolean =>
	!!value.trim() && value.trim() !== legacy;

/**
 * Hand the stylesheet what it cannot know on its own: where the generated button
 * sits, and any colour the deck named for it. Everything else is in fsfx.css.
 *
 * Colour is not set here unless the deck asked for one. The stylesheet falls
 * back to `--c-theme-color`, which the toolkit measures off the theme and keeps
 * matched to the slide on screen, so the button follows the deck by itself.
 *
 * The one thing that cannot live in a static file is `nofsfxCss`, which is CSS
 * the deck author writes, so that goes into a style element of its own.
 */
export const autoStyling = (
	revealElement: HTMLElement,
	viewportElement: HTMLElement,
	auto: AutoConfig,
	config: Config
): void => {
	if (isOwnColor(auto.color, LEGACY_AUTO_COLORS.color)) {
		revealElement.style.setProperty("--fsfx-color", auto.color);
	}
	if (isOwnColor(auto.oppositecolor, LEGACY_AUTO_COLORS.oppositecolor)) {
		revealElement.style.setProperty("--fsfx-inverse-color", auto.oppositecolor);
		// Kept for decks that use this variable in their own styling, which
		// earlier versions of FsFx invited them to do.
		revealElement.style.setProperty("--r-opposite-color", auto.oppositecolor);
	}

	if (auto.position) {
		revealElement.style.setProperty("--fsfx-top", auto.position.top ?? "auto");
		revealElement.style.setProperty("--fsfx-right", auto.position.right ?? "auto");
		revealElement.style.setProperty("--fsfx-bottom", auto.position.bottom ?? "auto");
		revealElement.style.setProperty("--fsfx-left", auto.position.left ?? "auto");
	}

	if (!config.nofsfxCss) return;

	// `data-state` goes on the viewport element, which is the body for a deck
	// that has the page to itself and the deck's own element for an embedded
	// one. Scoping the rule to `.reveal` — as FsFx used to — matches neither.
	let scope = `.${NO_BUTTON_STATE}`;
	if (viewportElement === revealElement) {
		// Embedded: one of several decks on the page, so the rule is tied to this
		// one. An id has to start with a letter to be usable in a selector.
		if (!revealElement.id) {
			revealElement.id = `fsfx-${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
		}
		scope = `#${revealElement.id}.${NO_BUTTON_STATE}`;
	}

	const stateStyle = document.createElement("style");
	stateStyle.textContent = `${scope} .${AUTO_BUTTON_CLASS}{${config.nofsfxCss}}`;
	document.head.appendChild(stateStyle);
};
