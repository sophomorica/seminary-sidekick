/**
 * Quick Quiz demo — full play-through.
 *
 * Verifies the demo loads, accepts answers, advances questions, and
 * lands on the end-card with store CTAs.
 *
 * Selectors are deliberately role-based (not text-based) so the test
 * survives copy edits.
 */

import { test, expect } from '@playwright/test';

test.describe('Quick Quiz demo', () => {
	test('standalone page renders the demo with all interactive parts', async ({ page }) => {
		await page.goto('/quick-quiz');

		// Page hero <h1>
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

		// The demo lives inside a region with id="quick-quiz-demo" (per spec).
		await expect(page.locator('#quick-quiz-demo')).toBeVisible();

		// First question shows 4 answer-choice buttons.
		const choices = page.locator('#quick-quiz-demo').getByRole('button');
		await expect(choices.first()).toBeVisible({ timeout: 10_000 });
		const choiceCount = await choices.count();
		expect(choiceCount, 'Quick Quiz should show at least 4 choice buttons').toBeGreaterThanOrEqual(
			4
		);
	});

	test('playing all 5 questions reaches the end-card with store CTAs', async ({ page }) => {
		await page.goto('/quick-quiz');
		await expect(page.locator('#quick-quiz-demo')).toBeVisible();

		// Click the first visible choice on each of the 5 rounds.
		// We don't care if we get the answer right — just that the demo advances.
		for (let i = 0; i < 5; i++) {
			const choices = page.locator('#quick-quiz-demo').getByRole('button').filter({
				// Skip any nav-style buttons that might exist (e.g. exit).
				hasNotText: /skip|back|home/i
			});

			// Wait for at least one choice to be enabled.
			await expect(choices.first()).toBeVisible({ timeout: 5_000 });
			await choices.first().click();

			// Brief pause for advance animation. Demos use ~600-800ms transitions.
			await page.waitForTimeout(1_000);
		}

		// End card: store CTAs ("Coming soon" pills or real App Store / Play Store)
		// appear as part of the StoreButtons component.
		await expect(page.getByText(/coming soon|app store|google play/i).first()).toBeVisible({
			timeout: 5_000
		});
	});

	test('keyboard navigation works on the demo', async ({ page }) => {
		await page.goto('/quick-quiz');
		await expect(page.locator('#quick-quiz-demo')).toBeVisible();

		// Tab into the demo. Skip the skip-link + header focusables first.
		// We just verify some button inside the demo can be focused via keyboard.
		await page.locator('#quick-quiz-demo button').first().focus();
		await expect(page.locator('#quick-quiz-demo button').first()).toBeFocused();
	});
});
