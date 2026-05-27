import { error } from '@sveltejs/kit';
import { loadPost, listSlugs } from '$lib/content/loadPosts';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

/**
 * Prerender entry discovery — SvelteKit calls this at build time to
 * find every concrete slug to prerender. Without this, /news/[slug]
 * would be a dynamic route and `prerender = true` would fail.
 */
export const entries: EntryGenerator = () => {
	return listSlugs().map((slug) => ({ slug }));
};

export const load: PageLoad = ({ params }) => {
	const post = loadPost(params.slug);
	if (!post) {
		throw error(404, `No post found at /news/${params.slug}`);
	}
	return { post };
};
