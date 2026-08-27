/**
 * Scripture Builder teacher printouts — proof slice (2 Nephi 2:25).
 */

import { test, expect } from '@playwright/test';

test.describe('/teachers/printouts', () => {
	test('picker offers 2 Nephi 2:25 and three downloadable levels', async ({ page }) => {
		const response = await page.goto('/teachers/printouts');
		expect(response?.status()).toBe(200);

		await expect(
			page.getByRole('heading', { level: 1, name: /scripture builder printouts/i })
		).toBeVisible();

		const verse = page.locator('#printout-verse');
		await expect(verse).toBeVisible();
		await expect(verse).toHaveValue('2-nephi-2-25');
		await expect(verse.getByRole('option', { name: /2 Nephi 2:25/i })).toHaveCount(1);

		await expect(page.getByText(/Adam fell that men might be/i).first()).toBeVisible();

		await expect(page.getByRole('heading', { name: /^Beginner$/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /^Intermediate$/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /^Advanced$/i })).toBeVisible();

		const beginnerPrint = page.getByRole('link', { name: /print tiles/i }).first();
		await expect(beginnerPrint).toHaveAttribute(
			'href',
			'/teachers/printouts/2-nephi-2-25/beginner'
		);
		await expect(page.getByRole('link', { name: /download pdf/i }).first()).toHaveAttribute(
			'href',
			'/printouts/2-nephi-2-25-beginner.pdf'
		);
	});

	test('beginner sheet uses app 3-word chunks, several tiles, not one per page', async ({
		page
	}) => {
		await page.goto('/teachers/printouts/2-nephi-2-25/beginner');

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/cut-out tiles/i)).toBeVisible();

		const tiles = page
			.getByRole('list', { name: /beginner phrase tiles/i })
			.getByRole('listitem');
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
		await page.goto('/teachers/printouts/2-nephi-2-25/intermediate');

		const tiles = page
			.getByRole('list', { name: /intermediate phrase tiles/i })
			.getByRole('listitem');
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
		await page.goto('/teachers/printouts/2-nephi-2-25/advanced');

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/first-letter hints/i).first()).toBeVisible();
		const hints = page.locator('[data-hint-line]');
		await expect(hints).toHaveAttribute(
			'data-hint-line',
			'A___ f___ t___ m__ m____ b__ a__ m__ a___ t___ t___ m____ h___ j___'
		);
		await expect(hints).toHaveAttribute(
			'aria-label',
			'A___ f___ t___ m__ m____ b__ a__ m__ a___ t___ t___ m____ h___ j___'
		);
		await expect(hints).toContainText('A___');
		await expect(hints).toContainText('j___');
		await expect(page.getByText(/write the verse from memory/i)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that/)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
		await expect(page.getByRole('list', { name: /phrase tiles/i })).toHaveCount(0);
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
	});

	test('PDFs are downloadable', async ({ request }) => {
		for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
			const res = await request.get(`/printouts/2-nephi-2-25-${level}.pdf`);
			expect(res.status(), `${level} pdf`).toBe(200);
			expect(res.headers()['content-type']).toMatch(/pdf/);
			const body = await res.body();
			expect(body.subarray(0, 5).toString()).toBe('%PDF-');
		}
	});
});
