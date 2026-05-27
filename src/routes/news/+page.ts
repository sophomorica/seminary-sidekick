import { loadPosts } from '$lib/content/loadPosts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = () => {
	// loadPosts() returns published posts sorted desc by date (already filtered)
	const posts = loadPosts();
	return { posts };
};
