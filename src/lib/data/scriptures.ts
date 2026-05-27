/**
 * Scripture access helpers.
 *
 * Imports `doctrinalMastery.json` (the 100 doctrinal-mastery passages
 * ported from the Flutter app) and exposes typed lookup utilities.
 *
 * The JSON is import-time-loaded — Vite inlines the ~30KB into the
 * bundle. No fetch, no network, no async.
 *
 * Demos and product pages should only depend on THIS module, not on
 * the JSON directly. That keeps the data shape encapsulated.
 */

import rawData from './doctrinalMastery.json';
import type { Scripture, ScriptureBook } from './types';

/** All 100 scriptures, in stable id order (id "1" first). */
export const ALL_SCRIPTURES: readonly Scripture[] = rawData as Scripture[];

/** Total count — always 100 unless the JSON regenerates. */
export const TOTAL_SCRIPTURES = ALL_SCRIPTURES.length;

/** Lookup by id. Returns null when the id doesn't exist (bad route param, etc.). */
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
 * Used by the Quick Quiz and Scripture Match demos to choose round
 * content. Default RNG is `Math.random`.
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
	const result: Scripture[] = [];
	const n = Math.min(count, pool.length);
	for (let i = 0; i < n; i++) {
		const j = i + Math.floor(rand() * (pool.length - i));
		[pool[i], pool[j]] = [pool[j], pool[i]];
		result.push(pool[i]);
	}
	return result;
}

/** Count of scriptures by book. */
export function countByBook(): Record<ScriptureBook, number> {
	return ALL_SCRIPTURES.reduce(
		(acc, s) => {
			acc[s.book] = (acc[s.book] ?? 0) + 1;
			return acc;
		},
		{} as Record<ScriptureBook, number>
	);
}
