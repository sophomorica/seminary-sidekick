import { expect, test } from '@playwright/test';

test.describe('/doctrinal-mastery guide', () => {
	test('renders the guide from its posts row, evergreen', async ({ page }) => {
		const res = await page.goto('/doctrinal-mastery');
		expect(res?.status()).toBe(200);
		await expect(page).toHaveTitle(/Doctrinal Mastery for Parents/);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(
			"Doctrinal mastery: a parent's guide"
		);
		await expect(
			page.getByRole('heading', { name: 'What is doctrinal mastery?' })
		).toBeVisible();
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			/\/doctrinal-mastery$/
		);
		// No blog framing: no date eyebrow, no back-to-news link inside the article.
		await expect(page.locator('article .eyebrow')).toHaveCount(0);
		await expect(page.locator('article a[href="/news"]')).toHaveCount(0);
	});

	test('footer carries only the plain studio credit', async ({ page }) => {
		await page.goto('/doctrinal-mastery');
		const footer = page.locator('footer').last();
		await expect(
			footer.getByRole('link', { name: 'Made by Narrow Road Studios' })
		).toBeVisible();
		await expect(footer.getByRole('link', { name: 'Doctrinal mastery guide' })).toBeVisible();
	});

	test('sitemap lists the guide', async ({ request }) => {
		const body = await (await request.get('/sitemap.xml')).text();
		expect(body).toContain('/doctrinal-mastery</loc>');
	});
});
