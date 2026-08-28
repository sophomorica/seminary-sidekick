/**
 * Advanced typing display — first-letter-of-word hints.
 *
 * Must match Flutter TypedDisplayRules
 * (`lib/screens/games/scripture_builder/typed_display_rules.dart`) and
 * the Group Play board: first letter/digit of each word is shown;
 * other letters and punctuation become `_`; spaces stay spaces.
 * Punctuation is never a hint (it is auto-fill in the app).
 */

import { punctuation } from '$lib/components/group-play/wordCommitEngine';

export type HintGlyph = {
	text: string;
	kind: 'space' | 'hint' | 'blank';
};

export function firstLetterIndices(target: string): number[] {
	const indices: number[] = [];
	let atWordStart = true;
	for (let i = 0; i < target.length; i++) {
		const ch = target[i]!;
		if (ch === ' ' || ch === '\n') {
			atWordStart = true;
		} else if (!punctuation.test(ch)) {
			if (atWordStart) indices.push(i);
			atWordStart = false;
		}
	}
	return indices;
}

export function untypedGlyph(
	target: string,
	index: number,
	hintIndices: ReadonlySet<number>
): string {
	const ch = target[index]!;
	if (ch === ' ' || ch === '\n') return ch;
	if (hintIndices.has(index)) return ch;
	return '_';
}

export function advancedHintText(target: string): string {
	const hints = new Set(firstLetterIndices(target));
	let out = '';
	for (let i = 0; i < target.length; i++) {
		out += untypedGlyph(target, i, hints);
	}
	return out;
}

export function advancedHintGlyphs(target: string): HintGlyph[] {
	const hints = new Set(firstLetterIndices(target));
	const glyphs: HintGlyph[] = [];
	for (let i = 0; i < target.length; i++) {
		const text = untypedGlyph(target, i, hints);
		if (text === ' ' || text === '\n') {
			glyphs.push({ text, kind: 'space' });
		} else if (hints.has(i)) {
			glyphs.push({ text, kind: 'hint' });
		} else {
			glyphs.push({ text: '_', kind: 'blank' });
		}
	}
	return glyphs;
}

/** Space-separated hint words for wrapping on a print sheet. */
export function advancedHintWords(target: string): HintGlyph[][] {
	const words: HintGlyph[][] = [];
	let current: HintGlyph[] = [];
	for (const glyph of advancedHintGlyphs(target)) {
		if (glyph.kind === 'space') {
			if (current.length > 0) {
				words.push(current);
				current = [];
			}
		} else {
			current.push(glyph);
		}
	}
	if (current.length > 0) words.push(current);
	return words;
}

/**
 * Wrap first-letter hints for a print passage.
 * Short verses (16 words or fewer) split at the midpoint so 2 Nephi 2:25
 * stays the signed-off two-line proof. Longer verses wrap so they fit
 * US Letter.
 */
export function advancedHintLines(target: string): string[] {
	const words = advancedHintText(target)
		.split(' ')
		.filter((word) => word.length > 0);
	if (words.length <= 1) return [words.join(' ') || ''];
	if (words.length <= 16) {
		const mid = Math.ceil(words.length / 2);
		return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
	}
	// Longer passages need more words per line so the sheet still fits US Letter.
	const perLine = words.length > 160 ? 14 : words.length > 80 ? 12 : 10;
	const lines: string[] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine).join(' '));
	}
	return lines;
}
