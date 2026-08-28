/**
 * Teacher morning mixer — honest and usable.
 * Printouts stay listed. Grabbers have real run/print paths.
 * No coming-soon-only shell. No fake testimonials.
 */

import { test, expect } from '@playwright/test';

const GRABBER_ROUTES = [
	'/teachers/grabbers/name-tents',
	'/teachers/grabbers/corner-compass',
	'/teachers/grabbers/partner-echo',
	'/teachers/grabbers/welcome-seat',
	'/teachers/grabbers/four-beats-pass'
] as const;

test.describe('/teachers mixer', () => {
	test('is a usable mixer, not a coming-soon catalog', async ({ page }) => {
		const response = await page.goto('/teachers');
		expect(response?.status()).toBe(200);

		await expect(page.getByRole('heading', { level: 1, name: /morning mixer/i })).toBeVisible();
		await expect(page.getByText(/four beats\. one morning/i).first()).toBeVisible();
		await expect(page.getByText(/facebook/i)).toHaveCount(0);

		await expect(page.getByRole('navigation', { name: /mixer views/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /^mix$/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /^today$/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /^this week$/i })).toBeVisible();

		await expect(page.getByRole('heading', { name: /grabbers you can run/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /name tents/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /corner compass/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /partner echo/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /welcome seat/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /four beats pass/i })).toBeVisible();

		await expect(page.getByRole('heading', { name: /lesson plans/i })).toHaveCount(0);
		await expect(page.getByRole('heading', { name: /testimonials/i })).toHaveCount(0);
		await expect(page.getByText(/we will not invent these/i)).toHaveCount(0);
		await expect(page.getByText(/as a teacher, this changed everything/i)).toHaveCount(0);
		await expect(page.getByText(/sample lesson/i)).toHaveCount(0);
	});

	test('lists Scripture Builder printouts as a grabber', async ({ page }) => {
		await page.goto('/teachers');

		await expect(
			page.getByRole('heading', { name: /scripture builder printouts/i })
		).toBeVisible();
		await expect(
			page.getByRole('main').getByRole('link', { name: /open printouts/i })
		).toHaveAttribute('href', '/teachers/printouts');
		await expect(
			page.getByRole('main').getByRole('link', { name: /^scripture builder printouts$/i })
		).toHaveAttribute('href', '/teachers/printouts');
	});

	test('Today is a first-week OT morning with an honest Teach beat', async ({ page }) => {
		await page.goto('/teachers?view=today');

		await expect(page.getByRole('heading', { name: /first morning/i })).toBeVisible();
		await expect(page.getByText(/old testament 2026/i).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /name tents/i })).toBeVisible();
		await expect(page.getByText(/teach is not ready as a factory/i)).toBeVisible();
		await expect(page.getByText(/lesson-plan factory/i).first()).toBeVisible();
		await expect(
			page.getByRole('link', { name: /open this grabber/i }).first()
		).toHaveAttribute('href', '/teachers/grabbers/name-tents');
	});

	test('This week sequences the grabbers across five mornings', async ({ page }) => {
		await page.goto('/teachers?view=week');

		await expect(page.getByRole('heading', { name: /first week/i })).toBeVisible();
		await expect(page.getByText(/monday/i).first()).toBeVisible();
		await expect(page.getByText(/friday/i).first()).toBeVisible();
		await expect(page.getByRole('link', { name: /open printouts/i })).toHaveAttribute(
			'href',
			'/teachers/printouts'
		);
		await expect(page.getByText(/teach is not ready as a factory/i).first()).toBeVisible();
	});
});

test.describe('Grabber routes', () => {
	for (const route of GRABBER_ROUTES) {
		test(`${route} returns 200 with how to run`, async ({ page }) => {
			const response = await page.goto(route);
			expect(response?.status()).toBe(200);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(page.getByRole('heading', { name: /how to run it/i })).toBeVisible();
			await expect(page.getByText(/^time$/i).first()).toBeVisible();
			await expect(page.getByText(/^materials$/i).first()).toBeVisible();
			await expect(
				page.getByRole('link', { name: /scripture builder printouts/i })
			).toHaveAttribute('href', '/teachers/printouts');
		});
	}

	test('name tents print sheet returns 200', async ({ page }) => {
		const response = await page.goto('/teachers/grabbers/name-tents/print');
		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { name: /fold on the dashed line/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
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
