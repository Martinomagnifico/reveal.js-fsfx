import { EnvironmentInfo } from '../types';
/**
 * What the page can tell us about how this plugin was loaded.
 *
 * Only `hasResolvableSource` decides anything in the toolkit, and it is answered
 * from URLs alone: no bundler-specific globals, so it survives minification, a
 * strict CSP and any output format.
 *
 * The HMR and dev flags below are kept because they are part of the published
 * type, and because a plugin may have its own reason to know. Nothing in the
 * toolkit reads them — they were proxies for "can a path be resolved", and being
 * poor proxies for it is what kept this file changing.
 */
export declare const detectEnvironment: (pluginId?: string) => EnvironmentInfo;
