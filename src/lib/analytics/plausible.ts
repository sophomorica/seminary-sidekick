/**
 * Thin Plausible wrapper for seminarysidekick.com.
 *
 * The live hashed snippet lives in `src/app.html` (`pa-vYYRdw2uX4IsyGg8VCpY5.js`).
 * That loader queues `window.plausible(...)` calls and auto-captures History API
 * pageviews (SvelteKit client navigations). Do not also fire `pageview` from
 * `afterNavigate` — that would double-count.
 *
 * To swap the snippet: replace the script `src` in `src/app.html` if
 * Marketing/Charlie sends a new hashed URL. Do not switch to
 * `script.tagged-events.js` or a `data-domain` placeholder.
 *
 * Custom events (Marketing lock):
 *   get_app_click { store: 'ios' | 'android' }
 *   printout_print
 *   class_play_join
 *
 * `track` no-ops when `window.plausible` is missing (SSR / tests).
 */

export const PLAUSIBLE_SCRIPT_URL = 'https://plausible.io/js/pa-vYYRdw2uX4IsyGg8VCpY5.js';

export type StoreProp = 'ios' | 'android';

export type PlausibleEvent = 'get_app_click' | 'printout_print' | 'class_play_join';

type PlausibleOptions = { props?: Record<string, string> };

export type PlausibleFn = ((event: string, options?: PlausibleOptions) => void) & {
	q?: unknown[];
	init?: (options?: Record<string, unknown>) => void;
};

declare global {
	interface Window {
		plausible?: PlausibleFn;
	}
}

export function track(event: 'get_app_click', props: { store: StoreProp }): void;
export function track(event: 'printout_print' | 'class_play_join'): void;
export function track(event: PlausibleEvent, props?: { store: StoreProp }): void {
	if (typeof window === 'undefined') return;
	const plausible = window.plausible;
	if (typeof plausible !== 'function') return;
	if (event === 'get_app_click' && props) {
		plausible(event, { props });
		return;
	}
	plausible(event);
}
