/**
 * In-house promo strip — footer band on public marketing pages.
 *
 * Speed Read leads, then Old Fashioned Prints. Links keep utm_source=sidekick.
 * Class Play (`/join`) and lesson pages (`/teachers`) stay clear of it.
 */

import { expect, test } from '@playwright/test';

const speedRead =
	'https://www.narrowroadstudios.com/go/speed-read?utm_source=sidekick&utm_medium=promo-strip&utm_campaign=ecosystem-strip&utm_content=speed-read';
const ofp =
	'https://www.oldfashionedprints.com/?utm_source=sidekick&utm_medium=promo-strip&utm_campaign=ecosystem-strip&utm_content=ofp';
const books =
	'https://narrowroadbooks.com/?utm_source=sidekick&utm_medium=promo-strip&utm_campaign=ecosystem-strip&utm_content=books';
const youtube = 'https://www.youtube.com/@narrowroadstudios';

test('promo strip links carry sidekick UTMs, with Speed Read before OFP', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/');

	const strip = page.locator('[data-promo-strip]');
	await expect(strip).toBeVisible();
	await expect(strip.locator('[data-promo-item]').first()).toHaveAttribute(
		'data-promo-item',
		'speed-read'
	);
	await expect(strip.locator('[data-promo-item="speed-read"] a')).toHaveAttribute(
		'href',
		speedRead
	);
	await expect(strip.locator('[data-promo-item="ofp"] a')).toHaveAttribute('href', ofp);
	await expect(strip.locator('[data-promo-item="books"] a')).toHaveAttribute('href', books);
	await expect(strip.locator('[data-promo-item="youtube"] a')).toHaveAttribute('href', youtube);
	await expect(strip.locator('[data-promo-item="speed-read"]')).toContainText(
		'Read 70,000+ free classics one word at a time. Goji Speed Read, free on iPhone and iPad.'
	);
	await expect(strip.locator('[data-promo-item="speed-read"] a')).toHaveText('→ App Store');
	await expect(strip.locator('[data-promo-item="ofp"]')).toContainText(
		'One installment of a classic serial in your inbox each morning, free and ready to print.'
	);
	await expect(strip.locator('[data-promo-item="ofp"] a')).toHaveText("→ Get tomorrow's page");
	await expect(strip.locator('[data-promo-short]')).toBeHidden();
	await expect(strip).not.toContainText(/coffee|espresso|latte|caf[eé]/i);

	const aboveFooter = await page.evaluate(() => {
		const band = document.querySelector('[data-promo-strip]');
		const footer = document.querySelector('footer[aria-label="Site footer"]');
		if (!band || !footer) return false;
		return Boolean(band.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING);
	});
	expect(aboveFooter).toBe(true);

	await page.goto('/for-teachers');
	await expect(page.locator('[data-promo-item="speed-read"] a')).toHaveAttribute(
		'href',
		speedRead
	);
	await expect(page.locator('[data-promo-item="ofp"] a')).toHaveAttribute('href', ofp);

	for (const route of [
		'/join',
		'/teachers',
		'/teachers/printouts',
		'/teachers/grabbers/name-tents'
	]) {
		await page.goto(route);
		await expect(page.locator('[data-promo-strip]'), route).toHaveCount(0);
	}

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await expect(page.locator('[data-promo-short]')).toBeVisible();
	await expect(page.locator('[data-promo-short]')).toHaveAttribute('href', ofp);
	await expect(page.locator('[data-promo-short]')).toHaveText(
		'Free classic serial each morning → Old Fashioned Prints'
	);
	await expect(page.locator('[data-promo-item="speed-read"]')).toBeHidden();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
		390
	);
});
