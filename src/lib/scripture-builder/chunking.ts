/**
 * Scripture Builder chunking — port of the Flutter app provider.
 *
 * Source of truth:
 *   sophomorica/seminary_sidekick_flutter
 *   lib/providers/scripture_builder_provider.dart
 *   (`adaptiveChunkSize`, `_splitIntoWords`, `_loadCurrentVerseChunks`)
 *
 * Do not invent a different phrase bank. Beginner / Intermediate tiles
 * on the site must match the app's adaptive consecutive-word chunks.
 */

export const kBeginnerChunkCap = 19;
export const kBeginnerBaseChunkSize = 3;
export const kBeginnerMaxChunkSize = 8;
export const kIntermediateChunkCap = 28;
export const kIntermediateBaseChunkSize = 2;
export const kIntermediateMaxChunkSize = 6;

export type TapDifficulty = 'beginner' | 'intermediate';

/**
 * Split text the way Flutter `Scripture._splitIntoWords` does:
 * strip leading verse numbers and paragraph marks, split on whitespace,
 * keep punctuation attached to words.
 */
export function splitIntoWords(text: string): string[] {
	return text
		.replace(/^\d+\s*/gm, '')
		.replaceAll('¶', '')
		.split(/\s+/)
		.filter((word) => word.length > 0);
}

/**
 * `chunkSize = clamp(ceil(wordCount / cap), baseSize, maxSize)`
 *
 * Passages at or under 1 Nephi 3:7 (56 words) keep historic 3-word /
 * 2-word sizes. Longer passages grow chunk size so tap counts stay bounded.
 */
export function adaptiveChunkSize(wordCount: number, difficulty: TapDifficulty): number {
	const cap = difficulty === 'beginner' ? kBeginnerChunkCap : kIntermediateChunkCap;
	const baseSize =
		difficulty === 'beginner' ? kBeginnerBaseChunkSize : kIntermediateBaseChunkSize;
	const maxSize = difficulty === 'beginner' ? kBeginnerMaxChunkSize : kIntermediateMaxChunkSize;
	if (wordCount <= 0) return baseSize;
	const raw = Math.ceil(wordCount / cap);
	return Math.min(maxSize, Math.max(baseSize, raw));
}

/** Target tiles for one verse — same consecutive-word split as the app. */
export function buildTargetChunks(text: string, difficulty: TapDifficulty): string[] {
	const words = splitIntoWords(text);
	const chunkSize = adaptiveChunkSize(words.length, difficulty);
	const chunks: string[] = [];
	for (let i = 0; i < words.length; i += chunkSize) {
		chunks.push(words.slice(i, i + chunkSize).join(' '));
	}
	return chunks;
}
