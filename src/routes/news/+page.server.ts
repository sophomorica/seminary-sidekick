import { contentCache } from '$lib/server/contentCache';
import { listNews } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders(contentCache);
	return { posts: await listNews() };
};
