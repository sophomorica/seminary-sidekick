import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import {
	PRINTOUT_LEVELS,
	PRINTOUT_VERSES,
	isPrintoutLevel,
	loadPrintoutScripture
} from '$lib/scripture-builder/printouts';
import { buildPrintoutSheet } from '$lib/scripture-builder/printoutSheet';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return PRINTOUT_VERSES.flatMap((verse) =>
		PRINTOUT_LEVELS.map((level) => ({ slug: verse.slug, level }))
	);
};

export const load: PageLoad = ({ params }) => {
	if (!isPrintoutLevel(params.level)) {
		throw error(404, 'Unknown printout level');
	}

	const scripture = loadPrintoutScripture(params.slug);
	if (!scripture) {
		throw error(404, 'That scripture is not in the printout library');
	}

	return {
		slug: params.slug,
		sheet: buildPrintoutSheet(scripture, params.level)
	};
};
