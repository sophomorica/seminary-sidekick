/**
 * Scripture Builder showcase — study → build → prove → master.
 *
 * Pins the How it works animation so a copy or layout edit cannot
 * silently drop the play-through. Phase jumps use data-jump so
 * autoplay cannot race the assertion.
 */

import { test, expect } from '@playwright/test';

async function openShowcase(page: import('@playwright/test').Page) {
	await page.goto('/?sb=pause#how-it-works');
	const stage = page.locator('#scripture-builder-showcase');
	await expect(stage).toBeVisible();
	await page.waitForFunction(
		() => (window as Window & { __sbReady?: boolean }).__sbReady === true
	);
	return stage;
}

test.describe('Scripture Builder showcase — homepage', () => {
	test('how-it-works stage renders with the four phases', async ({ page }) => {
		const stage = await openShowcase(page);

		await expect(
			page.getByRole('heading', { name: /study, build, prove, master/i })
		).toBeVisible();
		await expect(stage.locator('[data-jump="study"]')).toBeVisible();
		await expect(stage.locator('[data-jump="build"]')).toBeVisible();
		await expect(stage.locator('[data-jump="prove"]')).toBeVisible();
		await expect(stage.locator('[data-jump="master"]')).toBeVisible();
		await expect(page.getByText(/2 Nephi 2:25/i).first()).toBeVisible();
	});

	test('jumping to Build shows chunk tiles', async ({ page }) => {
		const stage = await openShowcase(page);
		await page.locator('#sb-jump-build').click();
		await expect(stage).toHaveAttribute('data-phase', 'build');
		await expect(stage.getByText(/tap the next chunk/i)).toBeVisible();
		await expect(stage.getByText(/adam fell that/i).first()).toBeVisible();
	});

	test('jumping to Prove shows first-letter hints', async ({ page }) => {
		const stage = await openShowcase(page);
		await page.locator('#sb-jump-prove').click();
		await expect(stage).toHaveAttribute('data-phase', 'prove');
		await expect(stage.getByText(/first-letter hints/i).first()).toBeVisible();
	});

	test('jumping to Master shows the mastered verse', async ({ page }) => {
		const stage = await openShowcase(page);
		await page.locator('#sb-jump-master').click();
		await expect(stage).toHaveAttribute('data-phase', 'master');
		await expect(stage.getByText(/mastered/i).first()).toBeVisible();
		await expect(stage.getByText(/they might have joy/i)).toBeVisible();
	});

	test('pause and replay controls are available', async ({ page }) => {
		const stage = await openShowcase(page);
		await expect(stage.getByRole('button', { name: 'Replay animation' })).toBeVisible();
		await expect(stage.getByRole('button', { name: /^(Play|Pause) animation$/ })).toBeVisible();
	});
});

test.describe('Scripture Builder showcase — product page', () => {
	test('scripture-mastery hosts the same showcase', async ({ page }) => {
		await page.goto('/apps/scripture-mastery#see-scripture-builder');
		const stage = page.locator('#scripture-builder-showcase');
		await expect(stage).toBeVisible();
		await expect(
			page.getByRole('heading', { name: /study it\. build it\. prove it\. master it/i })
		).toBeVisible();
	});
});
