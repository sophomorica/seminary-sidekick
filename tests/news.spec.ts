/**
 * What’s new — live posts so the homepage strip and /news are not empty.
 *
 * Role-based selectors. Copy can tighten; slugs and titles are the contract.
 * Homepage What’s new only surfaces the 3 newest; /news and RSS list every post.
 */

import { test, expect } from '@playwright/test';

const POSTS = [
	{
		slug: 'class-play-steadier-on-iphone-1-0-11',
		title: 'Class Play is steadier on iPhone in 1.0.11'
	},
	{
		slug: 'two-quiet-minutes-of-flips',
		title: 'Two quiet minutes of flips'
	},
	{
		slug: 'flashcards-for-key-phrases',
		title: 'Flashcards for doctrinal mastery key phrases'
	},
	{
		slug: 'say-the-key-phrase-cold',
		title: 'Say the key phrase cold.'
	},
	{
		slug: 'digital-convenient-analog-helps-you-map',
		title: 'Digital is convenient. Analog helps you map.'
	},
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

	test('1.0.11 post names App Store 1.0.11 and Android 1.0.10', async ({ page }) => {
		await page.goto('/news/class-play-steadier-on-iphone-1-0-11');

		await expect(page.getByText('1.0.11 is live on the App Store')).toBeVisible();
		await expect(
			page.getByText(/Android is still on 1\.0\.10 until Play catches up/)
		).toBeVisible();
		await expect(page.getByText(/Coming to Android/i)).toHaveCount(0);
		await expect(page.getByText(/Play with Friends/i)).toHaveCount(0);
	});

	test('analog-mapping post links printouts as one markdown bridge', async ({ page }) => {
		await page.goto('/news/digital-convenient-analog-helps-you-map');

		const bridge = page.getByRole('link', { name: 'Scripture Builder printouts' });
		await expect(bridge).toBeVisible();
		await expect(bridge).toHaveAttribute('href', '/teachers/printouts');
	});

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

/**
 * Supabase-backed posts. The dev server reads from tests/mocks/supabase-posts.mjs,
 * which returns every row regardless of status, so these prove the site's own
 * filter hides drafts and anything scheduled or published in the future.
 */
const REMOTE_LIVE = { slug: 'posted-from-supabase', title: 'Posted from Supabase' };

const REMOTE_HIDDEN = [
	{ slug: 'supabase-draft-post', title: 'Supabase draft post' },
	{ slug: 'supabase-scheduled-future-post', title: 'Supabase scheduled future post' },
	{ slug: 'supabase-future-published-post', title: 'Supabase future published post' }
] as const;

test.describe('Supabase posts', () => {
	test('a live row is listed alongside the .svx posts', async ({ page }) => {
		await page.goto('/news');

		const card = page.getByRole('link', { name: REMOTE_LIVE.title });
		await expect(card).toBeVisible();
		await expect(card).toHaveAttribute('href', `/news/${REMOTE_LIVE.slug}`);

		// The .svx posts are still there.
		await expect(page.getByRole('link', { name: POSTS[0].title })).toBeVisible();
	});

	test('the newest live row reaches the homepage strip', async ({ page }) => {
		await page.goto('/');
		const section = page.locator('#news-preview');
		await expect(section.getByRole('link', { name: REMOTE_LIVE.title })).toBeVisible();
	});

	test('a live row renders its markdown body and hero image', async ({ page }) => {
		const response = await page.goto(`/news/${REMOTE_LIVE.slug}`);
		expect(response?.status()).toBe(200);

		await expect(
			page.getByRole('heading', { level: 1, name: REMOTE_LIVE.title })
		).toBeVisible();
		await expect(
			page
				.locator('.post-body')
				.getByRole('heading', { level: 2, name: 'A heading from markdown' })
		).toBeVisible();
		await expect(
			page.locator('.post-body').getByRole('link', { name: 'Scripture Builder printouts' })
		).toHaveAttribute('href', '/teachers/printouts');

		const hero = page.locator('.post-body img');
		await expect(hero).toHaveAttribute('src', '/images/news/news-10min-review-2026-10-27.jpg');
		await expect(hero).toHaveAttribute('alt', 'Mock hero image');
	});

	test('drafts and future posts are not shown anywhere', async ({ page, request }) => {
		await page.goto('/news');
		await expect(page.getByRole('link', { name: REMOTE_LIVE.title })).toBeVisible();
		for (const post of REMOTE_HIDDEN) {
			await expect(page.getByRole('link', { name: post.title })).toHaveCount(0);
		}

		await page.goto('/');
		for (const post of REMOTE_HIDDEN) {
			await expect(page.getByRole('link', { name: post.title })).toHaveCount(0);
		}

		const rss = await (await request.get('/news/rss.xml')).text();
		const sitemap = await (await request.get('/sitemap.xml')).text();
		for (const post of REMOTE_HIDDEN) {
			expect(rss).not.toContain(post.slug);
			expect(sitemap).not.toContain(post.slug);
		}

		for (const post of REMOTE_HIDDEN) {
			const res = await page.goto(`/news/${post.slug}`);
			expect(res?.status(), post.slug).toBe(404);
		}
	});

	test('a .svx post wins over a row with the same slug', async ({ page }) => {
		await page.goto('/news/two-quiet-minutes-of-flips');
		await expect(
			page.getByRole('heading', { level: 1, name: 'Two quiet minutes of flips' })
		).toBeVisible();
		await expect(page.getByText('Shadow title from Supabase')).toHaveCount(0);

		await page.goto('/news');
		await expect(page.getByRole('link', { name: 'Shadow title from Supabase' })).toHaveCount(0);
	});

	test('RSS and sitemap include the live row', async ({ request }) => {
		const rss = await (await request.get('/news/rss.xml')).text();
		expect(rss).toContain(`/news/${REMOTE_LIVE.slug}`);
		expect(rss).toContain(REMOTE_LIVE.title);

		const sitemap = await (await request.get('/sitemap.xml')).text();
		expect(sitemap).toContain(`/news/${REMOTE_LIVE.slug}</loc>`);
	});
});
