import { error } from '@sveltejs/kit';
import { contentCache } from '$lib/server/contentCache';
import { getNews } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders(contentCache);
	const post = await getNews(params.slug);
	if (!post) error(404, `No post found at /news/${params.slug}`);
	return { post };
};
