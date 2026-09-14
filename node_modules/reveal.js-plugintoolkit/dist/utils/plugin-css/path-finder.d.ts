/**
 * Where was the plugin loaded from?
 *
 * One question, one answer: is there a URL for the plugin's own file, and if so
 * which directory is it in. That is the only thing autoloading needs, and it is
 * deliberately not the same question as "which bundler is this".
 */
export type PluginSource = {
    /**
     * Directory the plugin's own file lives in, trailing slash included.
     *
     * `''` is a real answer: the file sits in the same directory as the page.
     * `null` means the plugin could not be traced to a file of its own — it is
     * part of someone else's bundle, or served by a dev server — and no path can
     * be derived from it.
     */
    directory: string | null;
};
/**
 * Work out where the plugin was loaded from.
 */
export declare const findPluginSource: (pluginId: string) => PluginSource;
/**
 * True when the plugin's own file has a URL, so a stylesheet path can be
 * derived from it rather than guessed at.
 */
export declare const hasResolvableSource: (pluginId: string) => boolean;
export type PluginScriptSource = {
    directory: string;
    isBundled: boolean;
};
/**
 * @deprecated Use `findPluginSource`. This flattens "same directory as the
 * page" and "unknown" back into `''`, which is the ambiguity the new shape
 * exists to remove.
 */
export declare const findPluginScriptSource: (pluginId: string) => PluginScriptSource;
/**
 * @deprecated Use `hasResolvableSource`, which names what is actually tested.
 * The old name says "bundled" where the question is "is there a file to resolve
 * a path against" — a dev server answers no to that too, without being a bundle.
 */
export declare const isPluginBundled: (pluginId: string) => boolean;
/**
 * @deprecated Use `findPluginSource`. Returns the Reveal v5 directory as a guess
 * when the source is unknown, which hides the difference between a derived path
 * and a guessed one.
 */
export declare const findPluginScriptPath: (pluginId: string) => string;
