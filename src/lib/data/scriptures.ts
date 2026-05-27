/**
 * Scripture access helpers.
 *
 * Imports `doctrinalMastery.json` (the 100 doctrinal-mastery passages
 * ported from the Flutter app) and exposes typed lookup utilities.
 *
 * The JSON is import-time-loaded, so usage is purely synchronous. No
 * fetch, no network — Vite inlines the data into the bundle. ~30KB.
 */

import rawData from './doctrinalMastery.json';
import type { Scripture, ScriptureBook } from './types';

/** All 100 scriptures, in stable id order (id "1" first). */
export const ALL_SCRIPTURES: readonly Scripture[] = rawData as Scripture[];

/** Lookup by id. Returns null when the id doesn't exist (e.g., bad route param). */
export function getScripture(id: string): Scripture | null {
	return ALL_SCRIPTURES.find((s) => s.id === id) ?? null;
}

/** All scriptures in a given book, preserving original order. */
export function getScripturesByBook(book: ScriptureBook): Scripture[] {
	return ALL_SCRIPTURES.filter((s) => s.book === book);
}

/**
 * Pick `count` random scriptures, optionally limited to a single book.
 * Deterministic if you pass a seeded `pickRandom` function as `random`.
 *
 * Used by the Quick Quiz and Scripture Match demos to choose round content.
 */
export function pickRandomScriptures(
	count: number,
	options: {
		book?: ScriptureBook;
		random?: () => number;
	} = {}
): Scripture[] {
	const pool = options.book ? getScripturesByBook(options.book) : [...ALL_SCRIPTURES];
	const rand = options.random ?? Math.random;
	// Fisher–Yates partial shuffle, stop after `count` picks.
	const result: Scripture[] = [];
	const n = Math.min(count, pool.length);
	for (let i = 0; i < n; i++) {
		const j = i + Math.floor(rand() * (pool.length - i));
		[pool[i], pool[j]] = [pool[j], pool[i]];
		result.push(pool[i]);
	}
	return result;
}

/** Count of scriptures by book. Useful for headers and stats. */
export function countByBook(): Record<ScriptureBook, number> {
	return ALL_SCRIPTURES.reduce(
		(acc, s) => {
			acc[s.book] = (acc[s.book] ?? 0) + 1;
			return acc;
		},
		{} as Record<ScriptureBook, number>
	);
}

/** Total count — always 100 unless the JSON changes. */
export const TOTAL_SCRIPTURES = ALL_SCRIPTURES.length;
