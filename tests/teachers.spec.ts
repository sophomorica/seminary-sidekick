/**
 * Teacher library index — honest catalog. What exists is linked.
 * Lesson plans and testimonials stay "coming" with no fake cards.
 */

import { test, expect } from '@playwright/test';

test.describe('/teachers', () => {
	test('renders the catalog and links what exists this week', async ({ page }) => {
		const response = await page.goto('/teachers');
		expect(response?.status()).toBe(200);

		await expect(
			page.getByRole('heading', { level: 1, name: /a library that lasts/i })
		).toBeVisible();

		await expect(
			page.getByRole('heading', { name: /advice \/ class play help/i })
		).toBeVisible();
		const warmup = page.getByRole('link', { name: /five minutes before the quiz/i });
		await expect(warmup).toBeVisible();
		await expect(warmup).toHaveAttribute('href', '/news/class-play-five-minute-warmup');

		await expect(
			page.getByRole('heading', { name: /doctrinal mastery teaching tips/i })
		).toBeVisible();
		const builder = page.getByRole('link', { name: /build it once\. then type it cold/i });
		await expect(builder).toBeVisible();
		await expect(builder).toHaveAttribute('href', '/news/build-it-then-type-it-cold');

		await expect(page.getByRole('heading', { name: /^tools$/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /how to save a class/i })).toHaveAttribute(
			'href',
			'/for-teachers#saved-class'
		);
		await expect(
			page.getByRole('main').getByRole('link', { name: /how it works/i })
		).toHaveAttribute('href', '/#how-it-works');
	});

	test('does not invent lesson plans or testimonials', async ({ page }) => {
		await page.goto('/teachers');

		await expect(page.getByRole('heading', { name: /lesson plans/i })).toBeVisible();
		await expect(page.getByText(/we will not invent these/i)).toBeVisible();

		await expect(page.getByRole('heading', { name: /testimonials/i })).toBeVisible();
		await expect(page.getByText(/no placeholder quotes/i)).toBeVisible();

		await expect(page.getByText(/as a teacher, this changed everything/i)).toHaveCount(0);
		await expect(page.getByText(/sample lesson/i)).toHaveCount(0);
	});
});

test.describe('Homepage teacher-library tease', () => {
	test('points the resource library to /teachers', async ({ page }) => {
		await page.goto('/');

		const library = page.getByRole('link', { name: /teacher library/i }).first();
		await expect(library).toBeVisible();
		await expect(library).toHaveAttribute('href', '/teachers');
	});
});
