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
	toWriteup,
	type TeachingIdea
} from '../src/lib/teach/ideas';
import { withIdea } from '../src/lib/teach/ideaHref';
import { buildWriteupSql } from '../scripts/seed-teaching-writeups.mjs';

const toIdea = (
	i: Omit<TeachingIdea, 'slug' | 'imageUrl' | 'imageAlt' | 'course'> & { course: string }
) => ({ ...i, slug: 's', imageUrl: null, imageAlt: null }) as TeachingIdea;
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
		// Summary-only ideas (no write-up) and bad slugs are never listed.
		expect(html).not.toContain('Hidden summary-only idea');
		expect(html).not.toContain('Bad slug idea');
		await expect(page.getByTestId('idea-pane-empty')).toBeVisible();
	});

	test('clicking a card opens its how-to in the side pane (desktop)', async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto('/teach?course=OT');
		await page.getByRole('link', { name: /Rainbow promise jar/ }).click();
		await expect(page).toHaveURL(/[?&]idea=rainbow-promise-jar/);
		await expect(page).toHaveURL(/course=OT/);
		const pane = page.getByTestId('idea-pane');
		await expect(pane.getByRole('heading', { name: 'Rainbow promise jar' })).toBeVisible();
		await expect(pane).toContainText('Mock write-up for Rainbow promise jar.');
		await expect(pane.getByRole('heading', { name: 'Steps' })).toBeVisible();
		await expect(pane.getByTestId('idea-page-link')).toHaveAttribute(
			'href',
			'/teach/idea/rainbow-promise-jar'
		);
		await expect(page.getByTestId('idea-back')).toBeHidden();
		await expect(page.locator('[data-testid="idea-card"][aria-current="true"]')).toHaveCount(1);
	});

	test('a shared ?idea= link renders the pane on the server, with an image', async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto('/teach?idea=creation-days-relay');
		await expect(page.getByTestId('idea-image')).toHaveAttribute('alt', 'Mock setup diagram');
		await page.goto('/teach?idea=hidden-summary-only-idea');
		await expect(page.getByTestId('idea-pane-empty')).toBeVisible();
		await page.goto('/teach?idea=%3Cscript%3E');
		await expect(page.getByTestId('idea-pane-empty')).toBeVisible();
	});

	test('on mobile the idea opens full screen with a back link', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/teach/genesis');
		await expect(page.getByTestId('idea-pane')).toBeHidden();
		await page.getByRole('link', { name: /Covenant path map/ }).click();
		await expect(page).toHaveURL(/\/teach\/genesis\?idea=covenant-path-map/);
		const pane = page.getByTestId('idea-pane');
		await expect(pane).toBeVisible();
		await expect(pane).toHaveCSS('position', 'fixed');
		await page.getByTestId('idea-back').click();
		await expect(page).toHaveURL(/\/teach\/genesis$/);
		await expect(page.getByTestId('idea-pane')).toBeHidden();
	});

	test('mastery hub opens ideas in the pane', async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await page.goto('/teach/mastery');
		await page.getByRole('link', { name: /Memory relay/ }).click();
		await expect(page).toHaveURL(/\/teach\/mastery\?idea=memory-relay/);
		await expect(page.getByTestId('idea-pane')).toContainText(
			'Mock write-up for Memory relay.'
		);
	});

	test('each idea has its own page; summary-only ideas do not', async ({ page }) => {
		const res = await page.goto('/teach/idea/covenant-path-map');
		expect(res?.status()).toBe(200);
		await expect(
			page.getByRole('heading', { level: 1, name: 'Covenant path map' })
		).toBeVisible();
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			'href',
			/\/teach\/idea\/covenant-path-map$/
		);
		await expect(page.getByRole('link', { name: 'More for Genesis' })).toHaveAttribute(
			'href',
			'/teach/genesis'
		);
		expect(await page.content()).not.toContain('mock-private-ref-001');
		expect((await page.goto('/teach/idea/hidden-summary-only-idea'))?.status()).toBe(404);
		expect((await page.goto('/teach/idea/nope'))?.status()).toBe(404);
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
	test('fetchIdeas asks only for display columns, needs a write-up, strips extras', async () => {
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
						slug: 'idea-t',
						body_md: 'Body',
						image_url: 'javascript:alert(1)',
						image_alt: 'x',
						source_ref: 'x'
					},
					{
						course: 'OT',
						book: 'Job',
						category: 'game',
						title: 'u',
						summary: 's',
						body_md: null
					}
				]),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		};
		const ideas = await fetchIdeas({ url: 'https://e.supabase.co', anonKey: 'a', fetch: spy });
		const params = new URL(url).searchParams;
		expect(params.get('select')).toBe(
			'course,book,category,title,summary,slug,body_md,image_url,image_alt'
		);
		expect(params.get('body_md')).toBe('not.is.null');
		expect(ideas).toHaveLength(1);
		expect(Object.keys(ideas[0]).sort()).toEqual([
			'bodyMd',
			'book',
			'category',
			'course',
			'imageAlt',
			'imageUrl',
			'slug',
			'summary',
			'title'
		]);
		// Unsafe image URLs are dropped.
		expect(ideas[0].imageUrl).toBeNull();
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

	test('toWriteup keeps safe images only with alt text', () => {
		const base = {
			course: 'OT',
			book: 'Job',
			category: 'game',
			title: 't',
			summary: 's',
			slug: 'a-b',
			body_md: 'x'
		};
		expect(toWriteup({ ...base, image_url: '/i.jpg', image_alt: 'alt' })?.imageUrl).toBe(
			'/i.jpg'
		);
		expect(
			toWriteup({ ...base, image_url: 'https://x.co/i.jpg', image_alt: 'alt' })?.imageUrl
		).toBe('https://x.co/i.jpg');
		expect(
			toWriteup({ ...base, image_url: '//evil.co/i.jpg', image_alt: 'alt' })?.imageUrl
		).toBeNull();
		expect(toWriteup({ ...base, image_url: '/i.jpg', image_alt: '' })?.imageUrl).toBeNull();
		expect(toWriteup({ ...base, slug: 'Bad Slug' })).toBeNull();
		expect(toWriteup({ ...base, body_md: '  ' })).toBeNull();
	});

	test('withIdea keeps filters and toggles the idea', () => {
		const u = new URL('https://x.co/teach?course=OT&idea=old');
		expect(withIdea(u, 'new')).toBe('/teach?course=OT&idea=new');
		expect(withIdea(u, '')).toBe('/teach?course=OT');
		expect(withIdea(new URL('https://x.co/teach/genesis?idea=a'), '')).toBe('/teach/genesis');
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

test.describe('write-up seed script', () => {
	const ok = {
		source_ref: "r'1",
		slug: 'ball-toss',
		title: 'Ball toss',
		summary: "Toss it, it's fun.",
		body: '## Steps\n1. Toss.',
		image_url: '/teach/ideas/ball-toss.jpg',
		image_alt: 'A ball'
	};
	test('builds updates keyed by source_ref, escaped, no deletes', () => {
		const sql = buildWriteupSql([ok]);
		expect(sql).toContain("where source_ref = 'r''1'");
		expect(sql).toContain("'Toss it, it''s fun.'");
		expect(sql).not.toMatch(/delete|drop|insert/i);
	});
	test('refuses links, Facebook, names of our products, and missing alt text', () => {
		for (const bad of [
			{ body: 'See https://example.com' },
			{ body: 'From the Facebook group' },
			{ summary: 'Try Seminary Sidekick' },
			{ body: 'A Narrow Road idea' },
			{ image_alt: '' },
			{ slug: 'Bad Slug' }
		])
			expect(() => buildWriteupSql([{ ...ok, ...bad }])).toThrow();
	});
});

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
