/**
 * Unit tests for $lib/content/remotePosts with a mocked fetch — no dev
 * server involved. Covers what E2E can't easily: Supabase unreachable,
 * erroring, or unconfigured must yield [] so pages fall back to .svx.
 */

import { test, expect } from '@playwright/test';
import {
	fetchLivePosts,
	isLive,
	mergePosts,
	rowToDetail,
	rowToSummary,
	type PostRow
} from '../src/lib/content/remotePosts';

const NOW = new Date('2026-10-27T18:00:00Z');

function row(overrides: Partial<PostRow>): PostRow {
	return {
		slug: 'a-post',
		title: 'A post',
		summary: 'Summary.',
		body_md: 'Body.',
		hero_image_url: null,
		hero_image_alt: null,
		tags: [],
		status: 'published',
		publish_at: null,
		published_at: '2026-10-27T12:00:00Z',
		...overrides
	};
}

const ROWS: PostRow[] = [
	row({ slug: 'live' }),
	row({ slug: 'draft', status: 'draft', published_at: null }),
	row({
		slug: 'scheduled-future',
		status: 'scheduled',
		publish_at: '2026-11-01T12:00:00Z',
		published_at: null
	}),
	row({
		slug: 'scheduled-due-not-yet-flipped',
		status: 'scheduled',
		publish_at: '2026-10-27T12:00:00Z',
		published_at: null
	}),
	row({ slug: 'published-future', published_at: '2026-10-28T12:00:00Z' })
];

/** A fetch that answers every PostgREST call with `rows`, ignoring filters, like a loosened RLS. */
function mockFetch(rows: unknown, status = 200): typeof fetch {
	return async () =>
		new Response(JSON.stringify(rows), {
			status,
			headers: { 'Content-Type': 'application/json' }
		});
}

const CONFIG = { url: 'https://example.supabase.co', anonKey: 'anon', now: NOW };

test.describe('remotePosts', () => {
	test('only published rows whose published_at has passed are live', () => {
		expect(ROWS.filter((r) => isLive(r, NOW)).map((r) => r.slug)).toEqual(['live']);
	});

	test('fetchLivePosts drops drafts and future posts even if the server returns them', async () => {
		const rows = await fetchLivePosts({ ...CONFIG, fetch: mockFetch(ROWS) });
		expect(rows.map((r) => r.slug)).toEqual(['live']);
	});

	test('fetchLivePosts sends the published + published_at filters', async () => {
		let requested = '';
		const fetchSpy: typeof fetch = async (input, init) => {
			requested = String(input instanceof Request ? input.url : input);
			return mockFetch([])(input, init);
		};
		await fetchLivePosts({ ...CONFIG, fetch: fetchSpy });
		const url = new URL(requested);
		expect(url.pathname).toBe('/rest/v1/posts');
		expect(url.searchParams.get('status')).toBe('eq.published');
		expect(url.searchParams.get('published_at')).toBe(`lte.${NOW.toISOString()}`);
	});

	test('fetchLivePosts returns [] when Supabase is unreachable', async () => {
		const down: typeof fetch = async () => {
			throw new TypeError('fetch failed');
		};
		expect(await fetchLivePosts({ ...CONFIG, fetch: down })).toEqual([]);
	});

	test('fetchLivePosts returns [] on an error response', async () => {
		const rows = await fetchLivePosts({
			...CONFIG,
			fetch: mockFetch({ message: 'boom', code: 'XX000' }, 500)
		});
		expect(rows).toEqual([]);
	});

	test('fetchLivePosts returns [] when it times out', async () => {
		// Like real fetch: never resolves, rejects on abort, and rejects at once
		// when handed an already-aborted signal (postgrest-js retries with it).
		const hang: typeof fetch = (_input, init) =>
			new Promise((_resolve, reject) => {
				const signal = init?.signal;
				if (signal?.aborted) return reject(signal.reason);
				signal?.addEventListener('abort', () => reject(signal.reason));
			});
		expect(await fetchLivePosts({ ...CONFIG, fetch: hang, timeoutMs: 50 })).toEqual([]);
	});

	test('fetchLivePosts skips the network when unconfigured', async () => {
		let called = false;
		const spy: typeof fetch = async (...args) => {
			called = true;
			return mockFetch([])(...args);
		};
		expect(await fetchLivePosts({ url: '', anonKey: '', fetch: spy })).toEqual([]);
		expect(called).toBe(false);
	});

	test('rows map to post frontmatter dated in Mountain time', () => {
		// 03:30 UTC on the 28th is still the 27th in Denver.
		const summary = rowToSummary(
			row({ published_at: '2026-10-28T03:30:00Z', hero_image_url: '/x.jpg', tags: null })
		);
		expect(summary).toMatchObject({
			date: '2026-10-27',
			cover: '/x.jpg',
			tags: [],
			draft: false
		});
	});

	test('rowToDetail renders body_md to HTML', () => {
		const detail = rowToDetail(
			row({ body_md: '## Hi\n\n[Guide](/news/guide)', hero_image_alt: 'Alt' })
		);
		expect(detail.html).toContain('<h2>Hi</h2>');
		expect(detail.html).toContain('<a href="/news/guide">Guide</a>');
		expect(detail.coverAlt).toBe('Alt');
	});

	test('mergePosts keeps .svx on slug collisions and sorts newest first', () => {
		const svx = [
			{ ...rowToSummary(row({ slug: 'shared', title: 'From svx' })), date: '2026-09-01' },
			{ ...rowToSummary(row({ slug: 'old-svx' })), date: '2026-08-01' }
		];
		const remote = [
			{
				...rowToSummary(row({ slug: 'shared', title: 'From Supabase' })),
				date: '2026-10-27'
			},
			{ ...rowToSummary(row({ slug: 'new-remote' })), date: '2026-10-27' }
		];
		const merged = mergePosts(svx, remote);
		expect(merged.map((p) => p.slug)).toEqual(['new-remote', 'shared', 'old-svx']);
		expect(merged.find((p) => p.slug === 'shared')?.title).toBe('From svx');
	});
});
