/**
 * Promo-strip tags on store links, news posts, and the studio credit.
 */

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { STUDIO_CREDIT } from '../src/lib/config/site';
import { ANDROID_URL, IOS_URL } from '../src/lib/config/store';
import { STORE_CAMPAIGN, withPromo } from '../src/lib/utils/promo';

const NEWS_POSTS = [
	'src/content/news/1-0-8-ios-and-android.svx',
	'src/content/news/flashcards-for-key-phrases.svx',
	'src/content/news/class-play-steadier-on-iphone-1-0-11.svx',
	'src/content/news/class-play-warmup-not-homework.svx'
];

function storeLink(store: 'ios' | 'android', medium: string) {
	return withPromo({
		href: store === 'ios' ? IOS_URL : ANDROID_URL,
		medium,
		campaign: STORE_CAMPAIGN,
		content: store,
		store
	});
}

test.describe('withPromo', () => {
	test('google play hides the tags inside referrer', () => {
		const href = storeLink('android', 'hero');
		const url = new URL(href);

		expect(url.searchParams.get('id')).toBe('com.seminarysidekick.app');
		expect(url.searchParams.get('referrer')).toBe(
			'utm_source=sidekick&utm_medium=hero&utm_campaign=get-the-app&utm_content=android'
		);
		expect(url.searchParams.get('utm_source')).toBeNull();
		expect(href).toContain(
			'referrer=utm_source%3Dsidekick%26utm_medium%3Dhero%26utm_campaign%3Dget-the-app%26utm_content%3Dandroid'
		);
	});

	test('app store keeps utm tags and a placement campaign token', () => {
		const href = storeLink('ios', 'hero');

		expect(href).toBe(
			'https://apps.apple.com/us/app/seminary-sidekick/id6780003239?utm_source=sidekick&utm_medium=hero&utm_campaign=get-the-app&utm_content=ios&ct=hero'
		);
		expect(new URL(href).searchParams.get('pt')).toBeNull();
	});

	test('studio credit is the ecosystem footer link', () => {
		expect(STUDIO_CREDIT.href).toBe(
			'https://narrowroadstudios.com?utm_source=sidekick&utm_medium=footer&utm_campaign=ecosystem'
		);
	});

	test('news posts use the news placement', () => {
		const ios = storeLink('ios', 'news');
		const android = storeLink('android', 'news');

		for (const file of NEWS_POSTS) {
			const text = readFileSync(file, 'utf8');
			expect(text, file).toContain(`](${ios})`);
			expect(text, file).toContain(`](${android})`);
			expect(text, file).not.toContain(`](${IOS_URL})`);
			expect(text, file).not.toContain(`](${ANDROID_URL})`);
		}
	});
});

test('homepage hero and footer store links carry their placement', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator(`a[href="${storeLink('ios', 'hero')}"]`)).toBeVisible();
	await expect(page.locator(`footer a[href="${storeLink('android', 'footer')}"]`)).toBeVisible();
	await expect(
		page.locator('footer').getByRole('link', { name: 'Made by Narrow Road Studios' })
	).toHaveAttribute('href', STUDIO_CREDIT.href);
});
