/**
 * Scripture data types for the ported legacy data (TASK-B-080).
 *
 * Source of truth:
 *   - `src/lib/data/passages.json` — 101 doctrinal mastery scriptures (the main dataset)
 *   - `src/lib/data/doctrinalMastery.json` — small legacy topic list (~5 entries)
 *
 * Data recovered via git show from pre-deletion commit in history (public/data/*).
 * passages.json shape: object with 4 snake_case book keys, each an array of entries.
 * Each Passage has short `passage` (for quizzes) + optional `fullPassage` (many are "TODO" in this snapshot).
 *
 * Used by (future):
 *  - Quick Quiz demo (TASK-B-020)
 *  - Scripture Match demo (TASK-B-021)
 *  - /apps/scripture-mastery product page (TASK-B-032)
 *  - Any scripture rendering
 *
 * Import pattern in SvelteKit:
 *   import passages from './passages.json' assert { type: 'json' };
 *   const data = passages as PassagesByBook;
 */

export interface Passage {
	id: string;
	name: string;
	reference: string;
	passage: string;
	fullPassage?: string;
}

export interface PassagesByBook {
	old_testament: Passage[];
	new_testament: Passage[];
	book_of_mormon: Passage[];
	doctrine_and_covenants: Passage[];
}

export interface DoctrinalMasteryTopic {
	id: number;
	name: string;
	reference: string;
	passage: string;
}

export interface DoctrinalMasteryByBook {
	'Old Testament': DoctrinalMasteryTopic[];
	'New Testament': DoctrinalMasteryTopic[];
	'Book of Mormon': DoctrinalMasteryTopic[];
	'Doctrine and Covenants': DoctrinalMasteryTopic[];
}

// Canonical book key lists (derived directly from the JSON shapes)
export const PASSAGE_BOOK_KEYS = [
	'old_testament',
	'new_testament',
	'book_of_mormon',
	'doctrine_and_covenants'
] as const;

export type PassageBookKey = (typeof PASSAGE_BOOK_KEYS)[number];

export const DOCTRINAL_MASTERY_BOOK_KEYS = [
	'Old Testament',
	'New Testament',
	'Book of Mormon',
	'Doctrine and Covenants'
] as const;

export type DoctrinalMasteryBookKey = (typeof DOCTRINAL_MASTERY_BOOK_KEYS)[number];

/**
 * Display metadata per book (snake_case keys to match passages.json).
 * Color tokens map to `bg-book-*` / `text-book-*` from src/app.css (per THEME.md).
 */
export const BOOK_META: Record<
	PassageBookKey,
	{ label: string; short: string; colorVar: string; tailwindBg: string; tailwindText: string }
> = {
	old_testament: {
		label: 'Old Testament',
		short: 'OT',
		colorVar: 'var(--color-book-ot)',
		tailwindBg: 'bg-book-ot',
		tailwindText: 'text-book-ot'
	},
	new_testament: {
		label: 'New Testament',
		short: 'NT',
		colorVar: 'var(--color-book-nt)',
		tailwindBg: 'bg-book-nt',
		tailwindText: 'text-book-nt'
	},
	book_of_mormon: {
		label: 'Book of Mormon',
		short: 'BoM',
		colorVar: 'var(--color-book-bom)',
		tailwindBg: 'bg-book-bom',
		tailwindText: 'text-book-bom'
	},
	doctrine_and_covenants: {
		label: 'Doctrine & Covenants',
		short: 'D&C',
		colorVar: 'var(--color-book-dc)',
		tailwindBg: 'bg-book-dc',
		tailwindText: 'text-book-dc'
	}
};

/** Canonical ordering matching the legacy data grouping. */
export const BOOK_ORDER: PassageBookKey[] = [
	'old_testament',
	'new_testament',
	'book_of_mormon',
	'doctrine_and_covenants'
];
