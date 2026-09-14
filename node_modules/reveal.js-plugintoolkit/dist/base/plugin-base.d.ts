import { RevealInstance } from '../types';
export type { RevealInstance };
/**
 * The plugin's init callback.
 *
 * Written as a method and then read back off with an indexed access so the
 * signature keeps its method-bivariance: `strictFunctionTypes` checks
 * function-typed *properties* contravariantly, which would reject a callback
 * that annotates `deck` with the full deck type from the author's own
 * reveal.js version rather than with `RevealInstance`.
 */
interface PluginInitHolder<TConfig extends object> {
    init(plugin: PluginBase<TConfig>, deck: RevealInstance, config: TConfig): void | Promise<void>;
}
export type PluginInit<TConfig extends object> = PluginInitHolder<TConfig>['init'];
interface PluginOptions<TConfig extends object> {
    /** Unique identifier for the plugin */
    id: string;
    /** Plugin initialization function */
    init?(plugin: PluginBase<TConfig>, deck: RevealInstance, config: TConfig): void | Promise<void>;
    /** Default configuration object */
    defaultConfig?: TConfig;
}
export declare class PluginBase<TConfig extends object = Record<string, never>> {
    private readonly defaultConfig;
    private readonly pluginInit?;
    readonly pluginId: string;
    private mergedConfig;
    private userConfigData;
    /** Public data storage for plugin state */
    data: Record<string, unknown>;
    constructor(idOrOptions: string | PluginOptions<TConfig>, init?: PluginInit<TConfig>, defaultConfig?: TConfig);
    private initializeConfig;
    getCurrentConfig(): TConfig;
    getData(): Record<string, unknown> | undefined;
    get userConfig(): Partial<TConfig>;
    getEnvironmentInfo: () => import('..').EnvironmentInfo;
    init(deck: RevealInstance): void | Promise<void>;
    createInterface(additionalExports?: Record<string, unknown>): Record<string, unknown>;
}
