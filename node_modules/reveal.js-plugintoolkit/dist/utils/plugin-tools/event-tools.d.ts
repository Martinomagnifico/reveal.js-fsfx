import { RevealInstance } from '../../types';
export type { RevealInstance };
/**
 * Sets up horizontal and vertical slide change events. Any plugin may call it; the first call on a deck installs, later calls do nothing.
 * No teardown by design: nothing stops wanting these, and `Reveal.destroy()` leaves the listener in place anyway.
 * @param deck - The reveal.js deck instance
 * @fires slidechanged-h When horizontal slide index changes
 * @fires slidechanged-v When vertical slide index changes within same horizontal stack
 */
export declare const addDirectionEvents: (deck: RevealInstance) => void;
export declare const addMoreDirectionEvents: (deck: RevealInstance) => void;
/**
 * Adds custom events for scroll mode transitions. Any plugin may call it; the first call on a deck installs the observer, later calls do nothing.
 * Only the installing call gets a working teardown, so one plugin shutting down leaves the events up for the rest.
 * @param deck - The reveal.js deck instance
 * @returns A function that disconnects the observer, or a no-op if this call did not install it.
 * @fires scrollmode-enter When entering scroll mode
 * @fires scrollmode-exit When exiting scroll mode
 */
export declare const addScrollModeEvents: (deck: RevealInstance) => (() => void);
