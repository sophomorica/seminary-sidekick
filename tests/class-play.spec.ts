/**
 * Class Play — teacher waitlist + section presence across the site.
 *
 * Class Play is the viral mechanic the brand leads with. These tests
 * pin down the contract:
 *   - Homepage renders the marquee ClassPlay section with a working
 *     updates form (input + submit button, accessible by name).
 *   - Submitting a valid email transitions the form to a success state.
 *   - Submitting an invalid email is blocked client-side (HTML5
 *     validation is the first-pass requirement).
 *   - /for-teachers#class-play renders the elevated section with its
 *     own waitlist form.
 *   - /apps/scripture-mastery surfaces a Class Play feature card that
 *     links to /for-teachers#class-play.
 *
 * Role-based selectors so a copy edit doesn't silently break this.
 */

import { test, expect } from '@playwright/test';

test.describe('Class Play — homepage section', () => {
	test('marquee section is visible and form is interactive', async ({ page }) => {
		await page.goto('/');

		const section = page.locator('#class-play');
		await expect(section).toBeVisible();

		// Section eyebrow + headline ground the copy.
		await expect(
			page.getByRole('heading', { name: /like kahoot, for scripture mastery/i })
		).toBeVisible();

		// The waitlist form exposes its email field via aria-label and a
		// "Join the waitlist" button.
		const emailField = section.getByRole('textbox', { name: /class play/i }).first();
		await expect(emailField).toBeVisible();
		await expect(emailField).toHaveAttribute('type', 'email');

		const submit = section.getByRole('button', {
			name: /get class play updates/i
		});
		await expect(submit).toBeVisible();
	});

	test('submitting a valid email transitions to the success state', async ({ page }) => {
		await page.goto('/');
		// Let hydration attach `use:enhance` before submitting — a pre-hydration
		// click falls back to a full-page POST and the success card never shows.
		await page.waitForLoadState('networkidle');

		const section = page.locator('#class-play');
		await section
			.getByRole('textbox', { name: /class play/i })
			.first()
			.fill('teacher@example.com');

		await section.getByRole('button', { name: /get class play updates/i }).click();

		// Success card is announced via role="status".
		await expect(section.getByRole('status')).toContainText(/on the list/i);
	});

	test('invalid email is blocked by HTML5 validation', async ({ page }) => {
		await page.goto('/');

		const section = page.locator('#class-play');
		const emailField = section.getByRole('textbox', { name: /class play/i }).first();
		await emailField.fill('not-an-email');

		await section.getByRole('button', { name: /get class play updates/i }).click();

		// The success state should NOT appear — the browser blocked submit.
		await expect(section.getByRole('status')).toHaveCount(0);
		// And the email field remains interactive (not disabled / collapsed).
		await expect(emailField).toBeVisible();
	});
});

test.describe('Class Play — /for-teachers', () => {
	test('elevated section renders at #class-play with a waitlist form', async ({ page }) => {
		await page.goto('/for-teachers#class-play');

		const section = page.locator('#class-play');
		await expect(section).toBeVisible();

		await expect(
			page.getByRole('heading', { name: /the whole class, on the same board/i })
		).toBeVisible();

		// The dedicated page also gets its own waitlist form.
		await expect(section.getByRole('textbox', { name: /class play/i }).first()).toBeVisible();
		await expect(
			section.getByRole('button', { name: /get class play updates/i })
		).toBeVisible();
	});
});

test.describe('Saved class — /for-teachers', () => {
	test('how-to section renders at #saved-class', async ({ page }) => {
		await page.goto('/for-teachers#saved-class');

		const section = page.locator('#saved-class');
		await expect(section).toBeVisible();
		await expect(page.getByRole('heading', { name: /type the names once/i })).toBeVisible();
		await expect(page.getByRole('list', { name: /how to save a classroom/i })).toBeVisible();
		await expect(section.getByText(/create the class/i)).toBeVisible();
		await expect(section.getByText(/students pick their name/i)).toBeVisible();
	});
});

test.describe('Saved class — homepage', () => {
	test('points teachers to /for-teachers#saved-class', async ({ page }) => {
		await page.goto('/');

		const link = page.getByRole('link', { name: /save your class/i }).first();
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', /\/for-teachers#saved-class$/);
	});
});

test.describe('Class Play — /apps/scripture-mastery', () => {
	test('feature card is visible and links to /for-teachers#class-play', async ({ page }) => {
		await page.goto('/apps/scripture-mastery');

		const card = page.getByRole('link', { name: /class play/i }).first();
		await expect(card).toBeVisible();
		await expect(card).toHaveAttribute('href', /\/for-teachers#class-play$/);
	});
});
