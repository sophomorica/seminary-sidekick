/**
 * The posts table itself, on PGLite. No DATABASE_URL and no network.
 * Unpublished and future rows stay out of the query and out of an anon select.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { expect, test } from '@playwright/test';
import { VISIBLE_POSTS_SQL } from '../src/lib/content/visiblePostsSql';

const REVIEW = 'a-10-minute-weekly-scripture-review-you-can-do-at-home';
const GUIDE = 'doctrinal-mastery';

async function database() {
	const db = new PGlite();
	const root = process.cwd();
	await db.exec(
		readFileSync(
			join(root, 'supabase/migrations/20261029160000_posts_content_model.sql'),
			'utf8'
		)
	);
	await db.exec(readFileSync(join(root, 'supabase/seed/20261029_posts_content.sql'), 'utf8'));
	await db.exec(`
		insert into public.posts (slug, kind, title, description, body_md, publish_at, status)
		values
			('hidden-draft', 'news', 'Hidden draft', 'Nope.', 'Draft.', '2026-01-01 12:00:00+00', 'draft'),
			('hidden-future', 'news', 'Hidden future', 'Nope.', 'Later.', '2099-01-01 12:00:00+00', 'published'),
			('hidden-guide', 'guide', 'Hidden guide', 'Nope.', 'Later.', '2099-01-01 12:00:00+00', 'published')
	`);
	return db;
}

async function slugs(db: PGlite, kind: 'news' | 'guide', now: string) {
	const result = await db.query<{ slug: string }>(VISIBLE_POSTS_SQL, [kind, now]);
	return result.rows.map((row) => row.slug);
}

test.describe('posts table', () => {
	test('a future published row and a draft stay hidden, including from anon', async () => {
		const db = await database();
		const before = await slugs(db, 'news', '2026-10-24T15:00:00Z');
		expect(before).not.toContain(REVIEW);
		expect(before).not.toContain('hidden-draft');
		expect(before).not.toContain('hidden-future');
		expect(before).toContain('class-play-steadier-on-iphone-1-0-11');

		const guidesBefore = await slugs(db, 'guide', '2026-10-24T15:00:00Z');
		expect(guidesBefore).not.toContain(GUIDE);
		expect(guidesBefore).not.toContain('hidden-guide');

		const morning = await slugs(db, 'news', '2026-10-27T11:30:00Z');
		expect(morning).not.toContain(REVIEW);
		expect(await slugs(db, 'guide', '2026-10-27T11:30:00Z')).toContain(GUIDE);

		const after = await slugs(db, 'news', '2026-10-27T13:00:00Z');
		expect(after).toContain(REVIEW);
		expect(after).not.toContain(GUIDE);
		expect(after).not.toContain('hidden-future');

		await db.exec('set role anon');
		const visible = await db.query<{ slug: string }>('select slug from public.posts');
		const anonSlugs = visible.rows.map((row) => row.slug);
		expect(anonSlugs).toContain(REVIEW);
		expect(anonSlugs).toContain(GUIDE);
		expect(anonSlugs).not.toContain('hidden-draft');
		expect(anonSlugs).not.toContain('hidden-future');
		expect(anonSlugs).not.toContain('hidden-guide');
		await db.close();
	});

	test('anon cannot insert', async () => {
		const db = await database();
		await db.exec('set role anon');
		await expect(
			db.exec(
				`insert into public.posts (slug, kind, title, description, publish_at, status)
				 values ('nope', 'news', 'Nope', 'Nope.', now(), 'published')`
			)
		).rejects.toThrow();
		await db.close();
	});
});
