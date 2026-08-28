import { error } from '@sveltejs/kit';
import { PRINTABLE_GRABBERS, getGrabber } from '$lib/teachers/mixer';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return PRINTABLE_GRABBERS.map((grabber) => ({ slug: grabber.slug }));
};

export const load: PageLoad = ({ params }) => {
	const grabber = getGrabber(params.slug);
	if (!grabber || !grabber.printHref) {
		throw error(404, 'That grabber does not have a print sheet');
	}

	return { grabber };
};
