import { test, expect, type Page } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const evidence = process.env.VERIFY_EVIDENCE ?? '/tmp/verify-sidekick-evidence';
const shot = (page: Page, name: string) =>
	page.screenshot({ path: `${evidence}/${name}.png`, fullPage: false });
const proof = (name: string, data: unknown) =>
	writeFileSync(`${evidence}/proof-${name}.json`, JSON.stringify(data, null, 2));

async function fresh(page: Page, url: string) {
	await page.goto(url);
	await page.waitForLoadState('networkidle');
}

test('[teach] pick a book, see its ideas, open the book page', async ({ page }) => {
	await fresh(page, '/teach');
	await expect(page.getByTestId('idea-card')).toHaveCount(10);
	await shot(page, 'teach-1-all');

	await page.locator('select[name="book"]').selectOption('genesis');
	await page.getByRole('button', { name: 'Find ideas' }).click();
	await expect(page).toHaveURL(/book=genesis/);
	await expect(page.getByTestId('idea-card')).toHaveCount(3);
	await expect(page.getByTestId('teach-count')).toContainText('3 ideas');
	await shot(page, 'teach-2-genesis');

	const html = await page.content();
	for (const leak of ['mock-private-ref-001', 'source_ref', 'has_free_asset'])
		expect(html, `private field ${leak} reached the page`).not.toContain(leak);

	await page.getByRole('link', { name: /^Ruth/ }).scrollIntoViewIfNeeded();
	await page.getByRole('link', { name: /^Ruth/ }).click();
	await expect(page).toHaveURL(/\/teach\/ruth$/);
	await expect(page.getByTestId('book-thin')).toContainText('Only 1 idea');
	await shot(page, 'teach-3-ruth');
	proof('teach', { genesisCards: 3, bookUrl: page.url() });
});

test('[printouts] find a verse and open its printable sheet', async ({ page }) => {
	await fresh(page, '/teachers/printouts');
	const finder = page.locator('#printout-finder');
	await expect(finder).toHaveAttribute('data-verse-count', '100');

	await page.getByRole('searchbox', { name: /find a scripture/i }).fill('joy');
	await page.locator('[data-verse-slug="2-nephi-2-25"]').click();
	await expect(finder).toHaveAttribute('data-selected-slug', '2-nephi-2-25');
	await shot(page, 'printouts-1-finder');

	await page
		.getByRole('link', { name: /print tiles/i })
		.first()
		.click();
	await expect(page).toHaveURL(/\/teachers\/printouts\/2-nephi-2-25\/beginner$/);
	await expect(page.locator('[data-sheet-kind="tiles"]')).toBeVisible();
	const tiles = await page.locator('[data-sheet-group="A"] [data-tile-phrase]').allTextContents();
	expect(tiles.length).toBeGreaterThan(3);
	expect(tiles.join(' ')).toMatch(/Adam fell/i);
	await shot(page, 'printouts-2-sheet');
	proof('printouts', { url: page.url(), tileCount: tiles.length, firstTiles: tiles.slice(0, 3) });
});

test('[groupplay] join page rejects a missing room and shows a class roster', async ({ page }) => {
	await fresh(page, '/join');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	const code = page.getByLabel('Game code');

	await code.fill('ZZZZ');
	await expect(page.getByText('Room not found. Double-check the code.')).toBeVisible();
	await shot(page, 'groupplay-1-not-found');

	await code.fill('CLAZ');
	const roster = page.getByRole('radiogroup', { name: 'Class list' });
	await expect(roster.getByRole('radio')).toHaveCount(2);
	await expect(roster).toContainText('Ada Fixture');
	await roster.getByRole('radio', { name: /Ada Fixture/ }).click();
	await expect(page.getByRole('button', { name: 'Join as Ada Fixture' })).toBeVisible();
	await shot(page, 'groupplay-2-roster');

	const calls = readFileSync(`${evidence}/rpc-calls.jsonl`, 'utf8')
		.trim()
		.split('\n')
		.map((line) => JSON.parse(line));
	expect(calls.map((c) => [c.rpc, c.body.p_code, c.status])).toEqual(
		expect.arrayContaining([
			['get_room_join_info', 'ZZZZ', 400],
			['get_room_join_info', 'CLAZ', 200]
		])
	);
	proof('groupplay', { rpcCalls: calls });
});
