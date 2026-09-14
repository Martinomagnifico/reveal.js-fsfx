import { warnOnce } from "reveal.js-plugintoolkit";
import {
	DEFAULT_ICONS,
	ICON_CLASS,
	ICON_TRIGGER_CLASS,
	type IconConfig,
	PLUGIN_ID,
} from "../config";

const SVG_NS = "http://www.w3.org/2000/svg";

type IconKind = keyof IconConfig;

/**
 * Turn SVG markup into an element for this document, or `null` if it is not an
 * SVG. The markup comes from the deck's own configuration, but it is still kept
 * to drawing: no scripts, no embedded HTML, no event handler attributes.
 */
const parseIcon = (markup: string): SVGSVGElement | null => {
	let source = markup.trim();
	// Pasted from an HTML page, an SVG often has no namespace, and without one the
	// SVG parser does not see an SVG.
	if (!/^<svg\b[^>]*\bxmlns=/.test(source)) {
		source = source.replace(/^<svg\b/, `<svg xmlns="${SVG_NS}"`);
	}

	const parsed = new DOMParser().parseFromString(source, "image/svg+xml");
	const svg = parsed.documentElement;
	if (
		parsed.getElementsByTagName("parsererror").length ||
		svg.namespaceURI !== SVG_NS ||
		svg.localName !== "svg"
	) {
		return null;
	}

	for (const element of [svg, ...Array.from(svg.querySelectorAll("*"))]) {
		if (element.localName === "script" || element.localName === "foreignObject") {
			element.remove();
			continue;
		}
		for (const attribute of Array.from(element.attributes)) {
			if (attribute.name.toLowerCase().startsWith("on")) {
				element.removeAttribute(attribute.name);
			}
		}
	}

	return document.importNode(svg, true) as unknown as SVGSVGElement;
};

/** The icon as FsFx places it: its classes, sized to the text, hidden from screen readers. */
const prepareIcon = (kind: IconKind, markup: string): SVGSVGElement => {
	let svg = parseIcon(markup);
	let isDefault = markup === DEFAULT_ICONS[kind];
	if (!svg) {
		warnOnce(
			PLUGIN_ID,
			`The \`icons.${kind}\` option is not valid SVG markup, so FsFx uses its own icon instead.`
		);
		svg = parseIcon(DEFAULT_ICONS[kind]) as SVGSVGElement;
		isDefault = true;
	}

	svg.classList.add(ICON_CLASS, `${ICON_CLASS}-${kind}`);
	// FsFx's own icons take their line width from `--fsfx-icon-stroke-width`. A
	// deck's own icons keep the width they were drawn with.
	if (isDefault) svg.classList.add(`${ICON_CLASS}-default`);
	// The size of the text around it, whatever size the SVG was drawn at. Also
	// as attributes, so it is not drawn at full size before fsfx.css has loaded.
	svg.setAttribute("width", "1em");
	svg.setAttribute("height", "1em");
	// Decoration: the button carries the label.
	svg.setAttribute("aria-hidden", "true");
	svg.setAttribute("focusable", "false");
	return svg;
};

/**
 * Put both icons at the end of every `.icon-fs` element in the deck, where the
 * font glyph used to be drawn. Both are there from the start, and fsfx.css shows
 * one: the exit icon while the element has `icon-fsexit`, which `data-fs-toggle`
 * switches with fullscreen.
 *
 * Safe to run again: an element that already has its icons is left alone. It
 * runs once more when the deck is ready, for buttons that another plugin builds
 * after FsFx has started, such as one in a Simplemenu bar. The icons are in the
 * HTML, so they also survive scroll view rebuilding the slides.
 */
export const addIcons = (root: HTMLElement, icons: IconConfig): void => {
	const targets = Array.from(root.querySelectorAll<HTMLElement>(`.${ICON_TRIGGER_CLASS}`)).filter(
		(element) => !element.querySelector(`:scope > .${ICON_CLASS}`)
	);
	if (!targets.length) return;

	const enter = prepareIcon("enter", icons.enter);
	const exit = prepareIcon("exit", icons.exit);
	for (const element of targets) {
		element.append(enter.cloneNode(true), exit.cloneNode(true));
	}
};
