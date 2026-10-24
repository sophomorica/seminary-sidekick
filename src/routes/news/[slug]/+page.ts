import { error } from '@sveltejs/kit';
import { loadPost } from '$lib/content/loadPosts';
import type { PageLoad } from './$types';

/**
 * Universal load: .svx posts carry a Svelte component, which can't be
 * serialized out of +page.server.ts, so the component is resolved here.
 * Supabase posts arrive from the server load as rendered HTML.
 */
export const load: PageLoad = ({ params, data }) => {
	const local = loadPost(params.slug);
	if (local) return { post: local, component: local.component, html: null, coverAlt: '' };

	if (data.remote) {
		const { html, coverAlt, ...post } = data.remote;
		return { post, component: null, html, coverAlt };
	}

	throw error(404, `No post found at /news/${params.slug}`);
};
