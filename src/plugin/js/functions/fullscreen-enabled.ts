import screenfull from "screenfull";
import type { Config } from "../config";

/**
 * Whether this browser will go fullscreen at all.
 *
 * `debugfsdisabled` forces a no, so a deck can be designed against the
 * unsupported case without having to find a browser that lacks the API.
 */
export const fullscreenEnabled = (config: Config): boolean => {
	if (config.debugfsdisabled) {
		return false;
	}
	return screenfull.isEnabled;
};
