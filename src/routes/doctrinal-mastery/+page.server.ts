import { error } from '@sveltejs/kit';
import { DOCTRINAL_MASTERY_GUIDE } from '$lib/config/guides';
import { contentCache } from '$lib/server/contentCache';
import { getGuide } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders(contentCache);
	const guide = await getGuide(DOCTRINAL_MASTERY_GUIDE.slug);
	if (!guide) error(404, 'Guide not found');
	return { title: guide.title, summary: guide.excerpt, html: guide.html };
};
