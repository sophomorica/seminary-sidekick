/**
 * reveal — Svelte action for intersection-triggered section fade-ins.
 *
 * Behavior:
 *  - Adds the `reveal` class to the element so it starts at opacity 0
 *    + translateY(16px) (CSS lives in `src/app.css`).
 *  - When the element scrolls into view (intersectionRatio > ~0.15),
 *    sets `data-revealed="true"` which animates it to its final state
 *    over ~450ms with the brand's `ease-out-soft` easing.
 *  - Fires once per element, then unobserves itself.
 *  - SSR-safe: bails on the server (no `window`).
 *  - Respects `prefers-reduced-motion`: if reduced, marks revealed
 *    immediately so the element shows in its final state without animation.
 *
 * Usage:
 *   <section use:reveal>...</section>
 */

import type { Action } from 'svelte/action';

export const reveal: Action<HTMLElement> = (node) => {
	// SSR / no-window guard
	if (typeof window === 'undefined') {
		return {};
	}

	node.classList.add('reveal');

	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	// IntersectionObserver may not exist in very old browsers — fall back gracefully.
	if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
		node.setAttribute('data-revealed', 'true');
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
					node.setAttribute('data-revealed', 'true');
					observer.unobserve(node);
				}
			}
		},
		{
			// Fire as soon as ~15% of the element is visible.
			threshold: [0, 0.15, 0.3],
			// Slight bottom-margin pull so the reveal lands just before
			// the user reaches the section.
			rootMargin: '0px 0px -10% 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
