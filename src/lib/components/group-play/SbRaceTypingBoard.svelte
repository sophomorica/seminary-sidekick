<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { Clock3 } from 'lucide-svelte';
	import type { Scripture } from '$lib/data/types';
	import { cn } from '$lib/utils';
	import { GroupSbTypingController, type GroupSbTypedChar } from './groupSbTypingController';
	import { DNF_MISTAKE_COUNT, type GroupSbTypingDifficulty } from './scriptureBuilder';
	import { punctuation } from './wordCommitEngine';

	type Props = {
		scripture: Scripture;
		difficulty: GroupSbTypingDifficulty;
		timeoutSeconds?: number;
		onfinish: (elapsedMs: number, mistakeCount: number) => void;
	};

	type DisplayGlyph = {
		index: number;
		text: string;
		kind: 'typed-correct' | 'typed-wrong' | 'space' | 'hint' | 'blank';
		atCursor: boolean;
	};

	let { scripture, difficulty, timeoutSeconds, onfinish }: Props = $props();

	const isMaster = $derived(difficulty === 'master');
	// Parent remounts this board via `{#key}` per scripture — snapshot once.
	const controller = new GroupSbTypingController({
		targetText: untrack(() => scripture.fullText),
		difficulty: untrack(() => difficulty)
	});

	let inputValue = $state('');
	let typedChars = $state<GroupSbTypedChar[]>([]);
	let mistakeCount = $state(0);
	let hasActiveError = $state(false);
	let lastFeedback = $state<string | null>(null);
	let finished = $state(false);
	let remainingMs = $state(0);
	let startedAt = 0;

	const progressPercent = $derived(
		controller.targetText.length > 0
			? Math.min(100, (typedChars.length / controller.targetText.length) * 100)
			: 0
	);
	const remainingSeconds = $derived(Math.ceil(remainingMs / 1000));
	const firstLetterHints = $derived(
		isMaster ? ([] as number[]) : firstLetterIndices(controller.targetText)
	);
	const cursorIndex = $derived(
		isMaster || hasActiveError ? -1 : nextLetterIndex(controller.targetText, typedChars.length)
	);
	const glyphs = $derived(
		buildGlyphs(controller.targetText, typedChars, {
			isMaster,
			hintIndices: firstLetterHints,
			cursorIndex
		})
	);

	onMount(() => {
		startedAt = performance.now();
		remainingMs = timeoutSeconds ? timeoutSeconds * 1000 : 0;

		const timer = timeoutSeconds
			? window.setInterval(() => {
					remainingMs = Math.max(
						0,
						timeoutSeconds * 1000 - (performance.now() - startedAt)
					);
					if (remainingMs <= 0) {
						window.clearInterval(timer);
						complete(timeoutSeconds * 1000, DNF_MISTAKE_COUNT);
					}
				}, 100)
			: undefined;

		return () => {
			if (timer) window.clearInterval(timer);
		};
	});

	function autofocus(node: HTMLInputElement) {
		queueMicrotask(() => node.focus());
	}

	function syncFromController() {
		typedChars = [...controller.typedChars];
		mistakeCount = controller.mistakeCount;
		hasActiveError = controller.hasActiveError;
		lastFeedback = controller.lastFeedback;
		inputValue = controller.typedText;
	}

	function complete(elapsedMs: number, mistakes: number) {
		if (finished) return;
		finished = true;
		onfinish(elapsedMs, mistakes);
	}

	function maybeFinish() {
		if (controller.isComplete && !finished) {
			complete(Math.round(performance.now() - startedAt), controller.mistakeCount);
		}
	}

	function handleInput(event: Event) {
		if (finished) return;
		const el = event.currentTarget as HTMLInputElement;
		const changed = controller.onType(el.value);
		if (!changed) {
			inputValue = controller.typedText;
			el.value = controller.typedText;
			return;
		}
		syncFromController();
		maybeFinish();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (finished || !isMaster) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			const changed = controller.submitWord(inputValue);
			if (!changed) return;
			syncFromController();
			maybeFinish();
		}
	}

	function firstLetterIndices(target: string): number[] {
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

	function nextLetterIndex(target: string, from: number): number {
		let i = from;
		while (i < target.length) {
			const ch = target[i]!;
			if (ch !== ' ' && ch !== '\n' && !punctuation.test(ch)) return i;
			i++;
		}
		return -1;
	}

	function untypedGlyph(
		target: string,
		index: number,
		args: { isMaster: boolean; hintIndices: readonly number[] }
	): string {
		const ch = target[index]!;
		if (ch === ' ' || ch === '\n') return ch;
		if (!args.isMaster && args.hintIndices.includes(index)) return ch;
		return '_';
	}

	function buildGlyphs(
		target: string,
		typed: GroupSbTypedChar[],
		args: { isMaster: boolean; hintIndices: readonly number[]; cursorIndex: number }
	): DisplayGlyph[] {
		const result: DisplayGlyph[] = [];
		for (let i = 0; i < target.length; i++) {
			if (i < typed.length) {
				const tc = typed[i]!;
				result.push({
					index: i,
					text: tc.char,
					kind: tc.isCorrect ? 'typed-correct' : 'typed-wrong',
					atCursor: false
				});
				continue;
			}
			const glyph = untypedGlyph(target, i, args);
			const atCursor = i === args.cursorIndex;
			if (glyph === ' ' || glyph === '\n') {
				result.push({ index: i, text: glyph, kind: 'space', atCursor });
			} else if (glyph === '_') {
				result.push({ index: i, text: '_', kind: 'blank', atCursor });
			} else {
				result.push({ index: i, text: glyph, kind: 'hint', atCursor });
			}
		}
		return result;
	}
</script>

<div class="mt-5">
	<div class="flex items-center justify-between gap-3 text-body-sm text-on-surface-variant">
		<span>
			{typedChars.length} of {controller.targetText.length} characters
		</span>
		<div class="flex items-center gap-3">
			<span>{mistakeCount} {mistakeCount === 1 ? 'mistake' : 'mistakes'}</span>
			{#if timeoutSeconds}
				<span
					class={cn(
						'flex items-center gap-1 rounded-full px-2.5 py-1 font-medium tabular-nums',
						remainingSeconds <= 5
							? 'bg-error-light text-error'
							: 'bg-primary-fixed text-on-primary-container'
					)}
				>
					<Clock3 class="size-3.5" aria-hidden="true" />
					{remainingSeconds}s
				</span>
			{/if}
		</div>
	</div>

	<div
		class="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high"
		aria-hidden="true"
	>
		<div
			class={cn(
				'h-full rounded-full transition-[width] duration-150',
				isMaster ? 'bg-tertiary' : 'bg-accent'
			)}
			style:width={`${progressPercent}%`}
		></div>
	</div>

	<div
		class="mt-6 rounded-3xl bg-surface-container-low p-5 md:p-6"
		aria-label="Scripture typing progress"
	>
		<p class="font-serif text-title-lg leading-relaxed whitespace-pre-wrap">
			{#each glyphs as glyph (glyph.index)}
				{#if glyph.kind === 'typed-correct'}
					<span class="font-bold text-success bg-success/10">{glyph.text}</span>
				{:else if glyph.kind === 'typed-wrong'}
					<span class="font-bold text-error bg-error/15">{glyph.text}</span>
				{:else if glyph.kind === 'space'}
					{glyph.text}
				{:else if glyph.kind === 'hint'}
					<span
						class={cn(
							'font-semibold text-accent',
							glyph.atCursor ? 'bg-accent/15 text-accent' : 'text-accent/70'
						)}>{glyph.text}</span
					>
				{:else}
					<span
						class={cn(
							'tracking-wide',
							glyph.atCursor
								? 'bg-accent/15 text-on-surface/45'
								: 'text-on-surface/25'
						)}>{glyph.text}</span
					>
				{/if}
			{/each}
		</p>
	</div>

	{#if lastFeedback === 'reset'}
		<p
			class="mt-3 rounded-xl border border-error/40 bg-error/10 px-4 py-2 text-center text-label-lg font-semibold text-error"
			role="status"
		>
			Wrong word — start over
		</p>
	{/if}

	<div class="mt-5">
		{#if isMaster}
			<div class="flex justify-center">
				<input
					{@attach autofocus}
					type="text"
					class={cn(
						'focus-ring w-full max-w-xs rounded-2xl px-4 py-3 text-center font-serif text-title-lg font-bold',
						'bg-tertiary text-on-tertiary placeholder:text-on-tertiary/60',
						'outline-none'
					)}
					placeholder="Type a word"
					autocomplete="off"
					autocapitalize="off"
					autocorrect="on"
					spellcheck="true"
					enterkeyhint="done"
					disabled={finished}
					value={inputValue}
					oninput={handleInput}
					onkeydown={handleKeydown}
					aria-label="Type the next word, then press space or enter"
				/>
			</div>
			<p class="mt-3 text-center text-label-md uppercase text-on-surface-variant">
				Space or enter to commit each word
			</p>
		{:else}
			<input
				{@attach autofocus}
				type="text"
				class={cn(
					'focus-ring w-full rounded-2xl border bg-surface-container-lowest px-4 py-3 font-serif text-body-lg',
					'outline-none transition-colors',
					hasActiveError
						? 'border-error text-error'
						: 'border-surface-container-high text-on-surface'
				)}
				placeholder="Type the scripture…"
				autocomplete="off"
				autocapitalize="off"
				autocorrect="off"
				spellcheck="false"
				disabled={finished}
				value={inputValue}
				oninput={handleInput}
				aria-label="Type the scripture character by character"
			/>
			<p class="mt-3 text-center text-label-md uppercase text-on-surface-variant">
				Type every letter — punctuation fills in
			</p>
		{/if}
	</div>
</div>
