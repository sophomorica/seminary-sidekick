/**
 * Published posts for server loads: .svx posts merged with live Supabase rows.
 *
 * Used by:
 *  - src/routes/+page.server.ts             (homepage NewsPreview)
 *  - src/routes/news/+page.server.ts        (index listing)
 *  - src/routes/news/[slug]/+page.server.ts (remote post body)
 *  - src/routes/news/rss.xml/+server.ts
 *  - src/routes/sitemap.xml/+server.ts
 *
 * Rows are cached per server instance for a minute so the homepage doesn't
 * wait on Supabase every request. Scheduled posts go live within pg_cron's
 * 5-minute tick plus this cache plus the routes' ISR window.
 */

import { loadPosts, type LoadedPost } from '$lib/content/loadPosts';
import type { NewsPostFrontmatter } from '$lib/content/schema';
import {
	fetchLivePosts,
	mergePosts,
	rowToDetail,
	rowToSummary,
	type PostRow,
	type RemotePostDetail
} from '$lib/content/remotePosts';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$lib/config/supabase';

const CACHE_MS = 60_000;

let cache: { at: number; rows: PostRow[] } | null = null;

async function liveRows(): Promise<PostRow[]> {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.rows;
	const rows = await fetchLivePosts({ url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY });
	cache = { at: Date.now(), rows };
	return rows;
}

/** Frontmatter only — LoadedPost carries a component, which can't cross a server load. */
function toSummary(post: LoadedPost): NewsPostFrontmatter {
	const { title, slug, date, excerpt, tags, cover, author, draft } = post;
	return { title, slug, date, excerpt, tags, cover, author, draft };
}

/** Every published post (.svx + Supabase), newest first. */
export async function listPublishedPosts(): Promise<NewsPostFrontmatter[]> {
	const rows = await liveRows();
	return mergePosts(loadPosts().map(toSummary), rows.map(rowToSummary));
}

/** A live Supabase post by slug, rendered, or null. Does not look at .svx posts. */
export async function getRemotePost(slug: string): Promise<RemotePostDetail | null> {
	const row = (await liveRows()).find((r) => r.slug === slug);
	return row ? rowToDetail(row) : null;
}
