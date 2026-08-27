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

		const verse = page.getByLabel('Scripture');
		await expect(verse).toBeVisible();
		await expect(verse).toHaveValue('2-nephi-2-25');
		await expect(page.getByRole('option', { name: /2 Nephi 2:25/i })).toHaveCount(1);

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
		await expect(page.getByText('Adam fell that')).toBeVisible();
		await expect(page.getByText('men might be;')).toBeVisible();
		await expect(page.getByText('and men are,')).toBeVisible();
		await expect(page.getByText('that they might')).toBeVisible();
		await expect(page.getByText('have joy.')).toBeVisible();

		const tiles = page
			.getByRole('list', { name: /beginner phrase tiles/i })
			.getByRole('listitem');
		await expect(tiles).toHaveCount(5);
	});

	test('intermediate sheet uses app 2-word chunks', async ({ page }) => {
		await page.goto('/teachers/printouts/2-nephi-2-25/intermediate');

		await expect(page.getByText('Adam fell')).toBeVisible();
		await expect(page.getByText('that men')).toBeVisible();
		await expect(page.getByText('might be;')).toBeVisible();
		await expect(page.getByText('and men')).toBeVisible();
		await expect(page.getByText('are, that')).toBeVisible();
		await expect(page.getByText('they might')).toBeVisible();
		await expect(page.getByText('have joy.')).toBeVisible();

		const tiles = page
			.getByRole('list', { name: /intermediate phrase tiles/i })
			.getByRole('listitem');
		await expect(tiles).toHaveCount(7);
	});

	test('advanced sheet is a write-it-down page, not the same cutouts', async ({ page }) => {
		await page.goto('/teachers/printouts/2-nephi-2-25/advanced');

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/write the verse from memory/i)).toBeVisible();
		await expect(page.getByText(/Adam fell that/)).toHaveCount(0);
		await expect(page.getByRole('link', { name: /print \/ save as pdf/i })).toBeVisible();
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
