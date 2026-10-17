/**
 * Scripture Builder teacher printouts — full doctrinal-mastery library.
 *
 * Count + signed-off 2 Nephi 2:25 + one long verse + Advanced glyph contract.
 * Fit locks (pages, font, rows) come from the calibrated Merriweather fit.
 * Do not paste the catalog here.
 */

import { test, expect, type Page } from '@playwright/test';

const DEFAULT_SLUG = '2-nephi-2-25';
const JOY_SLUG = '2-nephi-2-25';
const LONG_SLUG = 'exodus-20-3-17';
const DENSE_SLUG = 'isaiah-58-6-7';
const LIBRARY_COUNT = 100;
const PX_PER_IN = 96;

const NEPHI_ADVANCED = 'A___ f___ t___ m__ m____ b__ a__ m__ a___ t___ t___ m____ h___ j___';

const LONG_ADVANCED_PREFIX = 'T___ s____ h___ n_ o____ g___ b_____ m__';

type TileLock = { pages: number; fontPt: number; rows: number; rowHeightIn?: number };

async function tilePhrases(page: Page, group = 'A') {
	const texts = await page
		.locator(`[data-sheet-group="${group}"] [data-tile-phrase]`)
		.allTextContents();
	return texts.map((text) => text.trim());
}

async function expectTileLock(page: Page, lock: TileLock) {
	await expect(page.locator('[data-sheet-kind="tiles"]')).toHaveAttribute(
		'data-pages-per-group',
		String(lock.pages)
	);
	const sections = page.locator('[data-sheet-page][data-sheet-group="A"]');
	await expect(sections).toHaveCount(lock.pages);
	for (const section of await sections.all()) {
		await expect(section).toHaveAttribute('data-font-pt', String(lock.fontPt));
		await expect(section.locator('[data-tile-grid]')).toHaveAttribute('data-tile-grid', '2');
		await expect(section.locator('[data-tile-grid] > li')).toHaveCount(lock.rows * 2);
	}
	if (lock.rowHeightIn) {
		const rowHeightPx = await sections
			.first()
			.locator('[data-tile-grid] > li')
			.first()
			.evaluate((cell) => cell.getBoundingClientRect().height);
		expect(rowHeightPx).toBeCloseTo(lock.rowHeightIn * PX_PER_IN, 0);
	}
}

