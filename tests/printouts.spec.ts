/**
 * Scripture Builder teacher printouts — full doctrinal-mastery library.
 *
 * Count + signed-off 2 Nephi 2:25 + one long verse + Advanced glyph contract.
 * Do not paste the catalog here.
 */

import { test, expect } from '@playwright/test';

const DEFAULT_SLUG = '2-nephi-2-25';
const LONG_SLUG = 'exodus-20-3-17';
const LIBRARY_COUNT = 100;

const NEPHI_ADVANCED = 'A___ f___ t___ m__ m____ b__ a__ m__ a___ t___ t___ m____ h___ j___';

const LONG_ADVANCED_PREFIX = 'T___ s____ h___ n_ o____ g___ b_____ m__';

test.describe('/teachers/printouts', () => {
	test('picker lists the full DM library and three levels', async ({ page }) => {
		const response = await page.goto('/teachers/printouts');
		expect(response?.status()).toBe(200);

		await expect(
			page.getByRole('heading', { level: 1, name: /scripture builder printouts/i })
		).toBeVisible();
		await expect(page.getByText(`All ${LIBRARY_COUNT} doctrinal-mastery`)).toBeVisible();

		const verse = page.locator('#printout-verse');
		await expect(verse).toBeVisible();
		await expect(verse).toHaveAttribute('data-verse-count', String(LIBRARY_COUNT));
		await expect(verse).toHaveValue(DEFAULT_SLUG);
		await expect(verse.locator('option')).toHaveCount(LIBRARY_COUNT);
		await expect(verse.getByRole('option', { name: /2 Nephi 2:25/i })).toHaveCount(1);
		await expect(verse.getByRole('option', { name: /Exodus 20:3/i })).toHaveCount(1);

		await expect(page.getByText(/Adam fell that men might be/i).first()).toBeVisible();

		await expect(page.getByRole('heading', { name: /^Beginner$/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /^Intermediate$/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /^Advanced$/i })).toBeVisible();

		const beginnerPrint = page.getByRole('link', { name: /print tiles/i }).first();
		await expect(beginnerPrint).toHaveAttribute(
			'href',
			`/teachers/printouts/${DEFAULT_SLUG}/beginner`
		);
		await expect(page.getByRole('link', { name: /download pdf/i })).toHaveCount(3);
		await expect(page.getByRole('link', { name: /download pdf/i }).first()).toHaveAttribute(
			'href',
			`/printouts/${DEFAULT_SLUG}-beginner.pdf`
		);

		await verse.selectOption(LONG_SLUG);
		await expect(beginnerPrint).toHaveAttribute(
			'href',
			`/teachers/printouts/${LONG_SLUG}/beginner`
		);
		await expect(page.getByRole('link', { name: /print hints/i })).toHaveAttribute(
			'href',
			`/teachers/printouts/${LONG_SLUG}/advanced`
		);
		await expect(page.getByRole('link', { name: /download pdf/i })).toHaveCount(0);
	});

	test('beginner sheet uses app 3-word chunks, several tiles, not one per page', async ({
		page
	}) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/beginner`);

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/cut-out tiles/i)).toBeVisible();

		const tileList = page.getByRole('list', { name: /beginner phrase tiles/i });
		await expect(tileList).toHaveAttribute('data-tile-grid', '2');
		const tiles = tileList.getByRole('listitem');
		await expect(tiles).toHaveCount(5);
		const phrases = (await tiles.allTextContents()).map((text) => text.trim());
		expect([...phrases].sort()).toEqual(
			[
				'Adam fell that',
				'and men are,',
				'have joy.',
				'men might be;',
				'that they might'
			].sort()
		);
		expect(phrases).not.toEqual([
			'Adam fell that',
			'men might be;',
			'and men are,',
			'that they might',
			'have joy.'
		]);
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
	});

	test('intermediate sheet uses app 2-word chunks', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/intermediate`);

		const tileList = page.getByRole('list', { name: /intermediate phrase tiles/i });
		await expect(tileList).toHaveAttribute('data-tile-grid', '2');
		const tiles = tileList.getByRole('listitem');
		await expect(tiles).toHaveCount(7);
		const phrases = (await tiles.allTextContents()).map((text) => text.trim());
		expect([...phrases].sort()).toEqual(
			[
				'Adam fell',
				'and men',
				'are, that',
				'have joy.',
				'might be;',
				'that men',
				'they might'
			].sort()
		);
		expect(phrases).not.toEqual([
			'Adam fell',
			'that men',
			'might be;',
			'and men',
			'are, that',
			'they might',
			'have joy.'
		]);
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
	});

	test('advanced sheet is first-letter hints, not master or cutouts', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/advanced`);

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(
			page.getByText(/type it with first-letter hints\. same advanced as the app/i)
		).toBeVisible();
		const hints = page.locator('[data-hint-line]');
		await expect(hints).toHaveAttribute('data-hint-line', NEPHI_ADVANCED);
		await expect(hints).toHaveAttribute('aria-label', NEPHI_ADVANCED);
		await expect(hints).toHaveText(/A___ f___ t___ m__ m____ b__ a__/);
		await expect(hints).toHaveText(/m__ a___ t___ t___ m____ h___ j___/);
		await expect(page.getByText(/write the verse from memory/i)).toHaveCount(0);
		await expect(page.getByText(/write-it-down/i)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that/)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
		await expect(page.getByRole('list', { name: /phrase tiles/i })).toHaveCount(0);
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
	});

	test('long verse beginner sheet is compact 2-column mixed tiles', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/beginner`);
		expect(response?.status()).toBe(200);

		await expect(page.getByRole('heading', { name: /Exodus 20:3/i })).toBeVisible();

		const tileList = page.getByRole('list', { name: /beginner phrase tiles/i });
		await expect(tileList).toHaveAttribute('data-tile-grid', '2');
		const tiles = tileList.getByRole('listitem');
		await expect(tiles).toHaveCount(38);
		const phrases = (await tiles.allTextContents()).map((text) => text.trim());
		expect(phrases[0]).not.toBe('Thou shalt have no other gods before me.');
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
			expect(phrase.split(/\s+/).length).toBeGreaterThan(1);
		}
		await expect(
			page.getByText(/Thou shalt have no other gods before me\. Thou shalt not make/i)
		).toHaveCount(0);
	});

	test('long verse intermediate sheet stays 2-column and mixed', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/intermediate`);
		expect(response?.status()).toBe(200);

		const tileList = page.getByRole('list', { name: /intermediate phrase tiles/i });
		await expect(tileList).toHaveAttribute('data-tile-grid', '2');
		const tiles = tileList.getByRole('listitem');
		await expect(tiles).toHaveCount(50);
		const phrases = (await tiles.allTextContents()).map((text) => text.trim());
		expect(phrases[0]).not.toBe('Thou shalt have no other gods');
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(
			page.getByText(/Thou shalt have no other gods before me\. Thou shalt not make/i)
		).toHaveCount(0);
	});

	test('long verse Advanced sheet is first-letter glyphs only', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/advanced`);
		expect(response?.status()).toBe(200);

		await expect(page.getByRole('heading', { name: /Exodus 20:3/i })).toBeVisible();
		await expect(
			page.getByText(/type it with first-letter hints\. same advanced as the app/i)
		).toBeVisible();

		const hints = page.locator('[data-hint-line]');
		const hintLine = await hints.getAttribute('data-hint-line');
		expect(hintLine).toBeTruthy();
		expect(hintLine?.startsWith(LONG_ADVANCED_PREFIX)).toBe(true);
		expect(hintLine?.split(/\s+/).filter(Boolean)).toHaveLength(297);
		expect(hintLine).toMatch(/T___/);
		expect(hintLine).toMatch(/_/);
		expect(hintLine).not.toMatch(/Thou shalt have/);
		await expect(hints).toHaveAttribute('aria-label', hintLine as string);

		await expect(page.getByText(/write the verse from memory/i)).toHaveCount(0);
		await expect(page.getByText(/write-it-down/i)).toHaveCount(0);
		await expect(page.getByText(/Thou shalt have no other gods before me/i)).toHaveCount(0);
		await expect(page.getByRole('list', { name: /phrase tiles/i })).toHaveCount(0);
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
	});

	test('proof PDFs stay downloadable for 2 Nephi 2:25 only', async ({ request }) => {
		for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
			const res = await request.get(`/printouts/${DEFAULT_SLUG}-${level}.pdf`);
			expect(res.status(), `${level} pdf`).toBe(200);
			expect(res.headers()['content-type']).toMatch(/pdf/);
			const body = await res.body();
			expect(body.subarray(0, 5).toString()).toBe('%PDF-');
		}

		const missing = await request.get(`/printouts/${LONG_SLUG}-beginner.pdf`);
		expect(missing.status()).toBe(404);
	});
});
