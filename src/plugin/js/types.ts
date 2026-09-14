import type { Config } from "./config";

declare namespace Reveal {
	export interface Deck {
		getConfig(): {
			fsfx?: Partial<Config>;
			embedded?: boolean;
			debug?: boolean;
		};
		getRevealElement(): HTMLElement;
		getViewportElement(): HTMLElement | null;
		next(): void;
		on(eventName: string, callback: (event: unknown) => void): void;
	}
}

export type Deck = Reveal.Deck;
