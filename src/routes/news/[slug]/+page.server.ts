import type { Config } from '@sveltejs/adapter-vercel';
import { loadPost } from '$lib/content/loadPosts';
import { getRemotePost } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 300 } };

/**
 * .svx posts win on a slug collision and render as components in +page.ts,
 * so only Supabase posts need the server here. An unknown slug returns
 * `remote: null` and +page.ts throws the 404.
 */
export const load: PageServerLoad = async ({ params }) => {
	if (loadPost(params.slug)) return { remote: null };
	return { remote: await getRemotePost(params.slug) };
};
