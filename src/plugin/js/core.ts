import {
	pluginDebug as debug,
	type RevealInstance,
	stateTools,
	themeTools,
} from "reveal.js-plugintoolkit";
import type { Config } from "./config";
import { autoButton } from "./functions/auto-button";
import { autoStyling } from "./functions/auto-styling";
import { fullscreenEnabled } from "./functions/fullscreen-enabled";
import { addIcons } from "./functions/icons";
import { resolvePosition } from "./functions/resolve-position";
import { toggleClasses } from "./functions/toggle-classes";
import { prepareButtons, wireButtons } from "./functions/wire-buttons";
import type { Deck } from "./types";

export class FsFx {
	private readonly deck: Deck;
	private readonly config: Config;
	private readonly revealElement: HTMLElement;

	constructor(deck: Deck, config: Config) {
		this.deck = deck;
		this.config = config;
		this.revealElement = deck.getRevealElement();
	}

	async run(): Promise<void> {
		const { config, deck, revealElement } = this;
		const enabled = fullscreenEnabled(config);

		// A deck can be built on the body itself. `document` has no
		// `requestFullscreen`, so the element that stands in for it is
		// `documentElement`, not the document.
		const viewport: Element =
			revealElement.tagName === "BODY" ? document.documentElement : revealElement;

		let generatedButton = false;

		if (config.auto) {
			const position = resolvePosition(deck, config);
			if (config.auto.generate) {
				generatedButton = autoButton(deck, config.baseclass, position);
			}
			if (generatedButton) {
				// `data-state="no-fsfx-button"` hides the generated button. Reveal's
				// scroll view applies no slide states, so the toolkit does it there.
				// Now, from the plugin's init, before scroll view takes stacks apart.
				stateTools.addSlideStates(deck as unknown as RevealInstance);
			}
			// Reveal hands slide states to this element, which is the body for a
			// deck that has the page to itself and the deck's own element for an
			// embedded one.
			const viewportElement = deck.getViewportElement() ?? document.body;
			autoStyling(revealElement, viewportElement, { ...config.auto, position }, config);
		}

		// After the generated button is in place, so it is set up and wired like any
		// button the deck wrote itself. Icons for every `.icon-fs` element too.
		wireButtons(deck, config, viewport);
		addIcons(revealElement, config.icons);

		// Buttons and `.icon-fs` elements that another plugin adds after FsFx has
		// started, such as one in a Simplemenu bar, get the same setup and icons:
		// once the deck is ready, after every plugin's own `ready` work, and whenever
		// something is added to the deck itself, which is where bars and anchors go.
		// Clicks need nothing more; they are heard on the deck.
		const refresh = () => {
			prepareButtons(revealElement, config);
			addIcons(revealElement, config.icons);
		};
		deck.on("ready", () => setTimeout(refresh));
		new MutationObserver(refresh).observe(revealElement, { childList: true });

		if (!enabled) {
			debug.log("The browser does not support the Fullscreen API.");
			document.body.classList.add("no-fsfx");
			return;
		}

		if (!revealElement.querySelector(`.${config.baseclass}`)) {
			debug.log("There are no fullscreen buttons yet.");
		}

		// Always, even with nothing carrying `data-fs-toggle`: the deck's own
		// `fullscreen` class is set here too, and it is the only class a deck
		// that cannot write attributes of its own can style against.
		toggleClasses(revealElement);

		await this.followTheme(generatedButton);
	}

	/**
	 * Publish `--c-theme-color`, which the generated button follows when the deck
	 * has not named a colour of its own. The toolkit measures the theme and keeps
	 * the value matched to the slide on screen, including slides whose background
	 * contrasts the theme.
	 *
	 * Only for a button FsFx generated itself, which is a direct child of the deck
	 * with nothing to inherit a colour from. A button the deck wrote sits inside
	 * something — a Simplemenu bar, say — and should take that thing's colour,
	 * including one the deck has overridden there, so FsFx colours nothing and
	 * asks for nothing on its behalf. If another plugin on the deck wants the
	 * theme colours, it asks for them itself; the toolkit measures once either way.
	 *
	 * Last, and only awaited here: it waits for a theme to land before measuring,
	 * and nothing above should sit behind that wait.
	 */
	private async followTheme(generatedButton: boolean): Promise<void> {
		if (!generatedButton) return;

		const themeColors = await themeTools.addThemeColor(this.deck as unknown as RevealInstance);

		if (!themeColors) {
			debug.log(
				"No Reveal theme was found, so no theme colors could be read. If this deck styles itself without a theme, set `color` and `oppositecolor` in the FsFx auto options."
			);
		}
	}

	static async create(deck: Deck, config: Config): Promise<FsFx> {
		const fsfx = new FsFx(deck, config);
		await fsfx.run();
		return fsfx;
	}
}
