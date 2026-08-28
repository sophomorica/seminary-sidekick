/**
 * Search + book facet over the printout catalog.
 * Matches reference, name, key phrase, volume, and keywords in the verse text.
 */

import { getScripture } from '$lib/data/scriptures';
import { BOOK_META, type Scripture, type ScriptureBook } from '$lib/data/types';
import { PRINTOUT_VERSES } from './printouts';

export type FinderHit = {
	slug: string;
	scripture: Scripture;
};

export type FinderBook = ScriptureBook | 'all';

export function normalizeFinderQuery(text: string): string {
	return text
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[–—−:.,;]/g, ' ')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');
}

function haystack(scripture: Scripture, slug: string): string {
	return normalizeFinderQuery(
		[
			scripture.reference,
			scripture.name,
			scripture.keyPhrase,
			scripture.fullText,
			scripture.volume,
			slug,
			BOOK_META[scripture.book].label,
			BOOK_META[scripture.book].short
		].join(' ')
	);
}

export function findPrintoutVerses(query: string, book: FinderBook = 'all'): FinderHit[] {
	const tokens = normalizeFinderQuery(query).split(' ').filter(Boolean);
	const hits: FinderHit[] = [];

	for (const verse of PRINTOUT_VERSES) {
		const scripture = getScripture(verse.scriptureId);
		if (!scripture) continue;
		if (book !== 'all' && scripture.book !== book) continue;
		const blob = haystack(scripture, verse.slug);
		if (tokens.length === 0 || tokens.every((token) => blob.includes(token))) {
			hits.push({ slug: verse.slug, scripture });
		}
	}

	return hits;
}