test.describe('/teachers/printouts', () => {
	test('finder pins this week, searches, and updates print links', async ({ page }) => {
		const response = await page.goto('/teachers/printouts');
		expect(response?.status()).toBe(200);

		await expect(
			page.getByRole('heading', { level: 1, name: /scripture builder printouts/i })
		).toBeVisible();
		await expect(page.getByText(`All ${LIBRARY_COUNT} doctrinal-mastery`)).toBeVisible();

		await expect(page.locator('select#printout-verse')).toHaveCount(0);
		await expect(page.locator('#printout-finder option')).toHaveCount(0);

		const finder = page.locator('#printout-finder');
		await expect(finder).toBeVisible();
		await expect(finder).toHaveAttribute('data-verse-count', String(LIBRARY_COUNT));

		const thisWeek = page.locator('[data-this-week]');
		await expect(thisWeek).toBeVisible();
		await expect(thisWeek).toHaveAttribute(
			'data-this-week',
			/^(doctrinal-mastery|proximal|unit)$/
		);
		const pinSlug = await page
			.locator('[data-this-week-slug]')
			.first()
			.getAttribute('data-this-week-slug');
		expect(pinSlug).toBeTruthy();
		await expect(finder).toHaveAttribute('data-selected-slug', pinSlug as string);

		await expect(page.getByRole('button', { name: /^beginner$/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /^intermediate$/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /^advanced$/i })).toBeVisible();

		const preview = page.locator('[data-printout-preview]');
		await expect(preview).toHaveAttribute('data-preview-level', 'beginner');
		await expect(page.getByRole('link', { name: /print tiles/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${pinSlug}/beginner`
		);

		const search = page.getByRole('searchbox', { name: /find a scripture/i });
		await search.fill('joy');
		await expect(page.getByText(/5 of 100 verses/)).toBeVisible();
		const joy = page.locator(`[data-verse-slug="${JOY_SLUG}"]`);
		await expect(joy).toHaveCount(1);
		await joy.click();

		await expect(finder).toHaveAttribute('data-selected-slug', JOY_SLUG);
		await expect(page.getByText(/Adam fell that men might be/i).first()).toBeVisible();
		await expect(preview).toHaveAttribute('data-preview-level', 'beginner');
		await expect(page.getByRole('link', { name: /print tiles/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${JOY_SLUG}/beginner`
		);
		await expect(page.getByRole('link', { name: /save pdf|download pdf/i })).toHaveCount(0);
		await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);

		await page.getByRole('button', { name: /^advanced$/i }).click();
		await expect(preview).toHaveAttribute('data-preview-level', 'advanced');
		await expect(page.getByRole('link', { name: /print hints/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${JOY_SLUG}/advanced`
		);
		await expect(page.getByRole('link', { name: /save pdf|download pdf/i })).toHaveCount(0);
		await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);

		await search.fill('exodus 20');
		await expect(page.getByText(/1 of 100 verses/)).toBeVisible();
		const long = page.locator(`[data-verse-slug="${LONG_SLUG}"]`);
		await expect(long).toHaveCount(1);
		await long.click();
		await expect(finder).toHaveAttribute('data-selected-slug', LONG_SLUG);
		await expect(preview).toHaveAttribute('data-preview-level', 'advanced');
		await expect(page.getByRole('link', { name: /print hints/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${LONG_SLUG}/advanced`
		);

		await page.getByRole('button', { name: /^beginner$/i }).click();
		await expect(preview).toHaveAttribute('data-preview-level', 'beginner');
		await expect(page.getByRole('link', { name: /print tiles/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${LONG_SLUG}/beginner`
		);
	});

	test('finder keeps the selected verse after a sheet and All printouts', async ({ page }) => {
		await page.goto('/teachers/printouts');
		const finder = page.locator('#printout-finder');
		const search = page.getByRole('searchbox', { name: /find a scripture/i });
		await search.fill('exodus 20');
		await expect(page.getByText(/1 of 100 verses/)).toBeVisible();
		const long = page.locator(`[data-verse-slug="${LONG_SLUG}"]`);
		await expect(long).toHaveCount(1);
		await long.click();
		await expect(finder).toHaveAttribute('data-selected-slug', LONG_SLUG);

		await page
			.getByRole('link', { name: /print tiles/i })
			.first()
			.click();
		await expect(page.getByRole('heading', { name: /Exodus 20:3/i })).toBeVisible();
		await expect(page.getByRole('link', { name: /all printouts/i })).toHaveAttribute(
			'href',
			`/teachers/printouts?verse=${LONG_SLUG}`
		);

		await page.getByRole('link', { name: /all printouts/i }).click();
		const returned = page.locator('#printout-finder');
		await expect(returned).toHaveAttribute('data-selected-slug', LONG_SLUG);
		await expect(page.getByRole('link', { name: /print tiles/i }).first()).toHaveAttribute(
			'href',
			`/teachers/printouts/${LONG_SLUG}/beginner`
		);
		await expect(
			page.getByText(/Thou shalt have no other gods before me/i).first()
		).toBeVisible();
	});

	test('beginner sheet uses app 3-word chunks, several tiles, not one per page', async ({
		page
	}) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/beginner`);

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(page.getByText(/cut-out tiles/i)).toBeVisible();
		await expectTileLock(page, { pages: 1, fontPt: 40, rows: 3 });

		const phrases = await tilePhrases(page);
		expect([...phrases].sort()).toEqual(
			[
				'Adam fell that',
				'and men are,',
				'have joy.',
				'men might be;',
				'that they might'
			].sort()
		);
		expect(phrases).not.toEqual([
			'Adam fell that',
			'men might be;',
			'and men are,',
			'that they might',
			'have joy.'
		]);
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
		await expect(page.getByRole('link', { name: /save pdf|download pdf/i })).toHaveCount(0);
	});

	test('intermediate sheet uses app 2-word chunks', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/intermediate`);

		await expect(page.locator('[data-tile-grid]')).toHaveAttribute('data-tile-grid', '2');
		const phrases = await tilePhrases(page);
		expect([...phrases].sort()).toEqual(
			[
				'Adam fell',
				'and men',
				'are, that',
				'have joy.',
				'might be;',
				'that men',
				'they might'
			].sort()
		);
		expect(phrases).not.toEqual([
			'Adam fell',
			'that men',
			'might be;',
			'and men',
			'are, that',
			'they might',
			'have joy.'
		]);
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
	});

	test('group stepper adds lettered sheets with the same tiles', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/beginner`, {
			waitUntil: 'networkidle'
		});

		const stepper = page.getByRole('group', { name: /groups/i });
		await expect(stepper).toHaveAttribute('data-group-count', '1');
		const phrasesA = await tilePhrases(page, 'A');
		expect(phrasesA).toHaveLength(5);
		expect(await page.locator('[data-tile-group]').allTextContents()).toEqual(
			phrasesA.map(() => 'A')
		);

		const more = page.getByRole('button', { name: 'More groups' });
		await more.click();
		await more.click();
		await expect(stepper).toHaveAttribute('data-group-count', '3');

		const sections = page.locator('[data-sheet-page]');
		await expect(sections).toHaveCount(3);
		expect(await sections.evaluateAll((els) => els.map((el) => el.dataset.sheetGroup))).toEqual(
			['A', 'B', 'C']
		);
		await expect(page.locator('[data-sheet-group-badge]')).toHaveText([
			'Group A',
			'Group B',
			'Group C'
		]);
		for (const group of ['B', 'C']) {
			expect(await tilePhrases(page, group)).toEqual(phrasesA);
			expect(
				await page
					.locator(`[data-sheet-group="${group}"] [data-tile-group]`)
					.allTextContents()
			).toEqual(phrasesA.map(() => group));
		}
	});

	test('dense beginner sheet fits one page and the stepper counts pages', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DENSE_SLUG}/beginner`, { waitUntil: 'networkidle' });

		await expectTileLock(page, { pages: 1, fontPt: 20.5, rows: 10, rowHeightIn: 0.965 });

		const stepper = page.getByRole('group', { name: /groups/i });
		const summary = page.locator('[data-print-summary]');
		const fewer = page.getByRole('button', { name: 'Fewer groups' });
		const more = page.getByRole('button', { name: 'More groups' });
		await expect(stepper).toHaveAttribute('data-group-count', '1');
		await expect(summary).toHaveText('Group A · 1 page · one sheet per group of 3–4');
		await expect(fewer).toBeDisabled();

		for (let i = 0; i < 3; i++) await more.click();
		await expect(summary).toContainText('Groups A–D · 4 pages');
		await expect(page.locator('[data-sheet-page]')).toHaveCount(4);
		await expect(fewer).toBeEnabled();

		for (let i = 0; i < 6; i++) await more.click();
		await expect(stepper).toHaveAttribute('data-group-count', '10');
		await expect(summary).toContainText('Groups A–J · 10 pages');
		await expect(more).toBeDisabled();
	});

	test('advanced sheet is first-letter hints, not master or cutouts', async ({ page }) => {
		await page.goto(`/teachers/printouts/${DEFAULT_SLUG}/advanced`);

		await expect(page.getByRole('heading', { name: /2 Nephi 2:25/i })).toBeVisible();
		await expect(
			page.getByText(/type it with first-letter hints\. same advanced as the app/i)
		).toBeVisible();
		const hints = page.locator('[data-hint-line]');
		await expect(hints).toHaveAttribute('data-hint-line', NEPHI_ADVANCED);
		await expect(hints).toHaveAttribute('aria-label', NEPHI_ADVANCED);
		await expect(hints).toHaveText(/A___ f___ t___ m__ m____ b__ a__/);
		await expect(hints).toHaveText(/m__ a___ t___ t___ m____ h___ j___/);
		await expect(page.getByText(/write the verse from memory/i)).toHaveCount(0);
		await expect(page.getByText(/write-it-down/i)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that/)).toHaveCount(0);
		await expect(page.getByText(/Adam fell that men might be/i)).toHaveCount(0);
		await expect(page.getByRole('list', { name: /phrase tiles/i })).toHaveCount(0);
		await expect(page.locator('[data-tile-group]')).toHaveCount(0);
		await expect(page.getByRole('group', { name: /groups/i })).toHaveCount(0);
		await expect(page.getByRole('link', { name: /save pdf|download pdf/i })).toHaveCount(0);
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
	});

	test('long verse beginner sheet is compact 2-column mixed tiles', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/beginner`);
		expect(response?.status()).toBe(200);

		await expect(page.getByRole('heading', { name: /Exodus 20:3/i })).toBeVisible();
		await expectTileLock(page, { pages: 2, fontPt: 14.5, rows: 10 });

		const phrases = await tilePhrases(page);
		expect(phrases).toHaveLength(38);
		expect(phrases[0]).not.toBe('Thou shalt have no other gods before me.');
		const wordCounts = phrases.map((phrase) => phrase.split(/\s+/).length);
		expect(Math.max(...wordCounts)).toBe(8);
		expect(wordCounts.filter((count) => count === 8).length).toBeGreaterThan(30);
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(
			page.getByText(/Thou shalt have no other gods before me\. Thou shalt not make/i)
		).toHaveCount(0);
	});

	test('long verse intermediate sheet stays 2-column and mixed', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/intermediate`);
		expect(response?.status()).toBe(200);

		await expectTileLock(page, { pages: 3, fontPt: 19.5, rows: 9 });

		const phrases = await tilePhrases(page);
		expect(phrases).toHaveLength(50);
		expect(phrases[0]).not.toBe('Thou shalt have no other gods');
		for (const phrase of phrases) {
			expect(phrase, 'tiles must not be numbered').not.toMatch(/^\d/);
		}
		await expect(
			page.getByText(/Thou shalt have no other gods before me\. Thou shalt not make/i)
		).toHaveCount(0);
	});

	test('long verse Advanced sheet is first-letter glyphs only', async ({ page }) => {
		const response = await page.goto(`/teachers/printouts/${LONG_SLUG}/advanced`);
		expect(response?.status()).toBe(200);

		await expect(page.getByRole('heading', { name: /Exodus 20:3/i })).toBeVisible();
		await expect(
			page.getByText(/type it with first-letter hints\. same advanced as the app/i)
		).toBeVisible();

		const sections = page.locator('[data-sheet-kind="hints"] [data-sheet-page]');
		await expect(sections).toHaveCount(1);
		await expect(sections).toHaveAttribute('data-font-pt', '16.5');

		const hints = page.locator('[data-hint-line]');
		const hintLine = await hints.getAttribute('data-hint-line');
		expect(hintLine).toBeTruthy();
		expect(hintLine?.startsWith(LONG_ADVANCED_PREFIX)).toBe(true);
		expect(hintLine?.split(/\s+/).filter(Boolean)).toHaveLength(297);
		expect(hintLine).toMatch(/T___/);
		expect(hintLine).toMatch(/_/);
		expect(hintLine).not.toMatch(/Thou shalt have/);
		await expect(hints).toHaveAttribute('aria-label', hintLine as string);

		await expect(page.getByText(/write the verse from memory/i)).toHaveCount(0);
		await expect(page.getByText(/write-it-down/i)).toHaveCount(0);
		await expect(page.getByText(/Thou shalt have no other gods before me/i)).toHaveCount(0);
		await expect(page.getByRole('list', { name: /phrase tiles/i })).toHaveCount(0);
		await expect(page.getByRole('button', { name: /print \/ save as pdf/i })).toBeVisible();
	});

	test('static proof PDFs are gone', async ({ request }) => {
		for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
			const res = await request.get(`/printouts/${DEFAULT_SLUG}-${level}.pdf`);
			expect(res.status(), `${level} pdf`).toBe(404);
		}
	});
});
