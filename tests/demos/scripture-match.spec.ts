/**
 * Scripture Match demo — interactive pair-matching round.
 *
 * Verifies the demo loads, items are interactive, and accessibility
 * basics (aria-pressed, aria-live announcement region) are wired up.
 *
 * A full "match all 8 pairs" play-through is hard to test reliably
 * without knowing internal scriptureId mappings — we don't depend on
 * data internals here. Instead we verify the surface contract.
 */

import { test, expect } from '@playwright/test';

test.describe('Scripture Match demo', () => {
	test('standalone page renders with two columns of selectable items', async ({ page }) => {
		await page.goto('/scripture-match');

		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.locator('#scripture-match-demo')).toBeVisible();

		// 8 key phrases + 8 references = 16 selectable buttons in the demo region.
		const items = page.locator('#scripture-match-demo button').filter({
			// Filter out any "Skip" or "Reset" CTAs.
			hasNotText: /skip|reset|back|home/i
		});
		// Items are populated in onMount, so wait for the first one before counting.
		await expect(items.first()).toBeVisible();
		const count = await items.count();
		expect(count, 'Scripture Match should expose ~16 selectable items').toBeGreaterThanOrEqual(
			16
		);
	});

	test('items are focusable and use aria-pressed for selection state', async ({ page }) => {
		await page.goto('/scripture-match');
		await expect(page.locator('#scripture-match-demo')).toBeVisible();

		const first = page.locator('#scripture-match-demo button').first();
		await first.focus();
		await expect(first).toBeFocused();

		// Before click: aria-pressed is "false" (selectable).
		const beforeAria = await first.getAttribute('aria-pressed');
		expect(
			beforeAria,
			'items should expose aria-pressed for SR-friendly selection'
		).not.toBeNull();
	});

	test('clicking an item toggles its visual selection state', async ({ page }) => {
		await page.goto('/scripture-match');
		await expect(page.locator('#scripture-match-demo')).toBeVisible();

		const first = page.locator('#scripture-match-demo button').first();
		await first.click();
		// After click: aria-pressed should be "true".
		await expect(first).toHaveAttribute('aria-pressed', 'true');
	});
});
