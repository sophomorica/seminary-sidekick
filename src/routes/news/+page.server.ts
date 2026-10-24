import type { Config } from '@sveltejs/adapter-vercel';
import { listPublishedPosts } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

// Request-time (not prerendered) so scheduled Supabase posts appear without a
// deploy. ISR keeps it cached at the edge; 5 minutes matches the pg_cron tick.
export const prerender = false;
export const config: Config = { isr: { expiration: 300 } };

export const load: PageServerLoad = async () => {
	// .svx + live Supabase posts, sorted desc by date. Falls back to .svx only
	// when Supabase is unconfigured or unreachable.
	const posts = await listPublishedPosts();
	return { posts };
};
