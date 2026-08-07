/** Word-commit validation for Scripture Builder Master typing mode. Port of Flutter WordCommitEngine. */

export type WordCommitStatus = 'committed' | 'wrongWord' | 'nothingToCommit';

export type WordCommitResult = {
	status: WordCommitStatus;
	committedText: string;
};

/** Punctuation that is auto-filled (never typed by the user). Matches Dart WordCommitEngine.punctuation. */
export const punctuation = /[,;:!?\-\—\–\.'\"\'\'\"\"\(\)\[\]]/;

const nonAlphanumeric = /[^a-z0-9]/g;

function isWhitespace(ch: string): boolean {
	return ch === ' ' || ch === '\n';
}

/** True if this character is auto-filled in typing mode (spaces, newlines, and all punctuation). */
export function isAutoFill(ch: string): boolean {
	return isWhitespace(ch) || punctuation.test(ch);
}

/** Dashes join words without spaces — they end a token the same way whitespace does. */
function isTokenBoundary(ch: string): boolean {
	return isWhitespace(ch) || ch === '-' || ch === '—' || ch === '–';
}

/** Lowercase and strip everything that is not a letter or digit. */
export function normalize(s: string): string {
	return s.toLowerCase().replace(nonAlphanumeric, '');
}

/** The most tokens one commit may span. */
export const maxTokensPerCommit = 4;

/**
 * Attempt to commit `buffer` against `target` at `position` (characters already committed).
 */
export function tryCommit(args: {
	target: string;
	position: number;
	buffer: string;
}): WordCommitResult {
	const { target, position, buffer } = args;
	const typed = normalize(buffer);
	if (typed.length === 0 || position >= target.length) {
		return { status: 'nothingToCommit', committedText: '' };
	}

	let start = position;
	while (start < target.length && isAutoFill(target[start]!)) {
		start++;
	}
	if (start >= target.length) {
		return { status: 'nothingToCommit', committedText: '' };
	}

	let spanEnd = start;
	for (let k = 0; k < maxTokensPerCommit; k++) {
		while (spanEnd < target.length && isAutoFill(target[spanEnd]!)) {
			spanEnd++;
		}
		if (spanEnd >= target.length) break;

		while (spanEnd < target.length && !isTokenBoundary(target[spanEnd]!)) {
			spanEnd++;
		}

		const span = normalize(target.slice(start, spanEnd));
		if (typed === span) {
			let end = spanEnd;
			while (end < target.length && isAutoFill(target[end]!)) {
				end++;
			}
			return {
				status: 'committed',
				committedText: target.slice(position, end)
			};
		}
		if (span.length > typed.length) break;
	}

	return { status: 'wrongWord', committedText: '' };
}
