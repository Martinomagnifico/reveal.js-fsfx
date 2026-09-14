import type { AutoPosition, Config } from "../config";
import type { Deck } from "../types";

/**
 * The corner the generated button goes in.
 *
 * A position the deck names replaces the default one rather than adding to it.
 * The toolkit merges the deck's options into the defaults key by key, so
 * `{ bottom: '20px', left: '20px' }` would otherwise keep the default `top` and
 * `right` as well: a button pinned to all four sides, stretched across the top.
 * So the deck's own `position` is read from its config, as written.
 */
export const resolvePosition = (deck: Deck, config: Config): AutoPosition | false => {
	if (!config.auto) return false;

	const own = deck.getConfig().fsfx?.auto;
	if (own && typeof own === "object" && "position" in own) {
		return own.position ?? false;
	}
	return config.auto.position;
};

/** Whether a side of the position is actually set. `auto` is the same as leaving it out. */
export const isSet = (value: string | undefined): boolean => !!value && value !== "auto";
