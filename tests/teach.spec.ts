/**
 * /teach finder and /teach/[book] pages, read from the mock Supabase
 * (tests/mocks/supabase-posts.mjs). The mock leaks source_ref and
 * has_free_asset on purpose; neither may reach the page.
 */

import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import {
	bookSlug,
	fetchIdeas,
	filterIdeas,
	groupByCategory,
	masteryHub,
	toIdea
} from '../src/lib/teach/ideas';
import { buildSql, parseCsv, isDropped } from '../scripts/seed-teaching-ideas.mjs';

test.describe('/teach', () => {
	test('lists ideas without private fields or free-asset flags', async ({ page }) => {
		const res = await page.goto('/teach');
		expect(res?.status()).toBe(200);
		await expect(
			page.getByRole('heading', { level: 1, name: /teaching idea finder/i })
		).toBeVisible();
		await expect(page.getByTestId('idea-card')).toHaveCount(10);
		const html = await page.content();
		expect(html).not.toContain('mock-private-ref-001');
		expect(html).not.toContain('source_ref');
		expect(html).not.toContain('has_free_asset');
		await expect(page.getByText(/free (file|download|asset)/i)).toHaveCount(0);
	});

	test('filters by year and keyword on the server', async ({ page }) => {
		await page.goto('/teach?course=OT&q=rainbow');
		await expect(page.getByTestId('idea-card')).toHaveCount(1);
		await expect(page.getByRole('heading', { name: 'Rainbow promise jar' })).toBeVisible();
		await page.goto('/teach?q=zzzz-nothing');
		await expect(page.getByTestId('teach-no-match')).toBeVisible();
	});

	test('filters by book', async ({ page }) => {
		await page.goto('/teach?book=genesis');
		await expect(page.getByTestId('idea-card')).toHaveCount(3);
		await expect(page.getByTestId('teach-count')).toContainText('3 ideas');
		await page.goto('/teach?book=genesis&category=game');
		await expect(page.getByTestId('idea-card')).toHaveCount(1);
		// Unknown slugs are ignored, not a 500.
		await page.goto('/teach?book=not-a-book');
		await expect(page.getByTestId('idea-card')).toHaveCount(10);
	});

	test('book page lists its ideas', async ({ page }) => {
		await page.goto('/teach/genesis');
		await expect(page.getByRole('heading', { level: 1, name: 'Genesis' })).toBeVisible();
		await expect(page.getByTestId('idea-card')).toHaveCount(3);
		await expect(page.getByTestId('book-thin')).toHaveCount(0);
		// Grouped by type, in label order.
		const groups = page.getByTestId('category-group');
		await expect(groups).toHaveCount(3);
		await expect(groups.locator('h2')).toHaveText(['Lesson idea', 'Game', 'Object lesson']);
		await expect(page.getByRole('link', { name: /Game \(1\)/ })).toHaveAttribute(
			'href',
			'#game'
		);
	});

	test('thin and empty books say so honestly', async ({ page }) => {
		await page.goto('/teach/ruth');
		await expect(page.getByTestId('book-thin')).toContainText('Only 1 idea');
		await page.goto('/teach/enos');
		await expect(page.getByTestId('book-empty')).toBeVisible();
	});

	test('unknown book is a 404', async ({ page }) => {
		const res = await page.goto('/teach/not-a-book');
		expect(res?.status()).toBe(404);
	});

	test('mastery hub groups by year, games first, no rhymes', async ({ page }) => {
		const res = await page.goto('/teach/mastery');
		expect(res?.status()).toBe(200);
		await expect(
			page.getByRole('heading', { level: 1, name: /doctrinal mastery ideas/i })
		).toBeVisible();
		await expect(page.getByTestId('mastery-count')).toContainText('3 ideas');
		await expect(page.getByTestId('mastery-course').locator('h2')).toHaveText([
			'Old Testament',
			'Doctrine and Covenants'
		]);
		const ot = page.getByTestId('mastery-course').first();
		await expect(ot.getByTestId('mastery-games').getByTestId('idea-card')).toHaveCount(1);
		await expect(ot.getByTestId('mastery-games')).toContainText('Memory relay');
		await expect(page.getByText(/rhyme/i)).toHaveCount(0);
		const html = await page.content();
		expect(html).not.toContain('mock-private-ref-001');
		await page.goto('/teach');
		await expect(page.getByRole('link', { name: /doctrinal mastery ideas/i })).toHaveAttribute(
			'href',
			'/teach/mastery'
		);
	});

	test('is linked from /teachers', async ({ page }) => {
		await page.goto('/teachers');
		await expect(page.getByRole('link', { name: /teaching idea finder/i })).toHaveAttribute(
			'href',
			'/teach'
		);
	});
});

