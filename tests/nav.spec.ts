/**
 * Navigation tests — every link in AppNav and AppFooter resolves
 * to a real page. Catches: stale routes in `nav.ts`, broken hrefs,
 * 404s in the footer.
 *
 * Also covers the skip link and the mobile menu.
 */

import { test, expect } from '@playwright/test';

test.describe('Skip link', () => {
	test('first Tab focus reveals it and Enter jumps to main', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');

		const skipLink = page.getByRole('link', { name: /skip to main content/i });
		await expect(skipLink).toBeFocused();

		await skipLink.press('Enter');
		// SvelteKit honors the hash; URL gets #main-content.
		await expect(page).toHaveURL(/#main-content$/);
	});
});

test.describe('AppNav', () => {
	test('logo links back to home from any page', async ({ page }) => {
		await page.goto('/privacy');
		await page
			.getByRole('link', { name: /seminary sidekick.*home/i })
			.first()
			.click();
		await expect(page).toHaveURL('/');
	});

	test('Premium link goes to /premium', async ({ page }) => {
		await page.goto('/');
		await page.locator('header').getByRole('link', { name: 'Premium', exact: true }).click();
		await expect(page).toHaveURL('/premium');
	});

	test('For teachers link goes to /for-teachers', async ({ page }) => {
		await page.goto('/');
		await page
			.locator('header')
			.getByRole('link', { name: 'For teachers', exact: true })
			.click();
		await expect(page).toHaveURL('/for-teachers');
	});

	test('News link goes to /news', async ({ page }) => {
		await page.goto('/');
		await page.locator('header').getByRole('link', { name: 'News', exact: true }).click();
		await expect(page).toHaveURL('/news');
	});

	test('How it works link routes to homepage with #how-it-works anchor', async ({ page }) => {
		await page.goto('/about');
		await page
			.locator('header')
			.getByRole('link', { name: 'How it works', exact: true })
			.click();
		await expect(page).toHaveURL(/\/#how-it-works$/);
		// NOTE: the #how-it-works anchor element is created when TASK-C-100
		// composes the HowItWorks section into the homepage. Until then,
		// the URL updates but no scroll target exists. This test only
		// verifies the link wiring is correct; the anchor element check
		// lives in `tests/composition.spec.ts` (added in Phase C).
	});
});

test.describe('AppFooter', () => {
	test('every footer link returns 200 (or anchor)', async ({ page, request }) => {
		await page.goto('/');

		// Pull every internal href the footer renders.
		const hrefs = await page
			.locator('footer a[href]')
			.evaluateAll((els) =>
				els
					.map((el) => el.getAttribute('href')!)
					.filter((h) => h && !h.startsWith('mailto:') && !h.startsWith('http'))
			);

		const unique = [...new Set(hrefs)];
		expect(unique.length).toBeGreaterThan(5);

		for (const href of unique) {
			// Strip in-page anchors before HEAD-checking; only test the route.
			const route = href.split('#')[0] || '/';
			const res = await request.get(route);
			expect.soft(res.status(), `footer link ${href} -> ${route}`).toBe(200);
		}
	});

	test('contact mailto link uses CONTACT_EMAIL from config', async ({ page }) => {
		await page.goto('/contact');
		const mail = page.locator('a[href^="mailto:"]').first();
		await expect(mail).toBeVisible();
		const href = await mail.getAttribute('href');
		expect(href).toMatch(/^mailto:.+@.+\..+/);
	});
});

test.describe('Mobile menu', () => {
	test.use({ viewport: { width: 375, height: 800 } });

	test('hamburger opens, link click closes, Escape closes', async ({ page }) => {
		// Wait for hydration before clicking — the toggle handler is only attached
		// after Svelte hydrates, so a click sent against the SSR'd HTML is a no-op.
		await page.goto('/', { waitUntil: 'networkidle' });

		// Open via hamburger button (aria-label "Open menu").
		const trigger = page.getByRole('button', { name: /open menu/i });
		await expect(trigger).toBeVisible();
		await trigger.click();

		// Mobile menu panel becomes visible.
		const mobilePanel = page.locator('#mobile-menu');
		await expect(mobilePanel).toBeVisible();
		await expect(page.getByRole('button', { name: /close menu/i })).toBeVisible();

		// Press Escape -> closes.
		await page.keyboard.press('Escape');
		await expect(mobilePanel).toBeHidden();

		// Reopen, then click a link -> closes.
		await page.getByRole('button', { name: /open menu/i }).click();
		await expect(mobilePanel).toBeVisible();
		await mobilePanel.getByRole('link', { name: 'Premium', exact: true }).click();
		await expect(page).toHaveURL('/premium');
		await expect(mobilePanel).toBeHidden();
	});
});
