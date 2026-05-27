/**
 * Scripture data — TypeScript types and book metadata.
 *
 * ─── Source of truth ──────────────────────────────────────────────
 * The canonical scripture corpus lives in the FLUTTER APP at
 *   /Users/muse/Desktop/active/seminary_sidekick/lib/data/scriptures_data.dart
 *
 * `src/lib/data/doctrinalMastery.json` is a GENERATED port from that
 * Dart source. Do not hand-edit the JSON. To regenerate after a Flutter-
 * side change, re-run the port script (see `src/lib/data/README.md`).
 *
 * ─── Schema ──────────────────────────────────────────────────────
 * Fields mirror the Flutter `Scripture` model exactly. Computed fields
 * from the Dart side (`words`, `wordCount`) are intentionally not
 * serialized — derive client-side: `scripture.fullText.split(/\s+/)`.
 *
 * Used by:
 *  - Quick Quiz demo (TASK-B-020)
 *  - Scripture Match demo (TASK-B-021)
 *  - /apps/scripture-mastery product page (TASK-B-032)
 *  - Anywhere the site renders scripture text
 */

/**
 * The four scriptural volumes recognized by the doctrinal mastery
 * program. Matches the Flutter `ScriptureBook` enum exactly.
 */
export type ScriptureBook =
	| 'oldTestament'
	| 'newTestament'
	| 'bookOfMormon'
	| 'doctrineAndCovenants';

/**
 * A single doctrinal-mastery scripture. Identical shape to the
 * Flutter `Scripture` model.
 */
export type Scripture = {
	/** Stable string id, '1' through '100'. */
	id: string;
	book: ScriptureBook;
	/** Volume within the book, e.g. "Genesis", "Moses", "D&C". */
	volume: string;
	/** Human-readable reference, e.g. "Genesis 1:26–27". */
	reference: string;
	/** Topic / nickname, e.g. "Creation of Man". */
	name: string;
	/** Memorable summary line, often a partial quotation. */
	keyPhrase: string;
	/** Full verse(s) text — used for Master tier of Scripture Builder and the demos. */
	fullText: string;
};

/**
 * Display metadata per book — labels, abbreviations, brand color tokens.
 *
 * Color tokens map to `bg-book-*` / `text-book-*` utilities from
 * `src/app.css` (THEME.md "Book colors"). Use them in any UI that
 * needs to color-code by book (filter chips, score breakdowns, etc.)
 */
export const BOOK_META: Record<
	ScriptureBook,
	{ label: string; short: string; colorVar: string; tailwindBg: string; tailwindText: string }
> = {
	oldTestament: {
		label: 'Old Testament',
		short: 'OT',
		colorVar: 'var(--color-book-ot)',
		tailwindBg: 'bg-book-ot',
		tailwindText: 'text-book-ot'
	},
	newTestament: {
		label: 'New Testament',
		short: 'NT',
		colorVar: 'var(--color-book-nt)',
		tailwindBg: 'bg-book-nt',
		tailwindText: 'text-book-nt'
	},
	bookOfMormon: {
		label: 'Book of Mormon',
		short: 'BoM',
		colorVar: 'var(--color-book-bom)',
		tailwindBg: 'bg-book-bom',
		tailwindText: 'text-book-bom'
	},
	doctrineAndCovenants: {
		label: 'Doctrine & Covenants',
		short: 'D&C',
		colorVar: 'var(--color-book-dc)',
		tailwindBg: 'bg-book-dc',
		tailwindText: 'text-book-dc'
	}
};

/** Canonical ordering for UIs that want a fixed book sequence. */
export const BOOK_ORDER: ScriptureBook[] = [
	'oldTestament',
	'newTestament',
	'bookOfMormon',
	'doctrineAndCovenants'
];
