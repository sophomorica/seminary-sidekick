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

/** Canonical app chunks in verse order — never print these as a numbered sequence. */
export function tilesFor(scripture: Scripture, difficulty: TapDifficulty): string[] {
	return buildTargetChunks(scripture.fullText, difficulty);
}

/**
 * Print/display order for cut-out tiles. Same phrases as the app, mixed so
 * the sheet does not give the verse order away. Deterministic per scripture
 * + level so the PDF and the print page match.
 */
export function scrambledTilesFor(scripture: Scripture, difficulty: TapDifficulty): string[] {
	return scrambleTiles(tilesFor(scripture, difficulty), `${scripture.id}:${difficulty}`);
}

function seedFrom(text: string): number {
	let hash = 2166136261;
	for (let i = 0; i < text.length; i++) {
		hash ^= text.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function mulberry32(seed: number): () => number {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function scrambleTiles(tiles: readonly string[], seed: string): string[] {
	const result = [...tiles];
	const random = mulberry32(seedFrom(seed));
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	if (result.length > 1 && result.every((tile, index) => tile === tiles[index])) {
		result.push(result.shift() as string);
	}
	return result;
}

export const LEVEL_COPY: Record<PrintoutLevel, { label: string; blurb: string; action: string }> = {
	beginner: {
		label: 'Beginner',
		blurb: 'Large mixed cut-out phrase tiles. Same 3-word beginner chunks as the app.',
		action: 'Print tiles'
	},
	intermediate: {
		label: 'Intermediate',
		blurb: 'Large mixed cut-out tiles. Same 2-word intermediate split as the app.',
		action: 'Print tiles'
	},
	advanced: {
		label: 'Advanced',
		blurb: 'First-letter hints for each word — same as Advanced in the app. Not cutouts.',
		action: 'Print hints'
	}
};
