<!--
  QuickQuizDemo — TASK-B-020

  A 5-question interactive taste of Seminary Sidekick. Lives standalone
  at /quick-quiz AND can be composed onto the homepage (TASK-C-100) at
  anchor #quick-quiz-demo.

  Mechanics:
    - pickRandomScriptures(5) up front (one round per mount).
    - Each question: show keyPhrase, ask "Which reference?"
      4 choices = 1 correct + 3 distractors drawn from other scriptures.
    - Tap correct  → success halo + brief pulse (~300ms), advance ~600ms.
    - Tap wrong    → error halo + shake (~400ms), then advance ~800ms.
    - After Q5     → end card with score, "Want the other 95?" pitch,
      and <StoreButtons />. 5/5 fires canvas-confetti (motion-safe only).

  Per THEME.md:
    - Tinted shadows (editorial / floating), large radii (rounded-[2rem]
      cards, rounded-full chips), ease-out-soft motion, semantic color
      tokens only, no raw hex.
    - Color is never the only signal: correct = success tint + Check icon,
      wrong = error tint + X icon.

  Per CLAUDE.md scripture-data rule:
    - All data flows through $lib/data/scriptures (the helper module),
      never the raw JSON. The 100 scriptures are owned by the Flutter app.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, X } from 'lucide-svelte';
	import { ALL_SCRIPTURES, pickRandomScriptures, TOTAL_SCRIPTURES } from '$lib/data/scriptures';
	import type { Scripture } from '$lib/data/types';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { cn, tv } from '$lib/utils';

	const QUESTION_COUNT = 5;
	const CHOICE_COUNT = 4;

	/** A single rendered question. */
	type Question = {
		scripture: Scripture;
		/** Shuffled choices (references); `scripture.reference` is among them. */
		choices: string[];
	};

	/** Per-question record once the user has answered. */
	type Answer = {
		scripture: Scripture;
		chosen: string;
		correct: boolean;
	};

	/**
	 * Build a fresh round: pick 5 scriptures, then for each pick 3 distractor
	 * references from the remaining 95 and shuffle the 4-choice list.
	 *
	 * Distractor pool: every scripture id NOT used as a question this round.
	 * That avoids the rare case where a distractor accidentally equals the
	 * correct answer (since references are unique per-scripture but two
	 * questions in the same round could pull the same distractor — we still
	 * de-dupe by id below).
	 */
	function buildRound(): Question[] {
		const picks = pickRandomScriptures(QUESTION_COUNT);
		const pickedIds = new Set(picks.map((s) => s.id));
		const distractorPool = ALL_SCRIPTURES.filter((s) => !pickedIds.has(s.id));

		return picks.map((scripture) => {
			// Shuffle the pool, take CHOICE_COUNT - 1 distractor references.
			const shuffled = [...distractorPool].sort(() => Math.random() - 0.5);
			const distractors = shuffled.slice(0, CHOICE_COUNT - 1).map((s) => s.reference);
			const choices = [scripture.reference, ...distractors].sort(() => Math.random() - 0.5);
			return { scripture, choices };
		});
	}

	// ─── State (Svelte 5 runes) ──────────────────────────────────────
	let questions = $state<Question[]>([]);
	let currentIndex = $state(0);
	let answers = $state<Answer[]>([]);
	/** The choice the user just tapped, for halo styling. null until tap. */
	let selectedChoice = $state<string | null>(null);
	/** True once we've shown feedback and committed the answer to `answers`. */
	let locked = $state(false);
	/** True after question 5 has been answered and we transition to end card. */
	let finished = $state(false);

	const current = $derived(questions[currentIndex]);
	const score = $derived(answers.filter((a) => a.correct).length);
	const progressPct = $derived(
		questions.length === 0
			? 0
			: Math.round(((finished ? questions.length : currentIndex) / questions.length) * 100)
	);

	onMount(() => {
		questions = buildRound();
	});

	function handleChoice(choice: string) {
		if (locked || !current) return;

		const isCorrect = choice === current.scripture.reference;
		selectedChoice = choice;
		locked = true;

		answers = [
			...answers,
			{ scripture: current.scripture, chosen: choice, correct: isCorrect }
		];

		const delay = isCorrect ? 650 : 850;
		window.setTimeout(() => {
			if (currentIndex + 1 >= questions.length) {
				finished = true;
				if (score + (isCorrect ? 1 : 0) === questions.length) {
					maybeFireConfetti();
				}
			} else {
				currentIndex += 1;
				selectedChoice = null;
				locked = false;
			}
		}, delay);
	}

	/**
	 * Confetti on a perfect run. Brand colors only. Gated on
	 * prefers-reduced-motion: no-preference and wrapped in try/catch
	 * because canvas-confetti is loaded dynamically (it's installed by
	 * the owner separately — see package.json).
	 */
	async function maybeFireConfetti() {
		if (typeof window === 'undefined') return;
		const ok = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
		if (!ok) return;
		try {
			const mod = await import('canvas-confetti');
			const confetti = mod.default;
			confetti({
				particleCount: 80,
				spread: 70,
				origin: { y: 0.4 },
				colors: ['#2F4374', '#3F6E9C', '#B8942A', '#5B8ABF'],
				disableForReducedMotion: true
			});
		} catch {
			// canvas-confetti not installed yet — silently no-op.
		}
	}

	/**
	 * Choice button visual states. We roll our own button (instead of
	 * reusing <Button />) so we can wire the correct/wrong halo + shake
	 * without fighting the pill-shaped tv() variants.
	 */
	const choiceClass = tv({
		base: [
			'group relative flex w-full items-center justify-between gap-3',
			'min-h-[3.5rem] rounded-2xl px-5 py-4 text-left',
			'font-sans text-title-lg font-semibold',
			'transition-all duration-150 ease-out-soft',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
			'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			'disabled:cursor-default'
		].join(' '),
		variants: {
			state: {
				idle: [
					'bg-surface-container-lowest text-on-surface',
					'shadow-editorial',
					'hover:-translate-y-0.5 hover:shadow-floating',
					'active:translate-y-0'
				].join(' '),
				correct: [
					'bg-success-light text-on-surface',
					'ring-2 ring-success',
					'motion-safe:animate-pulse-soft'
				].join(' '),
				wrong: [
					'bg-error-light text-on-surface',
					'ring-2 ring-error',
					'motion-safe:animate-shake'
				].join(' '),
				dimmed: ['bg-surface-container-lowest text-on-surface-variant opacity-60'].join(
					' '
				),
				revealed: ['bg-success-light/60 text-on-surface', 'ring-2 ring-success/60'].join(
					' '
				)
			}
		},
		defaultVariants: { state: 'idle' }
	});

	function choiceState(choice: string): 'idle' | 'correct' | 'wrong' | 'dimmed' | 'revealed' {
		if (!current) return 'idle';
		if (!locked) return 'idle';
		const isCorrect = choice === current.scripture.reference;
		if (choice === selectedChoice) return isCorrect ? 'correct' : 'wrong';
		// After a wrong tap, gently surface the correct answer too.
		if (!isCorrectChoiceWasPicked() && isCorrect) return 'revealed';
		return 'dimmed';
	}

	function isCorrectChoiceWasPicked(): boolean {
		if (!current || !selectedChoice) return false;
		return selectedChoice === current.scripture.reference;
	}

	/** Missed-reference list for the end card (helps the user, not just scolds). */
	const missed = $derived(answers.filter((a) => !a.correct));

	/**
	 * Some scripture keyPhrases in the source data are themselves wrapped
	 * in curly quotes (e.g. `“God created man in his own image.”`). The
	 * demo adds its own &ldquo;/&rdquo; for editorial styling, so we trim
	 * any pre-existing leading/trailing quote characters first to avoid
	 * doubled-up “” marks in the rendered output.
	 */
	function trimWrappingQuotes(s: string): string {
		return s.replace(/^[“”"']+/, '').replace(/[“”"']+$/, '');
	}
</script>

<section
	id="quick-quiz-demo"
	class="section relative overflow-hidden bg-surface"
	aria-labelledby="quick-quiz-demo-heading"
>
	<!--
		Soft ambient warmth behind the demo — primary-fixed blush, low
		opacity. Same playbook as the hero, dialed down so it doesn't
		compete with the card.
	-->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 50% 40% at 50% 0%, var(--color-primary-fixed) 0%, transparent 60%);
			opacity: 0.35;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-3xl px-4 md:px-8">
		<header class="mb-10 text-center">
			<p class="eyebrow">Quick Quiz</p>
			<h2 id="quick-quiz-demo-heading" class="font-serif text-display-md md:text-display-lg">
				Five scriptures. One round.
			</h2>
			<p class="mt-3 text-body-lg text-on-surface-variant">
				Read the phrase. Pick the reference. See how it feels.
			</p>
		</header>

		{#if questions.length === 0}
			<!-- Brief loading shell — questions resolve in onMount, so this
			     flashes only on first render. -->
			<div class="card mx-auto h-64 max-w-2xl animate-pulse bg-surface-container-low"></div>
		{:else if !finished && current}
			<div
				class="relative mx-auto max-w-2xl rounded-[2rem] bg-surface-container-lowest p-6 shadow-editorial md:p-10"
			>
				<!-- Progress + counter -->
				<div class="mb-6 flex items-center justify-between gap-4">
					<span class="text-label-md uppercase tracking-[1px] text-on-surface-variant">
						Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
					</span>
					<span class="text-label-md uppercase tracking-[1px] text-on-surface-variant">
						Score {score}
					</span>
				</div>
				<div
					class="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high"
					aria-hidden="true"
				>
					<div
						class="h-full rounded-full bg-primary transition-all duration-450 ease-out-soft"
						style="width: {progressPct}%"
					></div>
				</div>

				<!-- Prompt — the keyPhrase, rendered in the scripture style. -->
				<blockquote
					class="font-serif italic text-on-surface text-xl leading-relaxed md:text-2xl"
				>
					&ldquo;{trimWrappingQuotes(current.scripture.keyPhrase)}&rdquo;
				</blockquote>
				<p class="mt-6 text-label-md uppercase tracking-[1px] text-on-surface-variant">
					Which reference?
				</p>

				<!-- Choices -->
				<ul class="mt-4 grid gap-3" role="list">
					{#each current.choices as choice (choice)}
						{@const state = choiceState(choice)}
						<li>
							<button
								type="button"
								class={choiceClass({ state })}
								onclick={() => handleChoice(choice)}
								disabled={locked}
								aria-pressed={selectedChoice === choice}
							>
								<span>{choice}</span>
								<span
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
									aria-hidden="true"
								>
									{#if state === 'correct'}
										<span
											class="flex h-8 w-8 items-center justify-center rounded-full bg-success text-on-primary"
										>
											<Check aria-hidden="true" />
										</span>
									{:else if state === 'wrong'}
										<span
											class="flex h-8 w-8 items-center justify-center rounded-full bg-error text-on-primary"
										>
											<X aria-hidden="true" />
										</span>
									{:else if state === 'revealed'}
										<span
											class="flex h-8 w-8 items-center justify-center rounded-full bg-success/70 text-on-primary"
										>
											<Check aria-hidden="true" />
										</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>

				<!-- Live region for screen readers — announces feedback. -->
				<p class="sr-only" aria-live="polite">
					{#if locked && selectedChoice}
						{#if isCorrectChoiceWasPicked()}
							Correct. {current.scripture.reference}.
						{:else}
							Not quite. The reference was {current.scripture.reference}.
						{/if}
					{/if}
				</p>
			</div>
		{:else}
			<!-- End card -->
			<div
				class={cn(
					'relative mx-auto max-w-2xl overflow-hidden p-8 md:p-12',
					'rounded-[2.5rem] md:rounded-[3rem]',
					'bg-surface-container-lowest shadow-floating'
				)}
			>
				<p class="eyebrow">You scored</p>
				<div class="flex items-baseline gap-3">
					<span class="font-serif text-hero-lg text-primary">{score}</span>
					<span class="font-serif text-display-sm text-on-surface-variant">
						/ {questions.length}
					</span>
				</div>

				<h3 class="mt-6 font-serif text-display-md md:text-display-lg">
					{#if score === questions.length}
						Want the other {TOTAL_SCRIPTURES - questions.length}?
					{:else if score >= 3}
						Nice round. Want the other {TOTAL_SCRIPTURES - questions.length}?
					{:else}
						Worth a closer look. Want all {TOTAL_SCRIPTURES}?
					{/if}
				</h3>
				<p class="mt-4 max-w-xl text-body-lg text-on-surface-variant">
					Mastery tracking, three more game modes, and the Sidekick AI — all inside the
					app.
				</p>

				{#if missed.length > 0}
					<div class="mt-8 rounded-2xl bg-surface-container-low p-5">
						<p class="text-label-md uppercase tracking-[1px] text-on-surface-variant">
							A second look
						</p>
						<ul class="mt-3 grid gap-3">
							{#each missed as miss (miss.scripture.id)}
								<li class="text-body-md">
									<span class="font-semibold text-on-surface">
										{miss.scripture.reference}
									</span>
									<span class="text-on-surface-variant">
										— &ldquo;{trimWrappingQuotes(
											miss.scripture.keyPhrase
										)}&rdquo;
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="mt-10 flex flex-col gap-3">
					<StoreButtons size="default" showComingSoon />
					<p class="text-body-sm text-on-surface-variant">
						The path forward is the app. No "play again" — go master it for real.
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<!--
  Local keyframes for the demo feedback animations. CLAUDE.md allows
  scoped <style> blocks when utility classes can't do the job; shake and
  the soft pulse aren't in the global Tailwind config (only `float` is).

  Both are gated through Tailwind's `motion-safe:` variant on the
  consuming class, so prefers-reduced-motion users see the color/icon
  signal without the motion.
-->
<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-8px);
		}
		40% {
			transform: translateX(8px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(4px);
		}
	}
	@keyframes pulse-soft {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.03);
		}
	}
	:global(.animate-shake) {
		animation: shake 400ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(.animate-pulse-soft) {
		animation: pulse-soft 300ms cubic-bezier(0.22, 1, 0.36, 1);
	}
</style>
