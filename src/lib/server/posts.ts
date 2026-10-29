/**
 * News and guides from public.posts.
 *
 * A row is visible when status is published and publish_at has passed.
 * That predicate is the request-time filter. RLS repeats it for the anon key.
 *
 * POSTS_LOCAL=1 (Playwright and local dev without a database) reads a PGLite
 * database loaded from the migration and seed in this repo. It never opens
 * DATABASE_URL. Otherwise the server uses the public Supabase anon key.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$lib/config/supabase';
import type { GuidePage, NewsArticle, NewsCard, PostKind } from '$lib/content/post';
import { VISIBLE_POSTS_SQL } from '$lib/content/visiblePostsSql';

const TIME_ZONE = 'America/New_York';

const calendarFormat = new Intl.DateTimeFormat('en-CA', {
	timeZone: TIME_ZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

const labelFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	year: 'numeric',
	month: 'long',
	day: 'numeric'
});

type VisibleRow = {
	slug: string;
	kind: PostKind;
	title: string;
	description: string;
	body_md: string;
	image_url: string | null;
	publish_at: string;
};

const COLUMNS = 'slug, kind, title, description, body_md, image_url, publish_at';

type Queryable = {
	query<T>(sql: string, params: unknown[]): Promise<{ rows: T[] }>;
};

let localDb: Queryable | undefined;
let remote: SupabaseClient | undefined;

function calendarDate(iso: string): string {
	return calendarFormat.format(new Date(iso));
}

function dateLabel(iso: string): string {
	return labelFormat.format(new Date(iso));
}

function toCard(row: VisibleRow): NewsCard {
	return {
		slug: row.slug,
		title: row.title,
		excerpt: row.description,
		date: calendarDate(row.publish_at),
		dateLabel: dateLabel(row.publish_at)
	};
}

function toArticle(row: VisibleRow): NewsArticle {
	return {
		...toCard(row),
		html: marked.parse(row.body_md, { async: false }) as string,
		imageUrl: row.image_url
	};
}

function toGuide(row: VisibleRow): GuidePage {
	return {
		slug: row.slug,
		title: row.title,
		excerpt: row.description,
		html: marked.parse(row.body_md, { async: false }) as string
	};
}

function useLocal(): boolean {
	return process.env.POSTS_LOCAL === '1' || !SUPABASE_URL || !SUPABASE_ANON_KEY;
}

async function localDatabase(): Promise<Queryable> {
	if (localDb) return localDb;
	const { PGlite } = await import('@electric-sql/pglite');
	const db = new PGlite();
	const migration = readFileSync(
		join(process.cwd(), 'supabase/migrations/20261029160000_posts_content_model.sql'),
		'utf8'
	);
	const seed = readFileSync(
		join(process.cwd(), 'supabase/seed/20261029_posts_content.sql'),
		'utf8'
	);
	await db.exec(migration);
	await db.exec(seed);
	if (process.env.POSTS_E2E_FIXTURES === '1') {
		await db.exec(fixtureSql());
	}
	localDb = db;
	return db;
}

function fixtureSql(): string {
	return `
insert into public.posts (slug, kind, title, description, body_md, image_url, publish_at, status)
values
	(
		'posted-from-supabase',
		'news',
		'Posted from Supabase',
		'A live row from the posts table.',
		$fixture$## A heading from markdown

Read the [Scripture Builder printouts](/teachers/printouts).

<img src="/images/news/news-10min-review-2026-10-27.jpg" alt="Mock hero image" />$fixture$,
		'/images/news/news-10min-review-2026-10-27.jpg',
		now() - interval '2 hours',
		'published'
	),
	(
		'supabase-draft-post',
		'news',
		'Supabase draft post',
		'Not ready.',
		'Draft body.',
		null,
		now() - interval '1 day',
		'draft'
	),
	(
		'supabase-scheduled-future-post',
		'news',
		'Supabase scheduled future post',
		'Goes live next week.',
		'Future body.',
		null,
		now() + interval '7 days',
		'published'
	),
	(
		'supabase-future-published-post',
		'news',
		'Supabase future published post',
		'Published flag set, but the time has not come.',
		'Future body.',
		null,
		now() + interval '7 days',
		'published'
	)
on conflict (slug) do nothing;
`;
}

function remoteClient(): SupabaseClient {
	remote ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
	});
	return remote;
}

async function selectVisible(kind: PostKind, now: Date): Promise<VisibleRow[]> {
	if (useLocal()) {
		const db = await localDatabase();
		const result = await db.query<VisibleRow>(VISIBLE_POSTS_SQL, [kind, now.toISOString()]);
		return result.rows;
	}

	const { data, error } = await remoteClient()
		.from('posts')
		.select(COLUMNS)
		.eq('kind', kind)
		.eq('status', 'published')
		.lte('publish_at', now.toISOString())
		.order('publish_at', { ascending: false })
		.order('slug', { ascending: true });

	if (error) {
		console.error('[posts] Supabase query failed:', error.message);
		return [];
	}
	return (data ?? []) as VisibleRow[];
}

export async function listNews(now: Date = new Date()): Promise<NewsCard[]> {
	const rows = await selectVisible('news', now);
	return rows.map(toCard);
}

export async function getNews(slug: string, now: Date = new Date()): Promise<NewsArticle | null> {
	const rows = await selectVisible('news', now);
	const row = rows.find((item) => item.slug === slug);
	return row ? toArticle(row) : null;
}

export async function getGuide(slug: string, now: Date = new Date()): Promise<GuidePage | null> {
	const rows = await selectVisible('guide', now);
	const row = rows.find((item) => item.slug === slug);
	return row ? toGuide(row) : null;
}

export async function listGuides(
	now: Date = new Date()
): Promise<{ slug: string; date: string }[]> {
	const rows = await selectVisible('guide', now);
	return rows.map((row) => ({ slug: row.slug, date: calendarDate(row.publish_at) }));
}
