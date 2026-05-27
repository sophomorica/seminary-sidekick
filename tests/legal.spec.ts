/**
 * Legal pages — Privacy + Terms render their key sections.
 *
 * Catches regressions where the page renders but loses important
 * content (a missing <h2>, a broken include, a copy-edit that removes
 * a required section header).
 */

import { test, expect } from '@playwright/test';

test.describe('Privacy Policy', () => {
	test('renders the required sections', async ({ page }) => {
		await page.goto('/privacy');
		await expect(page.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeVisible();

		// Required H2s for a real privacy policy. If any of these vanish
		// from the page during a refactor, this test fails fast.
		const requiredH2s = [
			/information we collect/i,
			/analytics/i,
			/premium subscriptions/i,
			/children/i
		];
		for (const pattern of requiredH2s) {
			await expect(page.getByRole('heading', { level: 2, name: pattern })).toBeVisible();
		}

		// Has a meaningful "Effective" or "Updated" date line.
		await expect(page.getByText(/effective|updated/i).first()).toBeVisible();
	});
});

test.describe('Terms of Use', () => {
	test('renders the required sections', async ({ page }) => {
		await page.goto('/terms');
		await expect(page.getByRole('heading', { level: 1, name: /terms of use/i })).toBeVisible();

		const requiredH2s = [
			/acceptance/i,
			/eligibility/i,
			/subscriptions/i,
			/intellectual property/i,
			/disclaimers/i
		];
		for (const pattern of requiredH2s) {
			await expect(page.getByRole('heading', { level: 2, name: pattern })).toBeVisible();
		}
	});
});
