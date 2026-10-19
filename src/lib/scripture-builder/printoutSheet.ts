import type { Scripture } from '$lib/data/types';
import { advancedHintText } from './advancedHints';
import type { TapDifficulty } from './chunking';
import { LEVEL_COPY, scrambledTilesFor, type PrintoutLevel } from './printouts';

export const GROUP_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const;
export type GroupLetter = (typeof GROUP_LETTERS)[number];
export const GROUP_LIMIT = GROUP_LETTERS.length;

/** A real tile, or null for a scrap cell (odd count / short last page). Scraps never get a letter. */
export type TileCell = { readonly phrase: string } | null;
export type TileRow = readonly [TileCell, TileCell];
/** Top row first. length === geometry.rowHeightsIn.length on every page. */
export type TilePage = readonly TileRow[];

export type SheetGeometry = {
	readonly pageWidthIn: number;
	readonly pageHeightIn: number;
	readonly headerIn: number;
	readonly edgeSafeIn: number;
	readonly textWidthIn: number;
	readonly fontPt: number;
	readonly leading: number;
	readonly trackingEm: number;
};
export type TileGeometry = SheetGeometry & {
	/**
	 * Same on every page of every group. Last entry includes the bottom edge-safe band,
	 * so the rows sum to pageHeightIn − headerIn and the bottom row ends at the paper edge.
	 */
	readonly rowHeightsIn: readonly number[];
};
export type HintGeometry = SheetGeometry & { readonly bodyHeightIn: number };

type SheetIdentity = {
	readonly reference: string;
	readonly levelLabel: string;
};

export type TileSheet = SheetIdentity & {
	readonly kind: 'tiles';
	readonly level: TapDifficulty;
	readonly tileCount: number;
	/** Pages for ONE group. All groups print exactly these. */
	readonly pages: readonly TilePage[];
	readonly geometry: TileGeometry;
};

export type HintSheet = SheetIdentity & {
	readonly kind: 'hints';
	readonly level: 'advanced';
	readonly hintLine: string;
	readonly geometry: HintGeometry;
};

export type PrintoutSheet = TileSheet | HintSheet;

/** Classes for the face MERRIWEATHER_400_EM was measured from. Phrase and hint text must use exactly this. */
export const SHEET_TEXT_CLASS = 'font-serif font-normal not-italic';

export function buildPrintoutSheet(scripture: Scripture, level: PrintoutLevel): PrintoutSheet {
	const identity = { reference: scripture.reference, levelLabel: LEVEL_COPY[level].label };
	if (level === 'advanced') {
		const hintLine = advancedHintText(scripture.fullText);
		const geometry = layoutHints(hintLine) ?? unfit(scripture, level);
		return { kind: 'hints', level, ...identity, hintLine, geometry };
	}
	const phrases = scrambledTilesFor(scripture, level);
	const layout = layoutTiles(phrases) ?? unfit(scripture, level);
	return { kind: 'tiles', level, ...identity, tileCount: phrases.length, ...layout };
}

function unfit(scripture: Scripture, level: PrintoutLevel): never {
	throw new Error(
		`${scripture.reference} ${level} does not fit US Letter at ${TYPE_FLOOR_PT}pt or larger`
	);
}

export function groupLetters(count: number): GroupLetter[] {
	const n = Math.min(GROUP_LIMIT, Math.max(1, Math.trunc(count) || 1));
	return GROUP_LETTERS.slice(0, n);
}

/** Must match `@page scripture-sheet { size: letter; margin: 0 }` in app.css. */
const LETTER = { widthIn: 8.5, heightIn: 11 } as const;
const PT_PER_IN = 72;
/** Printer dead zones are 0.125–0.25in; nothing inks closer than this to a paper edge. */
const EDGE_SAFE_IN = 0.35;
/** 0.35in safe band + 0.65in of eyebrow / reference / instruction. */
const HEADER_IN = 1.0;
/** Top band holds the 8pt group letter; bottom mirrors it so text stays centered. */
const TILE_INSET_Y_IN = 0.16;
const TYPE_FLOOR_PT = 14;
const TYPE_CAP_PT = 40;
const TYPE_STEP_PT = 0.5;
const TILE_TEXT: TextSpec = { leading: 1.2, trackingEm: 0 };
/** Tracking keeps runs of underscores countable. */
const HINT_TEXT: TextSpec = { leading: 1.6, trackingEm: 0.06 };
/** Summed advances measured 0.977–1.059× of Chrome's measureText over every bank phrase. */
const WIDTH_HEADROOM = 1.04;
const UNKNOWN_GLYPH_EM = 1.0;

/**
 * Advance widths (em) for every glyph in the doctrinal-mastery bank plus `_` and curly
 * punctuation, measured in Chromium from @fontsource/merriweather latin-400-normal.
 * Re-measure if SHEET_TEXT_CLASS or the font changes.
 */
