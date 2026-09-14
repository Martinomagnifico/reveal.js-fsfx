/**
 * What the author asked for.
 *
 * `cssautoload` is a tri-state, and "unset" is one of the three: leaving it out
 * and writing `'auto'` mean exactly the same thing — decide for me. `true` asks
 * for the standard paths to be tried even where nothing can be derived from the
 * plugin's own file, and `false` switches loading off entirely.
 */
export interface PluginCssSettings {
    cssautoload?: boolean | "auto";
    /** Where the stylesheet is. `false` is the same as `cssautoload: false`. */
    csspath?: string | false;
    debug?: boolean;
}
/**
 * The 1.0.x call shape: the same settings with the plugin id alongside them.
 */
export interface PluginCssOptions extends PluginCssSettings {
    id: string;
}
/**
 * What happened, so a plugin can react to it. A plugin that reads colours or
 * sizes back off the page wants `present` or `loaded` before it measures
 * anything.
 */
export type PluginCssStatus = 
/** Already on the page when we looked. */
"present"
/** We put it there. `path` says from where. */
 | "loaded"
/** Switched off by `cssautoload: false` or `csspath: false`. */
 | "skipped"
/** Nothing to resolve a path against; the console says what would fix it. */
 | "advised"
/** Everything that was tried failed. The deck is unstyled. */
 | "failed";
export interface PluginCssResult {
    status: PluginCssStatus;
    /** The path that was loaded, or the one that failed. */
    path?: string;
}
