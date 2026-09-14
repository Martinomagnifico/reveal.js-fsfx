// Helper imports
import {
	pluginDebug as debug,
	PluginBase,
	pluginCSS,
	type RevealInstance,
	warnOnce,
} from "reveal.js-plugintoolkit";
import type { Config } from "./config";
import { defaultConfig, PLUGIN_ID } from "./config";
// Function imports
import { FsFx } from "./core";
import type { Deck } from "./types";

const init = async (
	plugin: PluginBase<Config>,
	revealDeck: RevealInstance,
	config: Config
): Promise<void> => {
	// FsFx types the deck more narrowly than the toolkit does.
	const deck = revealDeck as unknown as Deck;

	if (debug && (config.debug || deck.getConfig().debug)) {
		debug.initialize(true, PLUGIN_ID);
		debug.log("FsFx debugging enabled.");
	}

	if (config.compatibility) {
		warnOnce(
			PLUGIN_ID,
			"FsFx runs in compatibility mode, and sets `display: inline-block` on your fullscreen buttons. If your stylesheet no longer hides them with `display: none`, set `compatibility: false` and style them however you like."
		);
	}

	await pluginCSS(plugin, config);

	await FsFx.create(deck, config);
};

export default () => {
	const plugin = new PluginBase(PLUGIN_ID, init, defaultConfig);
	return plugin.createInterface();
};
