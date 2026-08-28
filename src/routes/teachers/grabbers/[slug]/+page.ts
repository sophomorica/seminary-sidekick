import { error } from '@sveltejs/kit';
import { GRABBER_ROUTES, getGrabber } from '$lib/teachers/mixer';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return GRABBER_ROUTES.map((grabber) => ({ slug: grabber.slug }));
};

export const load: PageLoad = ({ params }) => {
	const grabber = getGrabber(params.slug);
	if (!grabber || grabber.external) {
		throw error(404, 'That grabber is not on the mixer');
	}

	return { grabber };
};
