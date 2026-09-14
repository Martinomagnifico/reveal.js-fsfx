// The plugin id, and the prefix on anything this plugin prints to the console.
export const PLUGIN_ID = "fsfx";

// The class FsFx puts on the deck's own element while the browser is fullscreen.
// Not an option: a slide cannot reach outside itself to set one, so a generated
// deck (Quarto, for one) has no way to name it. A fixed name is the point.
export const FULLSCREEN_CLASS = "fullscreen";

// Put on every button FsFx wires, whatever the deck called it. The stylesheet
// uses this name to let a button inherit its colour, so `baseclass` can be
// renamed without taking that with it. Not an option: a name nobody can change
// is the point.
export const BUTTON_CLASS = "fsfx-button";

// The generated button, and the state a slide sets to hide it.
export const AUTO_BUTTON_CLASS = "fsfxautobutton";

// The anchor the generated button sits in, built by the toolkit.
export const ANCHOR_CLASS = "fsfx-anchor";

// An element with this class gets the fullscreen icons; the icons themselves
// carry the second one.
export const ICON_TRIGGER_CLASS = "icon-fs";
export const ICON_CLASS = "fsfx-icon";

// What FsFx 1.2.0 shipped as the `auto` colours. A deck that still has these, copied
// from the old readme, has not named a colour of its own.
export const LEGACY_AUTO_COLORS = {
	color: "var(--r-main-color)",
	oppositecolor: "black",
} as const;
export const NO_BUTTON_STATE = "no-fsfx-button";

export interface AutoPosition {
	top?: string;
	right?: string;
	bottom?: string;
	left?: string;
}

export interface AutoConfig {
	generate: boolean;
	/** Overrides the theme colour the button would otherwise follow. */
	color: string;
	/** The same, for a slide whose background contrasts the theme. */
	oppositecolor: string;
	position: AutoPosition | false;
}

/** SVG markup for the two icons. */
export interface IconConfig {
	/** Shown while not in fullscreen. */
	enter: string;
	/** Shown in fullscreen. */
	exit: string;
}

export const DEFAULT_ICONS: IconConfig = {
	enter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10 14-7 7"/><path d="m14 10 7-7"/><path d="M15 3h6v6"/><path d="M9 21H3v-6"/></svg>',
	exit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10h-6V4"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>',
};

export interface Config {
	auto: AutoConfig | false;
	baseclass: string;
	compatibility: boolean;
	cssautoload: boolean;
	csspath: string;
	debug?: boolean;
	debugfsdisabled: boolean;
	hideifnofs: boolean;
	icons: IconConfig;
	nofsfxCss: string;
}

const defaultConfig: Config = {
	auto: {
		generate: true,
		// Empty on purpose: the button follows the theme through
		// `--c-theme-color` unless the deck names a colour of its own.
		color: "",
		oppositecolor: "",
		position: {
			right: "20px",
			top: "20px",
		},
	},
	baseclass: "fsbutton",
	compatibility: true,
	cssautoload: true,
	csspath: "",
	debugfsdisabled: false,
	hideifnofs: true,
	icons: DEFAULT_ICONS,
	nofsfxCss: "display: none;",
};

export { defaultConfig };
