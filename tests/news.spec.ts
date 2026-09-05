/**
 * What’s new — live posts so the homepage strip and /news are not empty.
 *
 * Role-based selectors. Copy can tighten; slugs and titles are the contract.
 * Homepage What’s new only surfaces the 3 newest; /news and RSS list every post.
 */

import { test, expect } from '@playwright/test';

const POSTS = [
	{
		slug: 'i-used-to-cut-these-by-hand',
		title: 'I used to cut these by hand'
	},
	{
		slug: 'dont-stop-at-the-tiles',
		title: 'Don’t stop at the tiles'
	},
	{
		slug: 'mixed-tiles-for-the-board',
		title: 'Mixed tiles for the board'
	},
	{
		slug: 'one-verse-a-day-beats-cramming',
		title: 'One verse a day beats cramming'
	},
	{
		slug: 'class-play-warmup-not-homework',
		title: 'A warmup, not extra homework'
	},
	{
		slug: 'class-play-five-minute-warmup',
		title: 'Five minutes before the quiz'
	},
	{
		slug: 'build-it-then-type-it-cold',
		title: 'Build it once. Then type it cold.'
	},
	{
		slug: '1-0-8-ios-and-android',
		title: '1.0.8 is live on iPhone and Android'
	}
] as const;

test.describe("What's new", () => {
	test('homepage lists the latest posts and not the empty stub', async ({ page }) => {
		await page.goto('/');

		const section = page.locator('#news-preview');
		await expect(section).toBeVisible();
		await expect(section.getByRole('heading', { name: /nothing published yet/i })).toHaveCount(
			0
		);

		const latest = POSTS[0];
		const card = section.getByRole('link', { name: latest.title });
		await expect(card).toBeVisible();
		await expect(card).toHaveAttribute('href', `/news/${latest.slug}`);
	});

	test('/news lists every live post', async ({ page }) => {
		await page.goto('/news');

		await expect(page.getByRole('heading', { name: /nothing published yet/i })).toHaveCount(0);

		for (const post of POSTS) {
			const card = page.getByRole('link', { name: post.title });
			await expect(card).toBeVisible();
			await expect(card).toHaveAttribute('href', `/news/${post.slug}`);
		}
	});

	for (const post of POSTS) {
		test(`/news/${post.slug} renders the post`, async ({ page }) => {
			const response = await page.goto(`/news/${post.slug}`);
			expect(response?.status()).toBe(200);
			await expect(page.getByRole('heading', { level: 1, name: post.title })).toBeVisible();
			await expect(page.getByRole('link', { name: /back to news/i }).first()).toBeVisible();
		});
	}

	test('printouts post uses a Button CTA, not a raw URL', async ({ page }) => {
		await page.goto('/news/i-used-to-cut-these-by-hand');

		const cta = page.getByRole('link', { name: 'Open Scripture Builder printouts' });
		await expect(cta).toBeVisible();
		await expect(cta).toHaveAttribute('href', '/teachers/printouts');
		await expect(
			page.getByRole('link', { name: /seminarysidekick\.com\/teachers\/printouts/ })
		).toHaveCount(0);
	});

	test('RSS includes the live slugs', async ({ request }) => {
		const res = await request.get('/news/rss.xml');
		expect(res.status()).toBe(200);
		const body = await res.text();
		for (const post of POSTS) {
			expect(body).toContain(`/news/${post.slug}`);
			expect(body).toContain(post.title);
		}
	});
});
