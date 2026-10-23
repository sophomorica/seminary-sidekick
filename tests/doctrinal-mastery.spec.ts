import { test, expect } from '@playwright/test';

const pageTitle = 'Doctrinal Mastery for Parents: How to Help at Home | Seminary Sidekick';
const pageDescription =
	"A parent's guide to the 100 doctrinal mastery scriptures: what they are, how they're split across the four books, and a 10-minute weekly routine to practice at home.";

const h2Names = [
	'What is doctrinal mastery?',
	'Why memorizing is hard (and what helps)',
	'A 10-minute weekly routine for home',
	'Where Seminary Sidekick fits',
	'Questions parents ask'
] as const;

test('parents and crawlers see the doctrinal mastery guide', async ({ page }) => {
	const response = await page.goto('/doctrinal-mastery');
	expect(response).not.toBeNull();
	expect(response!.status()).toBe(200);

	await expect(page).toHaveTitle(pageTitle);
	await expect(page.locator('meta[name="description"]')).toHaveAttribute(
		'content',
		pageDescription
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://seminarysidekick.com/doctrinal-mastery'
	);

	const h1 = page.getByRole('heading', { level: 1 });
	await expect(h1).toHaveCount(1);
	await expect(h1).toHaveAccessibleName("Doctrinal mastery: a parent's guide");

	const main = page.locator('main');
	await expect(main).toHaveCount(1);
	await expect(main).toHaveId('main-content');

	const article = page.locator('article');
	const h2 = article.getByRole('heading', { level: 2 });
	await expect(h2).toHaveCount(h2Names.length);
	for (const name of h2Names) {
		await expect(article.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
	}

	await expect(article).toContainText('Old Testament: 24');
	await expect(article).toContainText('Doctrine and Covenants: 28');
	await expect(article).toContainText('$4.99/month or $34.99/year');
	await expect(article).toContainText('not made, sponsored, or endorsed by any church');

	await expect(article.getByRole('link', { name: 'App Store', exact: true })).toHaveAttribute(
		'href',
		'https://apps.apple.com/us/app/seminary-sidekick/id6780003239'
	);
	await expect(article.getByRole('link', { name: 'Google Play', exact: true })).toHaveAttribute(
		'href',
		'https://play.google.com/store/apps/details?id=com.seminarysidekick.app'
	);

	await expect(
		page
			.getByRole('contentinfo')
			.getByRole('link', { name: 'Made by Narrow Road Studios', exact: true })
	).toHaveAttribute('href', 'https://narrowroadstudios.com');

	const bannerHrefs = await page
		.getByRole('banner')
		.locator('a')
		.evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
	expect(
		bannerHrefs.some((href) =>
			href.split(/[?#]/)[0].replace(/\/$/, '').endsWith('/doctrinal-mastery')
		)
	).toBe(false);
});

test('sitemap lists doctrinal mastery monthly at priority 0.8', async ({ request }) => {
	const res = await request.get('/sitemap.xml');
	expect(res.status()).toBe(200);
	const body = await res.text();
	const blocks = body.match(/<url>[\s\S]*?<\/url>/g) ?? [];
	const url = blocks.find((block) =>
		block.includes('<loc>https://seminarysidekick.com/doctrinal-mastery</loc>')
	);
	expect(url).toBeDefined();
	expect(url).toContain('<changefreq>monthly</changefreq>');
	expect(url).toContain('<priority>0.8</priority>');
});
