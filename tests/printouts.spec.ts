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
		await expect(tiles.nth(0)).toHaveText('Adam fell that');
		await expect(tiles.nth(1)).toHaveText('men might be;');
		await expect(tiles.nth(2)).toHaveText('and men are,');
		await expect(tiles.nth(3)).toHaveText('that they might');
		await expect(tiles.nth(4)).toHaveText('have joy.');
	});

	test('intermediate sheet uses app 2-word chunks', async ({ page }) => {
		await page.goto('/teachers/printouts/2-nephi-2-25/intermediate');

		const tiles = page
			.getByRole('list', { name: /intermediate phrase tiles/i })
			.getByRole('listitem');
		await expect(tiles).toHaveCount(7);
		await expect(tiles.nth(0)).toHaveText('Adam fell');
		await expect(tiles.nth(1)).toHaveText('that men');
		await expect(tiles.nth(2)).toHaveText('might be;');
		await expect(tiles.nth(3)).toHaveText('and men');
		await expect(tiles.nth(4)).toHaveText('are, that');
		await expect(tiles.nth(5)).toHaveText('they might');
		await expect(tiles.nth(6)).toHaveText('have joy.');
	});

	test('advanced sheet is a write-it-down page, not the same cutouts', async ({ page }) => {
		await page.goto('/teachers/printouts/2-nephi-2-25/advanced');

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/write the verse from memory/i)).toBeVisible();
		await expect(page.getByText(/Adam fell that/)).toHaveCount(0);
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
