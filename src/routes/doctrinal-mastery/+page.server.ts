import type { Config } from '@sveltejs/adapter-vercel';
import { error } from '@sveltejs/kit';
import { DOCTRINAL_MASTERY_GUIDE } from '$lib/config/guides';
import { getRemotePost } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 300 } };

/** The guide's words come from its live posts row; no live row means 404. */
export const load: PageServerLoad = async () => {
	const guide = await getRemotePost(DOCTRINAL_MASTERY_GUIDE.slug);
	if (!guide) throw error(404, 'Guide not found');
	return { title: guide.title, summary: guide.excerpt, html: guide.html };
};