const MERRIWEATHER_400_EM: Readonly<Record<string, number>> = {
	' ': 0.24,
	'!': 0.29,
	"'": 0.3,
	'(': 0.43,
	')': 0.43,
	',': 0.25,
	'-': 0.58,
	'.': 0.25,
	':': 0.26,
	';': 0.26,
	'?': 0.48,
	A: 0.71,
	B: 0.67,
	C: 0.65,
	D: 0.75,
	E: 0.63,
	F: 0.62,
	G: 0.72,
	H: 0.8,
	I: 0.37,
	J: 0.37,
	L: 0.62,
	M: 0.99,
	N: 0.77,
	O: 0.72,
	P: 0.64,
	R: 0.7,
	S: 0.59,
	T: 0.7,
	U: 0.74,
	V: 0.66,
	W: 1,
	Y: 0.64,
	Z: 0.65,
	'[': 0.44,
	']': 0.43,
	_: 0.5,
	a: 0.54,
	b: 0.6,
	c: 0.51,
	d: 0.6,
	e: 0.52,
	f: 0.38,
	g: 0.61,
	h: 0.66,
	i: 0.32,
	j: 0.32,
	k: 0.63,
	l: 0.31,
	m: 0.99,
	n: 0.66,
	o: 0.58,
	p: 0.61,
	q: 0.59,
	r: 0.45,
	s: 0.49,
	t: 0.39,
	u: 0.63,
	v: 0.57,
	w: 0.84,
	x: 0.59,
	y: 0.58,
	z: 0.54,
	'–': 0.79,
	'—': 1.14,
	'’': 0.28,
	'“': 0.5,
	'”': 0.5
};

type TextSpec = { readonly leading: number; readonly trackingEm: number };
type Box = { readonly widthPt: number; readonly heightPt: number };

function layoutTiles(
	phrases: readonly string[]
): { pages: TilePage[]; geometry: TileGeometry } | null {
	const textWidthIn = LETTER.widthIn / 2 - EDGE_SAFE_IN - EDGE_SAFE_IN;
	for (let pageCount = 1; pageCount <= phrases.length; pageCount++) {
		const rows = Math.ceil(Math.ceil(phrases.length / pageCount) / 2);
		const rowIn = (LETTER.heightIn - HEADER_IN - EDGE_SAFE_IN) / rows;
		const box = {
			widthPt: textWidthIn * PT_PER_IN,
			heightPt: (rowIn - 2 * TILE_INSET_Y_IN) * PT_PER_IN
		};
		const fontPt = largestFittingFont(phrases, box, TILE_TEXT);
		if (fontPt === null) continue;
		return {
			pages: splitEvenly(phrases, pageCount).map((chunk) => toRows(chunk, rows)),
			geometry: {
				pageWidthIn: LETTER.widthIn,
				pageHeightIn: LETTER.heightIn,
				headerIn: HEADER_IN,
				edgeSafeIn: EDGE_SAFE_IN,
				textWidthIn,
				fontPt,
				...TILE_TEXT,
				rowHeightsIn: [...Array<number>(rows - 1).fill(rowIn), rowIn + EDGE_SAFE_IN]
			}
		};
	}
	return null;
}

function layoutHints(hintLine: string): HintGeometry | null {
	const textWidthIn = LETTER.widthIn - 2 * EDGE_SAFE_IN;
	const bodyHeightIn = LETTER.heightIn - HEADER_IN - EDGE_SAFE_IN;
	const box = { widthPt: textWidthIn * PT_PER_IN, heightPt: bodyHeightIn * PT_PER_IN };
	const fontPt = largestFittingFont([hintLine], box, HINT_TEXT);
	if (fontPt === null) return null;
	return {
		pageWidthIn: LETTER.widthIn,
		pageHeightIn: LETTER.heightIn,
		headerIn: HEADER_IN,
		edgeSafeIn: EDGE_SAFE_IN,
		textWidthIn,
		fontPt,
		...HINT_TEXT,
		bodyHeightIn
	};
}

function largestFittingFont(blocks: readonly string[], box: Box, text: TextSpec): number | null {
	for (let fontPt = TYPE_CAP_PT; fontPt >= TYPE_FLOOR_PT; fontPt -= TYPE_STEP_PT) {
		const fits = blocks.every(
			(block) =>
				lineCount(block, fontPt, box.widthPt, text.trackingEm) * fontPt * text.leading <=
				box.heightPt
		);
		if (fits) return fontPt;
	}
	return null;
}

/** Greedy first-fit wrap at spaces, the rule Chrome uses. Infinity if one word is wider than the box. */
function lineCount(text: string, fontPt: number, widthPt: number, trackingEm: number): number {
	const spacePt = textWidthPt(' ', fontPt, trackingEm);
	let lines = 1;
	let linePt = 0;
	for (const word of text.split(/\s+/).filter(Boolean)) {
		const wordPt = textWidthPt(word, fontPt, trackingEm);
		if (wordPt > widthPt) return Infinity;
		if (linePt === 0) linePt = wordPt;
		else if (linePt + spacePt + wordPt <= widthPt) linePt += spacePt + wordPt;
		else {
			lines++;
			linePt = wordPt;
		}
	}
	return lines;
}

function textWidthPt(text: string, fontPt: number, trackingEm: number): number {
	let em = 0;
	for (const ch of text) em = em + (MERRIWEATHER_400_EM[ch] ?? UNKNOWN_GLYPH_EM) + trackingEm;
	return em * WIDTH_HEADROOM * fontPt;
}

function splitEvenly<T>(items: readonly T[], parts: number): T[][] {
	const base = Math.floor(items.length / parts);
	const extra = items.length % parts;
	const out: T[][] = [];
	let start = 0;
	for (let part = 0; part < parts; part++) {
		const size = base + (part < extra ? 1 : 0);
		out.push(items.slice(start, start + size));
		start += size;
	}
	return out;
}

function toRows(phrases: readonly string[], rows: number): TilePage {
	const cell = (index: number): TileCell =>
		index < phrases.length ? { phrase: phrases[index] } : null;
	return Array.from({ length: rows }, (_, row): TileRow => [cell(2 * row), cell(2 * row + 1)]);
}
