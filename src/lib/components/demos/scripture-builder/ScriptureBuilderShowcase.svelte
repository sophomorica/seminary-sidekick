<!--
  ScriptureBuilderShowcase

  A choreographed play-through of Scripture Builder on a real verse
  (2 Nephi 2:25). Four phases match the product loop and the app tiers:

    Study  — read the verse, word by word (first contact)
    Build  — tap 3-word chunks into order (Beginner)
    Prove  — type it with first-letter hints (Advanced)
    Master — the verse holds; mastery chips light to Mastered

  Auto-plays once the stage is in view. Pause / replay are always
  available. Clicking a step jumps there. prefers-reduced-motion
  skips autoplay and shows each phase in its completed state.

  Scripture text comes from $lib/data/scriptures — never invented.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		BookOpen,
		Blocks,
		ShieldCheck,
		Sparkles,
		Pause,
		Play,
		RotateCcw,
		Icon
	} from 'lucide-svelte';
	import { getScripture } from '$lib/data/scriptures';
	import type { Scripture } from '$lib/data/types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	type Phase = 'study' | 'build' | 'prove' | 'master';

	let {
		showCards = true
	}: {
		/** Render the four explanatory step cards under the stage. */
		showCards?: boolean;
	} = $props();

	const CHUNK_SIZE = 3;
	const STUDY_WORD_MS = 170;
	const STUDY_HOLD_MS = 1100;
	const BUILD_HIGHLIGHT_MS = 360;
	const BUILD_PLACE_MS = 420;
	const BUILD_HOLD_MS = 900;
	const PROVE_WORD_MS = 400;
	const PROVE_HOLD_MS = 850;
	const MASTER_CHIP_MS = 360;
	const LOOP_HOLD_MS = 2600;

	/** Stable, short, famous — 14 words, five 3-word chunks. */
	const scripture: Scripture = getScripture('50') ?? {
		id: '50',
		book: 'bookOfMormon',
		volume: '2 Nephi',
		reference: '2 Nephi 2:25',
		name: 'Purpose of Life',
		keyPhrase: 'Adam fell that men might be; and men are, that they might have joy.',
		fullText: 'Adam fell that men might be; and men are, that they might have joy.'
	};

	const words = scripture.fullText.split(/\s+/).filter(Boolean);

	type Chunk = { id: string; text: string; index: number };

	const chunks: Chunk[] = (() => {
		const list: Chunk[] = [];
		for (let i = 0; i < words.length; i += CHUNK_SIZE) {
			const index = list.length;
			list.push({
				id: `c${index}`,
				text: words.slice(i, i + CHUNK_SIZE).join(' '),
				index
			});
		}
		return list;
	})();

	/** Mixed pool order so Build looks like a real scrambled board. */
	const POOL_ORDER = [2, 4, 0, 3, 1].filter((i) => i < chunks.length);

	const PHASES: {
		id: Phase;
		number: string;
		title: string;
		body: string;
		caption: string;
		icon: typeof Icon;
		iconBg: string;
		iconColor: string;
	}[] = [
		{
			id: 'study',
			number: '01',
			title: 'Study',
			body: 'Read the scripture and hear it aloud. First contact, no pressure.',
			caption: 'First contact. Read it. Hear it. No pressure yet.',
			icon: BookOpen,
			iconBg: 'bg-primary-fixed',
			iconColor: 'text-primary'
		},
		{
			id: 'build',
			number: '02',
			title: 'Build',
			body: 'Drag word tiles to reconstruct the verse — a verse you can build is a verse you understand.',
			caption: 'Tap 3-word chunks in order. A verse you can build is a verse you understand.',
			icon: Blocks,
			iconBg: 'bg-secondary-container',
			iconColor: 'text-secondary'
		},
		{
			id: 'prove',
			number: '03',
			title: 'Prove',
			body: 'Type it with first-letter hints — then type it cold, no prompts. The moment you know you know it.',
			caption: 'Type it. First-letter hints first — then you prove it cold.',
			icon: ShieldCheck,
			iconBg: 'bg-accent-light/30',
			iconColor: 'text-accent'
		},
		{
			id: 'master',
			number: '04',
			title: 'Master',
			body: 'Daily review keeps it sealed in. Year after year, not just for the quiz.',
			caption: 'Three perfect Master runs in the app. Then it stays with you.',
			icon: Sparkles,
			iconBg: 'bg-tertiary-fixed',
			iconColor: 'text-tertiary'
		}
	];

	const MASTERY = [
		{ label: 'Learning', color: 'bg-mastery-learning text-on-surface' },
		{ label: 'Familiar', color: 'bg-mastery-familiar text-on-surface' },
		{ label: 'Memorized', color: 'bg-mastery-memorized text-on-surface' },
		{ label: 'Mastered', color: 'bg-mastery-mastered text-on-surface' }
	] as const;

	let phase = $state<Phase>('study');
	let studyCount = $state(0);
	let placedCount = $state(0);
	let highlightId = $state<string | null>(null);
	let typedCount = $state(0);
	let masteryLit = $state(0);
	let playing = $state(false);
	let liveMessage = $state('');

	const reducedMotionQuery = new MediaQuery('(prefers-reduced-motion: reduce)', false);
	const reducedMotion = $derived(reducedMotionQuery.current);
	const startPaused = $derived(page.url.searchParams.get('sb') === 'pause');

	const currentMeta = $derived(PHASES.find((p) => p.id === phase) ?? PHASES[0]);
	const built = $derived(chunks.slice(0, placedCount));
	const pool = $derived(POOL_ORDER.map((i) => chunks[i]).filter((c) => c.index >= placedCount));
	const emptySlots = $derived(Math.max(0, chunks.length - placedCount));

	let timer: ReturnType<typeof setTimeout> | null = null;
	let confettiFired = false;
	/** Bumps on every jump/replay so in-flight timeouts cannot advance a stale phase. */
	let beat = 0;

	function clearTimer() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function later(ms: number, fn: () => void) {
		clearTimer();
		const scheduled = beat;
		timer = setTimeout(
			() => {
				if (scheduled !== beat) return;
				fn();
			},
			reducedMotion ? 0 : ms
		);
	}

	function announce(next: Phase) {
		const label = PHASES.find((p) => p.id === next)?.title ?? next;
		liveMessage = `Scripture Builder: ${label}`;
	}

	function resetTo(next: Phase) {
		phase = next;
		announce(next);
		studyCount = next === 'study' ? 0 : words.length;
		placedCount = next === 'study' ? 0 : next === 'build' ? 0 : chunks.length;
		highlightId = null;
		typedCount = next === 'prove' ? 0 : next === 'master' ? words.length : 0;
		masteryLit = next === 'master' ? 0 : next === 'prove' ? 1 : 0;
	}

	function go(next: Phase) {
		resetTo(next);
		if (playing) tick();
	}

	function tick() {
		if (!playing) return;

		if (phase === 'study') {
			if (studyCount < words.length) {
				studyCount += 1;
				later(STUDY_WORD_MS, tick);
				return;
			}
			later(STUDY_HOLD_MS, () => go('build'));
			return;
		}

		if (phase === 'build') {
			if (placedCount < chunks.length) {
				const next = chunks[placedCount];
				highlightId = next.id;
				later(BUILD_HIGHLIGHT_MS, () => {
					highlightId = null;
					placedCount += 1;
					later(BUILD_PLACE_MS, tick);
				});
				return;
			}
			later(BUILD_HOLD_MS, () => go('prove'));
			return;
		}

		if (phase === 'prove') {
			if (typedCount < words.length) {
				typedCount += 1;
				later(PROVE_WORD_MS, tick);
				return;
			}
			later(PROVE_HOLD_MS, () => go('master'));
			return;
		}

		// master
		if (masteryLit < MASTERY.length) {
			masteryLit += 1;
			if (masteryLit === MASTERY.length) fireConfettiOnce();
			later(MASTER_CHIP_MS, tick);
			return;
		}
		later(LOOP_HOLD_MS, () => go('study'));
	}

	function play() {
		if (reducedMotion) return;
		playing = true;
		tick();
	}

	function pause() {
		playing = false;
		clearTimer();
		highlightId = null;
	}

	function replay() {
		beat += 1;
		clearTimer();
		confettiFired = false;
		playing = true;
		go('study');
	}

	function jump(next: Phase) {
		beat += 1;
		clearTimer();
		resetTo(next);
		if (reducedMotion) {
			// Completed snapshot of that phase — no tween.
			if (next === 'study') studyCount = words.length;
			if (next === 'build') placedCount = chunks.length;
			if (next === 'prove') typedCount = words.length;
			if (next === 'master') {
				typedCount = words.length;
				placedCount = chunks.length;
				masteryLit = MASTERY.length;
			}
			playing = false;
			return;
		}
		playing = true;
		tick();
	}

	async function fireConfettiOnce() {
		if (confettiFired || reducedMotion) return;
		confettiFired = true;
		try {
			const mod = await import('canvas-confetti');
			mod.default({
				particleCount: 56,
				spread: 62,
				origin: { y: 0.42 },
				colors: ['#2F4374', '#3F6E9C', '#B8942A', '#5B8ABF'],
				disableForReducedMotion: true
			});
		} catch {
			// optional
		}
	}

	function firstLetter(word: string): string {
		const match = word.match(/[A-Za-z]/);
		return match?.[0] ?? word[0] ?? '';
	}

	function restMask(word: string): string {
		const idx = word.search(/[A-Za-z]/);
		if (idx < 0) return '';
		return word.slice(idx + 1).replace(/[A-Za-z]/g, '·');
	}

	function observeStage(node: HTMLElement) {
		(window as Window & { __sbReady?: boolean }).__sbReady = true;

		if (reducedMotion || startPaused) {
			studyCount = words.length;
			return () => clearTimer();
		}

		if (typeof IntersectionObserver === 'undefined') {
			play();
			return () => clearTimer();
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
						if (!playing) play();
					} else if (playing) {
						pause();
					}
				}
			},
			{ threshold: [0, 0.35, 0.6] }
		);
		observer.observe(node);

		return () => {
			observer.disconnect();
			clearTimer();
		};
	}
