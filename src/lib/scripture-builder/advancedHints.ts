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
