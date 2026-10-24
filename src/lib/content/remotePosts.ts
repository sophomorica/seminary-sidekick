/**
 * Remote posts — rows from the Supabase `public.posts` table.
 *
 * Content posts publish on a schedule from Supabase instead of shipping as
 * .svx files in PRs (see supabase/migrations/*_posts.sql). This module is
 * pure: no SvelteKit `$env` / `$lib/server` imports, so Playwright can
 * import it directly with a mocked fetch (tests/remote-posts.spec.ts).
 *
 * Used by $lib/server/posts.ts, which adds env + caching on top.
 */

import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import type { NewsPostFrontmatter } from './schema';

export type PostStatus = 'draft' | 'scheduled' | 'published';

/** Shape of a `public.posts` row, as selected by the site. */
export type PostRow = {
	slug: string;
	title: string;
	summary: string;
	body_md: string;
	hero_image_url: string | null;
	hero_image_alt: string | null;
	tags: string[] | null;
	status: PostStatus;
	publish_at: string | null;
	published_at: string | null;
};

/** A remote post rendered for /news/[slug]. */
export type RemotePostDetail = NewsPostFrontmatter & {
	html: string;
	coverAlt: string;
};

const COLUMNS =
	'slug, title, summary, body_md, hero_image_url, hero_image_alt, tags, status, publish_at, published_at';

/** Posts are dated in the site's home timezone so a 6am MDT publish isn't "yesterday". */
const POST_TIMEZONE = 'America/Denver';

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
	timeZone: POST_TIMEZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
});

/**
 * Is this row visible to the public right now? RLS already enforces this for
 * the anon key; the site checks again so a loosened policy can't leak drafts.
 */
export function isLive(row: PostRow, now: Date = new Date()): boolean {
	if (row.status !== 'published' || !row.published_at) return false;
	const publishedAt = new Date(row.published_at);
	return !Number.isNaN(publishedAt.getTime()) && publishedAt.getTime() <= now.getTime();
}

/** Row → the same frontmatter shape PostCard / RSS / sitemap already use. */
export function rowToSummary(row: PostRow): NewsPostFrontmatter {
	return {
		title: row.title,
		slug: row.slug,
		date: dateFormatter.format(new Date(row.published_at ?? Date.now())),
		excerpt: row.summary,
		tags: row.tags ?? [],
		cover: row.hero_image_url ?? undefined,
		author: 'Patrick',
		draft: false
	};
}

/**
 * Row → rendered post. body_md is trusted: only the service role can write
 * the table (no anon/authenticated write grants or policies).
 */
export function rowToDetail(row: PostRow): RemotePostDetail {
	return {
		...rowToSummary(row),
		html: marked.parse(row.body_md, { async: false }),
		coverAlt: row.hero_image_alt ?? ''
	};
}

export type FetchLivePostsOptions = {
	url: string;
	anonKey: string;
	fetch?: typeof globalThis.fetch;
	now?: Date;
	timeoutMs?: number;
};

/**
 * Fetch live rows with the anon key. Never throws: an unconfigured,
 * unreachable, or erroring Supabase returns [] so pages fall back to .svx.
 */
export async function fetchLivePosts({
	url,
	anonKey,
	fetch = globalThis.fetch,
	now = new Date(),
	timeoutMs = 2500
}: FetchLivePostsOptions): Promise<PostRow[]> {
	if (!url || !anonKey) return [];

	try {
		const client = createClient(url, anonKey, {
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
			global: { fetch }
		});
		const { data, error } = await client
			.from('posts')
			.select(COLUMNS)
			.eq('status', 'published')
			.lte('published_at', now.toISOString())
			.order('published_at', { ascending: false })
			.abortSignal(AbortSignal.timeout(timeoutMs));

		if (error) {
			console.warn('[remotePosts] Supabase query failed:', error.message);
			return [];
		}
		return ((data ?? []) as PostRow[]).filter((row) => isLive(row, now));
	} catch (err) {
		console.warn('[remotePosts] Supabase unreachable:', (err as Error).message);
		return [];
	}
}

/**
 * Merge .svx posts with remote posts, newest first. On a slug collision the
 * .svx post wins, so a row can never shadow a page that ships in the repo.
 */
export function mergePosts(
	local: NewsPostFrontmatter[],
	remote: NewsPostFrontmatter[]
): NewsPostFrontmatter[] {
	const localSlugs = new Set(local.map((p) => p.slug));
	return [...local, ...remote.filter((p) => !localSlugs.has(p.slug))].sort((a, b) =>
		b.date.localeCompare(a.date)
	);
}
