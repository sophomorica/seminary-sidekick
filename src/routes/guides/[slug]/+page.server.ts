import { error } from '@sveltejs/kit';
import { contentCache } from '$lib/server/contentCache';
import { getGuide } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;

/** Later guides publish at /guides/<slug> without a new route file. */
export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders(contentCache);
	const guide = await getGuide(params.slug);
	if (!guide) error(404, 'Guide not found');
	return { guide };
};
