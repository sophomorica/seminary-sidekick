import { isAutoFill, tryCommit } from './wordCommitEngine';

export type GroupSbTypingDifficulty = 'advanced' | 'master';

/** One character committed (or errored) in a Group SB typing race. */
export type GroupSbTypedChar = {
	char: string;
	isCorrect: boolean;
};

/** Mastery-free Advanced / Master typing state for Group Play SB Race. */
export class GroupSbTypingController {
	readonly targetText: string;
	readonly difficulty: GroupSbTypingDifficulty;

	typedText = '';
	typedChars: GroupSbTypedChar[] = [];
	hasActiveError = false;
	mistakeCount = 0;
	isComplete = false;

	/** Last feedback token: `correct` | `incorrect` | `reset` | `word` | null. */
	lastFeedback: string | null = null;

	private static trailingWhitespace = /\s$/;

	constructor(args: { targetText: string; difficulty: GroupSbTypingDifficulty }) {
		if (args.difficulty !== 'advanced' && args.difficulty !== 'master') {
			throw new Error('GroupSbTypingController is typing-only');
		}
		this.targetText = args.targetText;
		this.difficulty = args.difficulty;
	}

	get isMaster(): boolean {
		return this.difficulty === 'master';
	}

	/** Apply a keystroke / buffer update. Returns true if state changed. */
	onType(newText: string): boolean {
		if (this.isComplete) return false;
		if (this.isMaster) return this.onTypeWord(newText);
		return this.onTypeChar(newText);
	}

	/** Master: commit current buffer as if space/done was pressed. */
	submitWord(buffer?: string): boolean {
		if (this.isComplete || !this.isMaster) return false;
		return this.onTypeWord(`${buffer ?? this.typedText} `);
	}

	clearFeedback(): void {
		this.lastFeedback = null;
	}

	private onTypeWord(newText: string): boolean {
		if (!GroupSbTypingController.trailingWhitespace.test(newText)) {
			this.typedText = newText;
			this.lastFeedback = null;
			return true;
		}

		const result = tryCommit({
			target: this.targetText,
			position: this.typedChars.length,
			buffer: newText
		});

		switch (result.status) {
			case 'committed':
				return this.commitWord(result.committedText);
			case 'nothingToCommit':
				this.typedText = '';
				this.lastFeedback = null;
				return true;
			case 'wrongWord':
				this.typedText = '';
				this.typedChars = [];
				this.mistakeCount += 1;
				this.lastFeedback = 'reset';
				return true;
		}
	}

	private commitWord(committedText: string): boolean {
		const newChars = [...this.typedChars];
		for (let i = 0; i < committedText.length; i++) {
			newChars.push({ char: committedText[i]!, isCorrect: true });
		}
		const done = newChars.length >= this.targetText.length;
		this.typedText = '';
		this.typedChars = newChars;
		this.lastFeedback = done ? 'correct' : 'word';
		this.isComplete = done;
		return true;
	}

	private onTypeChar(newText: string): boolean {
		if (newText.length < this.typedText.length) {
			const newChars = [...this.typedChars];
			if (newChars.length > 0) {
				newChars.pop();
				while (newChars.length > 0 && isAutoFill(newChars[newChars.length - 1]!.char)) {
					newChars.pop();
				}
			}
			this.typedText = newText;
			this.typedChars = newChars;
			this.hasActiveError = newChars.some((c) => !c.isCorrect);
			this.lastFeedback = null;
			return true;
		}

		if (newText.length > this.typedText.length) {
			if (this.hasActiveError) return false;

			const newChar = newText[newText.length - 1]!;
			if (isAutoFill(newChar)) {
				this.typedText = newText;
				return true;
			}

			const newChars = [...this.typedChars];
			this.autoFillNonLetters(newChars);

			const expectedIndex = newChars.length;
			if (expectedIndex >= this.targetText.length) return false;

			const expectedChar = this.targetText[expectedIndex]!;
			const isCorrect = newChar.toLowerCase() === expectedChar.toLowerCase();

			if (isCorrect) {
				newChars.push({ char: newChar, isCorrect: true });
				this.autoFillNonLetters(newChars);
				const done = newChars.length >= this.targetText.length;
				this.typedText = newText;
				this.typedChars = newChars;
				this.lastFeedback = done ? 'correct' : null;
				this.isComplete = done;
				return true;
			}

			newChars.push({ char: newChar, isCorrect: false });
			this.typedText = newText;
			this.typedChars = newChars;
			this.mistakeCount += 1;
			this.hasActiveError = true;
			this.lastFeedback = 'incorrect';
			return true;
		}

		return false;
	}

	private autoFillNonLetters(chars: GroupSbTypedChar[]): number {
		let filled = 0;
		let pos = chars.length;
		while (pos < this.targetText.length && isAutoFill(this.targetText[pos]!)) {
			chars.push({ char: this.targetText[pos]!, isCorrect: true });
			filled++;
			pos++;
		}
		return filled;
	}
}
