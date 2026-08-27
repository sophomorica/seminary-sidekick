import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import {
	PRINTOUT_LEVELS,
	PRINTOUT_VERSES,
	isPrintoutLevel,
	loadPrintoutScripture,
	tilesFor
} from '$lib/scripture-builder/printouts';

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
		throw error(404, 'That scripture is not in this printout slice yet');
	}

	const chunks = params.level === 'advanced' ? [] : tilesFor(scripture, params.level);

	return {
		slug: params.slug,
		level: params.level,
		scripture,
		chunks
	};
};
