import { PluginBase } from '../../base/plugin-base';
import { PluginCssOptions, PluginCssResult, PluginCssSettings } from './types';
/**
 * Put the plugin's stylesheet on the page, or explain why it is not there.
 *
 * Takes either a `PluginBase` and its config, or the 1.0.x options object. Both
 * lead to the same decision — the options form is an adapter, not a second
 * implementation.
 */
export declare function pluginCSS<TConfig extends object>(firstParam: PluginBase<TConfig> | PluginCssOptions, config?: PluginCssSettings): Promise<PluginCssResult>;
