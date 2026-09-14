type TableMethod = {
    (tabularData: unknown, properties?: readonly string[]): void;
    (message: string, tabularData: unknown, properties?: readonly string[]): void;
};
type ConsoleMethods = {
    [K in keyof Console]: K extends 'table' ? TableMethod : Console[K] extends ((...args: unknown[]) => unknown) ? (...args: unknown[]) => void : never;
};
type DebugWithConsoleMethods = PluginDebug & ConsoleMethods;
declare class PluginDebug {
    debugMode: boolean;
    label: string;
    groupDepth: number;
    initialize(isDebug: boolean, label?: string): void;
    group: (...args: unknown[]) => void;
    groupCollapsed: (...args: unknown[]) => void;
    groupEnd: () => void;
    error: (...args: unknown[]) => void;
    table: TableMethod;
    formatAndLog: (logMethod: (...args: unknown[]) => void, args: unknown[]) => void;
    debugLog(methodName: keyof Console, ...args: unknown[]): void;
}
export declare const pluginDebug: DebugWithConsoleMethods;
export declare const warnOnce: (pluginId: string, message: string) => void;
export {};