</script>

<div class="mt-10 md:mt-14">
	<div
		{@attach observeStage}
		id="scripture-builder-showcase"
		class="relative overflow-hidden rounded-4xl bg-surface-container-lowest p-5 shadow-floating md:p-8"
		data-phase={phase}
		aria-labelledby="sb-showcase-live"
	>
		<p id="sb-showcase-live" class="sr-only" aria-live="polite">{liveMessage}</p>

		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex flex-wrap items-center gap-2">
				<span class="eyebrow">Scripture Builder</span>
				<span
					class="rounded-full bg-book-bom/15 px-2.5 py-0.5 text-label-sm text-book-bom uppercase"
				>
					{scripture.reference}
				</span>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onclick={() => (playing ? pause() : play())}
					aria-label={playing ? 'Pause animation' : 'Play animation'}
				>
					{#if playing}
						<Pause aria-hidden="true" />
						Pause
					{:else}
						<Play aria-hidden="true" />
						Play
					{/if}
				</Button>
				<Button variant="ghost" size="sm" onclick={replay} aria-label="Replay animation">
					<RotateCcw aria-hidden="true" />
					Replay
				</Button>
			</div>
		</div>

		<!-- Phase rail -->
		<ol class="mt-5 flex flex-wrap gap-2" aria-label="Scripture Builder phases">
			{#each PHASES as step (step.id)}
				<li>
					<Button
						variant={phase === step.id ? 'primary' : 'ghost'}
						size="sm"
						id={`sb-jump-${step.id}`}
						data-jump={step.id}
						aria-current={phase === step.id ? 'step' : undefined}
						onclick={() => jump(step.id)}
					>
						{step.title}
					</Button>
				</li>
			{/each}
		</ol>

		<!-- Stage canvas -->
		<div
			class="relative mt-6 min-h-[18rem] rounded-3xl bg-surface-container-low p-4 md:min-h-[20rem] md:p-7"
		>
			{#if phase === 'study'}
				<div class="flex h-full min-h-[16rem] flex-col justify-center">
					<p class="text-label-md uppercase text-on-surface-variant">
						{scripture.name}
					</p>
					<p
						class="mt-4 font-serif text-xl leading-relaxed text-on-surface italic md:text-2xl"
					>
						{#each words as word, i (i)}
							<span
								class={cn(
									'inline-block pr-[0.35em]',
									i < studyCount
										? 'motion-safe:animate-sb-word-in opacity-100'
										: 'opacity-0'
								)}>{word}</span
							>
						{/each}
					</p>
					<p class="mt-5 text-body-sm uppercase tracking-wide text-on-surface-variant">
						{scripture.reference} · Book of Mormon
					</p>
				</div>
			{:else if phase === 'build'}
				<div class="flex min-h-[16rem] flex-col justify-between gap-6">
					<div>
						<p class="mb-3 text-label-md uppercase text-on-surface-variant">
							Build the verse
						</p>
						<div class="flex flex-wrap gap-2">
							{#each built as chunk (chunk.id)}
								<span
									class="motion-safe:animate-sb-tile-place rounded-2xl bg-primary px-3 py-2 font-serif text-body-lg text-on-primary italic"
								>
									{chunk.text}
								</span>
							{/each}
							{#each { length: emptySlots }}
								<span
									class="min-h-[2.6rem] min-w-[5.5rem] rounded-2xl bg-surface-container-highest/70"
									aria-hidden="true"
								></span>
							{/each}
						</div>
					</div>
					<div>
						<p class="mb-3 text-label-md uppercase text-on-surface-variant">
							Tap the next chunk
						</p>
						<div class="flex flex-wrap gap-2">
							{#each pool as chunk (chunk.id)}
								<span
									class={cn(
										'rounded-2xl bg-surface-container-lowest px-3 py-2 font-serif text-body-lg text-on-surface italic shadow-editorial transition-transform duration-250 ease-out-soft',
										highlightId === chunk.id &&
											'scale-[1.03] ring-2 ring-primary motion-safe:animate-sb-tap-pulse',
										highlightId && highlightId !== chunk.id && 'opacity-45'
									)}
								>
									{chunk.text}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{:else if phase === 'prove'}
				<div class="flex min-h-[16rem] flex-col justify-center">
					<p class="text-label-md uppercase text-on-surface-variant">
						Type it · first-letter hints
					</p>
					<p class="mt-5 font-serif text-xl leading-relaxed text-on-surface md:text-2xl">
						{#each words as word, i (i)}
							<span class="mr-[0.35em] inline-block">
								{#if i < typedCount}
									<span class="italic">{word}</span>
								{:else if i === typedCount}
									<span class="italic text-primary">{firstLetter(word)}</span
									><span class="text-on-surface-variant/50">{restMask(word)}</span
									><span
										class="motion-safe:animate-sb-cursor ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-primary align-middle"
										aria-hidden="true"
									></span>
								{:else}
									<span class="text-on-surface-variant/40"
										>{firstLetter(word)}</span
									>
								{/if}
							</span>
						{/each}
					</p>
					<p class="mt-6 text-body-sm text-on-surface-variant">
						Advanced tier in the app. Master tier hides even these letters.
					</p>
				</div>
			{:else}
				<div class="flex min-h-[16rem] flex-col items-start justify-center">
					<span
						class="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-3 py-1 text-label-md text-tertiary uppercase"
					>
						<Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
						Mastered
					</span>
					<blockquote class="scripture mt-5 text-left">
						“{scripture.fullText}”
						<footer>{scripture.reference} — Book of Mormon</footer>
					</blockquote>
					<ul class="mt-6 flex flex-wrap gap-2" aria-label="Mastery climb">
						{#each MASTERY as chip, i (chip.label)}
							<li
								class={cn(
									'rounded-full px-3 py-1 text-label-sm uppercase transition-all duration-450 ease-out-soft',
									i < masteryLit
										? chip.color
										: 'bg-surface-container-highest text-on-surface-variant'
								)}
							>
								{chip.label}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>

		<p class="mt-5 text-body-md text-on-surface-variant">{currentMeta.caption}</p>
	</div>

	{#if showCards}
		<ol
			class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4"
			aria-label="The four-step mastery loop"
		>
			{#each PHASES as step (step.id)}
				{@const StepIcon = step.icon}
				<li class="h-full">
					<button
						type="button"
						class="h-full w-full text-left"
						data-jump={step.id}
						onclick={() => jump(step.id)}
						aria-current={phase === step.id ? 'step' : undefined}
					>
						<Card.Root
							hover
							class={cn(
								'flex h-full flex-col gap-5 transition-shadow duration-250 ease-out-soft',
								phase === step.id && 'shadow-floating ring-2 ring-primary/30'
							)}
						>
							<div
								class="flex h-14 w-14 items-center justify-center rounded-full {step.iconBg}"
								aria-hidden="true"
							>
								<StepIcon class="h-7 w-7 {step.iconColor}" stroke-width={1.5} />
							</div>
							<div class="flex items-baseline gap-3">
								<span
									class="text-label-md text-on-surface-variant tabular-nums uppercase"
									aria-hidden="true"
								>
									{step.number}
								</span>
								<h3 class="font-serif text-headline-md">{step.title}</h3>
							</div>
							<p class="text-on-surface-variant">{step.body}</p>
						</Card.Root>
					</button>
				</li>
			{/each}
		</ol>
	{/if}
</div>
