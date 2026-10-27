/**
 * /update — store redirect for the in-app update banner.
 *
 * Unit tests cover the User-Agent → platform mapping; route tests check
 * the server-side 302 (no JS) and the desktop fallback page.
 */

import { test, expect } from '@playwright/test';
import { platformForUserAgent, storeUrlForPlatform } from '../src/lib/utils/storeRedirect';
import { ANDROID_URL, IOS_URL } from '../src/lib/config/store';

const UA = {
	iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
	ipad: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
	ipod: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
	ipadosWebView:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
	android:
		'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36',
	androidTablet:
		'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
	macDesktop:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
	windows:
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
};

test.describe('platformForUserAgent', () => {
	for (const key of ['iphone', 'ipad', 'ipod', 'ipadosWebView'] as const) {
		test(`${key} → ios`, () => expect(platformForUserAgent(UA[key])).toBe('ios'));
	}
	for (const key of ['android', 'androidTablet'] as const) {
		test(`${key} → android`, () => expect(platformForUserAgent(UA[key])).toBe('android'));
	}
	for (const key of ['macDesktop', 'windows'] as const) {
		test(`${key} → other`, () => expect(platformForUserAgent(UA[key])).toBe('other'));
	}
	test('missing UA → other', () => {
		expect(platformForUserAgent(null)).toBe('other');
		expect(platformForUserAgent('')).toBe('other');
	});
	test('store URLs', () => {
		expect(storeUrlForPlatform('ios')).toBe(IOS_URL);
		expect(storeUrlForPlatform('android')).toBe(ANDROID_URL);
		expect(storeUrlForPlatform('other')).toBeNull();
	});
});

test.describe('/update route', () => {
	test('iPhone gets a 302 to the App Store', async ({ request }) => {
		const res = await request.get('/update', {
			headers: { 'user-agent': UA.iphone },
			maxRedirects: 0
		});
		expect(res.status()).toBe(302);
		expect(res.headers()['location']).toBe(IOS_URL);
	});

	test('Android gets a 302 to Google Play', async ({ request }) => {
		const res = await request.get('/update', {
			headers: { 'user-agent': UA.android },
			maxRedirects: 0
		});
		expect(res.status()).toBe(302);
		expect(res.headers()['location']).toBe(ANDROID_URL);
	});

	test('desktop sees both store links', async ({ page }) => {
		const res = await page.goto('/update');
		expect(res?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/latest/i);
		await expect(page.locator(`main a[href="${IOS_URL}"]`)).toBeVisible();
		await expect(page.locator(`main a[href="${ANDROID_URL}"]`)).toBeVisible();
	});
});
