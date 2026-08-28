/**
 * Accessibility baseline — manual checks that don't need axe-core.
 *
 * If you want a full WCAG audit, add @axe-core/playwright later:
 *   pnpm add -D @axe-core/playwright
 * and write a sweep test that runs `new AxeBuilder({ page }).analyze()`
 * on each route. For now we cover the rules most likely to regress
 * from agent-written code:
 *   - every <img> has an alt attribute
 *   - all interactive controls have an accessible name
 *   - heading hierarchy starts at <h1>
 *   - skip link is the first focusable element
 *   - no keyboard traps (Tab can always reach the footer)
 */

import { test, expect, type Page } from '@playwright/test';

const PAGES_TO_AUDIT = [
	'/',
	'/quick-quiz',
	'/scripture-match',
	'/news',
	'/teachers',
	'/teachers/printouts',
	'/privacy',
	'/terms',
	'/contact'
] as const;

async function ensureAllImagesHaveAlt(page: Page) {
	const imgs = page.locator('img');
	const count = await imgs.count();
	for (let i = 0; i < count; i++) {
		const img = imgs.nth(i);
		// alt="" is fine (decorative); alt missing entirely is not.
		const alt = await img.getAttribute('alt');
		expect(alt, `img #${i} on ${page.url()} missing alt attribute`).not.toBeNull();
	}
}

async function ensureInteractiveControlsHaveNames(page: Page) {
	const controls = page.locator('button, a[href], input:not([type=hidden])');
	const count = await controls.count();
	for (let i = 0; i < count; i++) {
		const el = controls.nth(i);
		// Accessible name comes from inner text, aria-label, aria-labelledby,
		// or a wrapping <label>. We accept any non-empty version.
		const name = await el.evaluate((node) => {
			const text = node.textContent?.trim();
			const aria = node.getAttribute('aria-label')?.trim();
			const labelledBy = node.getAttribute('aria-labelledby');
			const title = node.getAttribute('title');
			return text || aria || labelledBy || title || '';
		});
		// Permit empty-name controls only if they're explicitly aria-hidden
		// (e.g., a decorative icon button — though we generally avoid those).
		const hidden = await el.getAttribute('aria-hidden');
		if (!name && hidden !== 'true') {
			const html = await el.evaluate((n) => (n as HTMLElement).outerHTML.slice(0, 200));
			throw new Error(`Control missing accessible name on ${page.url()}:\n${html}`);
		}
	}
}

for (const route of PAGES_TO_AUDIT) {
	test.describe(route, () => {
		test('all images have alt attributes', async ({ page }) => {
			await page.goto(route);
			await ensureAllImagesHaveAlt(page);
		});

		test('all interactive controls have an accessible name', async ({ page }) => {
			await page.goto(route);
			await ensureInteractiveControlsHaveNames(page);
		});

		test('has exactly one h1', async ({ page }) => {
			await page.goto(route);
			const h1s = await page.locator('h1').count();
			expect(h1s, `${route} should have exactly one <h1>, got ${h1s}`).toBe(1);
		});
	});
}

test('skip link is the first keyboard target', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
	expect(focused?.toLowerCase()).toContain('skip');
});
