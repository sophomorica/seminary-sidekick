/**
 * Teacher printout catalog — proof slice, not the factory for all 100.
 *
 * Only verses listed here are printable. 2 Nephi 2:25 is the first
 * public slice because it is already featured on the site.
 */

import { getScripture } from '$lib/data/scriptures';
import type { Scripture } from '$lib/data/types';
import { buildTargetChunks, type TapDifficulty } from './chunking';

export const PRINTOUT_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type PrintoutLevel = (typeof PRINTOUT_LEVELS)[number];

export type PrintoutVerse = {
	slug: string;
	scriptureId: string;
};

export const PRINTOUT_VERSES: readonly PrintoutVerse[] = [
	{ slug: '2-nephi-2-25', scriptureId: '50' }
];

export function isPrintoutLevel(value: string): value is PrintoutLevel {
	return (PRINTOUT_LEVELS as readonly string[]).includes(value);
}

export function getPrintoutVerse(slug: string): PrintoutVerse | null {
	return PRINTOUT_VERSES.find((verse) => verse.slug === slug) ?? null;
}

export function loadPrintoutScripture(slug: string): Scripture | null {
	const entry = getPrintoutVerse(slug);
	if (!entry) return null;
	return getScripture(entry.scriptureId);
}

export function printoutPdfPath(slug: string, level: PrintoutLevel): string {
	return `/printouts/${slug}-${level}.pdf`;
}

export function printoutSheetPath(slug: string, level: PrintoutLevel): string {
	return `/teachers/printouts/${slug}/${level}`;
}

/** True for the print-ready sheet routes (chrome hidden; US Letter). */
export function isPrintSheetPath(pathname: string): boolean {
	return /^\/teachers\/printouts\/[^/]+\/[^/]+\/?$/.test(pathname);
}

export function tilesFor(scripture: Scripture, difficulty: TapDifficulty): string[] {
	return buildTargetChunks(scripture.fullText, difficulty);
}

export const LEVEL_COPY: Record<PrintoutLevel, { label: string; blurb: string; action: string }> = {
	beginner: {
		label: 'Beginner',
		blurb: 'Large cut-out phrase tiles. Same 3-word beginner chunks as the app.',
		action: 'Print tiles'
	},
	intermediate: {
		label: 'Intermediate',
		blurb: 'Large cut-out tiles. Same 2-word intermediate split as the app.',
		action: 'Print tiles'
	},
	advanced: {
		label: 'Advanced',
		blurb: 'Write-it-down sheet — large reference and generous blank lines. Not cutouts.',
		action: 'Print sheet'
	}
};
