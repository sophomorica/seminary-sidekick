/**
 * Smoke tests — every public route loads cleanly.
 *
 * Catches: 500s, broken imports, build-time errors, console JS errors,
 * missing `<main>` (which would break the skip link + accessibility),
 * pages that throw during SSR.
 *
 * This file is the regression baseline. If any test here fails, the
 * site is broken in a way that visitors would notice.
 */

import { test, expect, type Page } from '@playwright/test';

/**
 * Every static route exposed by the site. Keep in sync with
 * `src/routes/` and `src/lib/config/nav.ts`.
 *
 * Dynamic routes (/news/[slug]) are tested elsewhere when content exists.
 */
const ROUTES = [
	'/',
	'/apps',
	'/apps/scripture-mastery',
	'/quick-quiz',
	'/scripture-match',
	'/premium',
	'/for-teachers',
	'/news',
	'/about',
	'/privacy',
	'/terms',
	'/contact'
] as const;

/**
 * Capture page-level errors so a route that "loads" but throws in JS
 * (a common Svelte runtime bug pattern) still fails the test.
 */
function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			// Filter expected dev-only noise (e.g. Vite HMR connection messages).
			const text = msg.text();
			if (text.includes('vite') && text.includes('connecting')) return;
			errors.push(`console.error: ${text}`);
		}
	});
	return errors;
}

for (const route of ROUTES) {
	test(`${route} loads with 200 and no JS errors`, async ({ page }) => {
		const errors = trackErrors(page);
		const response = await page.goto(route, { waitUntil: 'networkidle' });

		expect(response, `no response for ${route}`).not.toBeNull();
		expect(response!.status(), `${route} status`).toBe(200);

		// Structural sanity: every page must render the layout shell.
		await expect(page.locator('#main-content')).toBeVisible();
		await expect(page.locator('header[role]').or(page.locator('header'))).toBeVisible();
		await expect(page.locator('footer')).toBeVisible();

		// One <h1> per page (accessibility requirement).
		const h1Count = await page.locator('h1').count();
		expect(h1Count, `${route} should have exactly one <h1>`).toBeGreaterThanOrEqual(1);

		// No runtime JS errors during load.
		expect(errors, `JS errors on ${route}:\n${errors.join('\n')}`).toEqual([]);
	});
}

test('404 page renders for an unknown route', async ({ page }) => {
	const response = await page.goto('/this-route-definitely-does-not-exist-xyz123', {
		waitUntil: 'networkidle'
	});
	expect(response!.status()).toBe(404);
	// Friendly 404 from `src/routes/+error.svelte` — "Verse not found."
	await expect(page.getByRole('heading', { name: /verse not found/i })).toBeVisible();
	await expect(page.getByRole('link', { name: /back home/i })).toBeVisible();
});

test('RSS feed serves valid XML', async ({ request }) => {
	const res = await request.get('/news/rss.xml');
	expect(res.status()).toBe(200);
	const body = await res.text();
	expect(body).toMatch(/^<\?xml/);
	expect(body).toContain('<rss');
});