test.describe('teach data helpers', () => {
	test('fetchIdeas asks only for display columns and strips extras', async () => {
		let url = '';
		const spy: typeof fetch = async (input) => {
			url = String(input instanceof Request ? input.url : input);
			return new Response(
				JSON.stringify([
					{
						course: 'OT',
						book: 'Job',
						category: 'game',
						title: 't',
						summary: 's',
						source_ref: 'x'
					}
				]),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		};
		const ideas = await fetchIdeas({ url: 'https://e.supabase.co', anonKey: 'a', fetch: spy });
		expect(new URL(url).searchParams.get('select')).toBe('course,book,category,title,summary');
		expect(Object.keys(ideas[0]).sort()).toEqual([
			'book',
			'category',
			'course',
			'summary',
			'title'
		]);
	});

	test('fetchIdeas returns [] when unconfigured or down', async () => {
		expect(await fetchIdeas({ url: '', anonKey: '' })).toEqual([]);
		const down: typeof fetch = async () => {
			throw new TypeError('down');
		};
		expect(
			await fetchIdeas({ url: 'https://e.supabase.co', anonKey: 'a', fetch: down })
		).toEqual([]);
	});

	test('masteryHub drops rhymes and splits games', () => {
		const dm = (course: string, title: string) =>
			toIdea({ course, book: 'general', category: 'doctrinal_mastery', title, summary: '' });
		const hub = masteryHub([
			dm('NT', 'Scripture bingo'),
			dm('NT', 'Ask a question'),
			dm('NT', 'Rhyming couplets'),
			toIdea({ course: 'NT', book: 'John', category: 'game', title: 'Not DM', summary: '' })
		]);
		expect(hub).toHaveLength(1);
		expect(hub[0].games.map((i) => i.title)).toEqual(['Scripture bingo']);
		expect(hub[0].other.map((i) => i.title)).toEqual(['Ask a question']);
	});

	test('slugs and filters', () => {
		expect(bookSlug('D&C')).toBe('d-and-c');
		expect(bookSlug('1 Nephi')).toBe('1-nephi');
		const ideas = [
			toIdea({
				course: 'NT',
				book: 'John',
				category: 'game',
				title: 'Vine',
				summary: 'Branches'
			})
		];
		expect(filterIdeas(ideas, { q: 'branch' })).toHaveLength(1);
		expect(filterIdeas(ideas, { course: 'OT' })).toHaveLength(0);
		expect(filterIdeas(ideas, { book: 'john' })).toHaveLength(1);
		expect(filterIdeas(ideas, { book: 'luke' })).toHaveLength(0);
		const mk = (category: string) =>
			toIdea({ course: 'OT', book: 'Job', category, title: category, summary: '' });
		expect(
			groupByCategory([mk('zzz'), mk('game'), mk('lesson_plan'), mk('game')]).map((g) => [
				g.category,
				g.ideas.length
			])
		).toEqual([
			['lesson_plan', 1],
			['game', 2],
			['zzz', 1]
		]);
	});
});

const PRIVATE_CSV = '/workspace/sidekick-catalog/sidekick_ingest.csv';

test.describe('seed script', () => {
	test('keeps normal rows, ignores the asset flag, escapes quotes', () => {
		const csv = [
			'id,course,book,category,title,summary,has_free_asset,source_ref',
			'r1,OT,Job,activity,"Job\'s friends","Act it out, then ""discuss"".",y,r1'
		].join('\n');
		const records = parseCsv(csv);
		expect(records).toHaveLength(1);
		const { sql, kept, dropped } = buildSql(records);
		expect([kept, dropped]).toEqual([1, 0]);
		expect(isDropped('r1')).toBe(false);
		expect(sql).toContain("'Job''s friends'");
		expect(sql).toContain('Act it out, then "discuss".');
		expect(sql).not.toContain('has_free_asset');
		expect(sql).toContain('on conflict (source_ref) do update');
		expect(sql).not.toContain('delete from');
	});

	// Runs only where the private catalog exists (never in CI, never committed).
	test('drops exactly the two app rows from the private catalog', () => {
		test.skip(!existsSync(PRIVATE_CSV), 'private catalog not on this machine');
		const { kept, dropped, sql } = buildSql(parseCsv(readFileSync(PRIVATE_CSV, 'utf8')));
		expect([kept, dropped]).toEqual([1179, 2]);
		expect(sql).toContain('delete from public.teaching_ideas where source_ref in (');
	});
});
