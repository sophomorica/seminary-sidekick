/**
 * Teacher printout catalog — every doctrinal-mastery verse in the app bank.
 *
 * Verses come from `$lib/data/scriptures` (the Flutter DM port). Do not
 * invent wording. Do not pull Facebook/catalog copy.
 */

import { ALL_SCRIPTURES, getScripture } from '$lib/data/scriptures';
import { BOOK_META, BOOK_ORDER, type Scripture, type ScriptureBook } from '$lib/data/types';
import { buildTargetChunks, type TapDifficulty } from './chunking';

export const PRINTOUT_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type PrintoutLevel = (typeof PRINTOUT_LEVELS)[number];

export type PrintoutVerse = {
	slug: string;
	scriptureId: string;
};

/** Patrick-signed-off proof verse — static PDFs only. Page default is this week. */
export const DEFAULT_PRINTOUT_SLUG = '2-nephi-2-25';

/** Longest DM passage in the app bank — US Letter fit proof. */
export const LONG_PRINTOUT_SLUG = 'exodus-20-3-17';

/** Slugs that have a ready file under `static/printouts/`. */
const STATIC_PDF_SLUGS = new Set<string>([DEFAULT_PRINTOUT_SLUG]);

export function scriptureSlug(reference: string): string {
	return reference
		.toLowerCase()
		.replace(/&/g, 'and')
		.replace(/[–—−]/g, '-')
		.replace(/[:.]/g, '-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function buildPrintoutVerses(): PrintoutVerse[] {
	const seen = new Set<string>();
	const verses: PrintoutVerse[] = [];
	for (const scripture of ALL_SCRIPTURES) {
		let slug = scriptureSlug(scripture.reference);
		if (seen.has(slug)) slug = `${slug}-${scripture.id}`;
		seen.add(slug);
		verses.push({ slug, scriptureId: scripture.id });
	}
	return verses;
}

export const PRINTOUT_VERSES: readonly PrintoutVerse[] = buildPrintoutVerses();
export const PRINTOUT_VERSE_COUNT = PRINTOUT_VERSES.length;

if (PRINTOUT_VERSE_COUNT !== ALL_SCRIPTURES.length) {
	throw new Error('Printout catalog must include every doctrinal-mastery verse');
}

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

export function printoutHasStaticPdf(slug: string): boolean {
	return STATIC_PDF_SLUGS.has(slug);
}

export function printoutPdfPath(slug: string, level: PrintoutLevel): string {
	return `/printouts/${slug}-${level}.pdf`;
}

export function printoutSheetPath(slug: string, level: PrintoutLevel): string {
	return `/teachers/printouts/${slug}/${level}`;
}

/** Query key for the library picker — keeps the chosen verse across sheet trips. */
export const PRINTOUT_VERSE_PARAM = 'verse';

export function resolvePrintoutSlug(slug: string | null | undefined): string {
	if (slug && getPrintoutVerse(slug)) return slug;
	return DEFAULT_PRINTOUT_SLUG;
}

export function printoutSlugFromSearch(searchParams: URLSearchParams): string {
	return resolvePrintoutSlug(searchParams.get(PRINTOUT_VERSE_PARAM));
}

/** Library picker URL. Always include the verse so returning from a sheet cannot snap to 2 Nephi. */
export function printoutLibraryPath(slug: string): string {
	return `/teachers/printouts?${PRINTOUT_VERSE_PARAM}=${resolvePrintoutSlug(slug)}`;
}

/** True for the print-ready sheet routes (chrome hidden; US Letter). */
export function isPrintSheetPath(pathname: string): boolean {
	return /^\/teachers\/printouts\/[^/]+\/[^/]+\/?$/.test(pathname);
}

export type PrintoutBookGroup = {
	book: ScriptureBook;
	label: string;
	verses: PrintoutVerse[];
};

export function printoutVersesByBook(): PrintoutBookGroup[] {
	return BOOK_ORDER.map((book) => ({
		book,
		label: BOOK_META[book].label,
		verses: PRINTOUT_VERSES.filter((verse) => getScripture(verse.scriptureId)?.book === book)
	})).filter((group) => group.verses.length > 0);
}

/**
 * Tile size so a long verse still fits US Letter in two columns.
 * Short verses keep the compact size Patrick signed off.
 */
export function tileSheetDensity(tileCount: number): {
	list: string;
	tile: string;
	text: string;
} {
	if (tileCount <= 10) {
		return {
			list: 'grid grid-cols-2 gap-2 print:grid-cols-2',
			tile: 'flex min-h-[0.62in] items-center rounded-2xl border-2 border-dashed border-outline bg-surface-container-low px-3 py-2 print:min-h-[0.58in]',
			text: 'font-serif text-[1.15rem] leading-snug text-on-surface italic md:text-[1.25rem] print:text-[16pt]'
		};
	}
	if (tileCount <= 20) {
		return {
			list: 'grid grid-cols-2 gap-1.5 print:grid-cols-2',
			tile: 'flex min-h-[0.48in] items-center rounded-2xl border-2 border-dashed border-outline bg-surface-container-low px-3 py-1.5 print:min-h-[0.44in]',
			text: 'font-serif text-[1.05rem] leading-snug text-on-surface italic print:text-[13pt]'
		};
	}
	if (tileCount <= 32) {
		return {
			list: 'grid grid-cols-2 gap-1 print:grid-cols-2',
			tile: 'flex min-h-[0.38in] items-center rounded-xl border-2 border-dashed border-outline bg-surface-container-low px-2.5 py-1 print:min-h-[0.34in]',
			text: 'font-serif text-[0.95rem] leading-snug text-on-surface italic print:text-[11pt]'
		};
	}
	return {
		list: 'grid grid-cols-2 gap-1 print:grid-cols-2',
		tile: 'flex min-h-[0.30in] items-center rounded-xl border border-dashed border-outline bg-surface-container-low px-2 py-0.5 print:min-h-[0.28in]',
		text: 'font-serif text-[0.85rem] leading-snug text-on-surface italic print:text-[10pt]'
	};
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
		blurb: 'Compact 2-column mixed cut-out tiles. Same adaptive beginner chunks as the app.',
		action: 'Print tiles'
	},
	intermediate: {
		label: 'Intermediate',
		blurb: 'Compact 2-column mixed cut-out tiles. Same adaptive intermediate split as the app.',
		action: 'Print tiles'
	},
	advanced: {
		label: 'Advanced',
		blurb: 'First-letter hints for each word — same as Advanced in the app. Not cutouts.',
		action: 'Print hints'
	}
};
