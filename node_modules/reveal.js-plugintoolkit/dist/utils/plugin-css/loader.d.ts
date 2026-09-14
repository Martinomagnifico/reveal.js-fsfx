/**
 * Helper function to load a CSS file via link element
 */
export declare const linkAndLoad: (pluginId: string, path: string) => Promise<void>;
export declare const isCssLoaded: (pluginId: string) => boolean;
/**
 * Whether the application has already brought this plugin's CSS in, via a link
 * tag we wrote or the `--cssimported-<id>` marker the stylesheet declares.
*/
export declare const isCssImported: (pluginId: string) => Promise<boolean>;
/**
 * The same question, but held open until the page has finished settling.
*/
export declare const whenCssImported: (pluginId: string) => Promise<boolean>;
/**
 * Is the stylesheet on the page right now? Answered from the page as it stands:
 * a link we wrote, or the `--cssimported-<id>` marker the stylesheet declares.
 *
 * The marker is read with `getComputedStyle`, so it is only true once the
 * browser has actually applied the file. A stylesheet that failed to load
 * cannot claim to be there.
 */
export declare const checkCssImported: (pluginId: string) => boolean;
