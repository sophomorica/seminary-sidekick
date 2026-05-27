<!--
  ScriptureMatchDemo — TASK-B-021

  The taster: 8 random doctrinal-mastery scriptures, presented as two
  shuffled columns of pills (key phrases on the left, references on the
  right). Tap one from each side; correct match fades out, wrong match
  shakes and resets. Eight pairs cleared → end card with App Store CTA.

  Per THEME.md:
    - No-Line. Surfaces separate via tone + shadow.
    - Smooth Stones. Cards are rounded-3xl/rounded-2xl, end card rounded-5xl.
    - Tinted Shadows. shadow-editorial / shadow-floating only.
    - Motion. ease-out-soft, brief 300/400ms feedback, respect prefers-reduced-motion.
    - Color is never the only signal — Check/X icons + aria-live region back it up.

  Data source: $lib/data/scriptures (helpers module). Never imports the
  JSON directly — the Flutter app owns the corpus.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, X, Sparkles } from 'lucide-svelte';
	import { pickRandomScriptures } from '$lib/data/scriptures';
	import { BOOK_META } from '$lib/data/types';
	import type { Scripture } from '$lib/data/types';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { cn } from '$lib/utils';

	const PAIR_COUNT = 8;

	type Side = 'phrase' | 'reference';

	type Item = {
		/** Stable key for {#each} — independent from scripture id so phrase/ref get distinct keys. */
		key: string;
		side: Side;
		scriptureId: string;
		scripture: Scripture;
	};

	type ItemStatus = 'idle' | 'wrong' | 'matched';

	/**
	 * Deterministic-ish in-place Fisher-Yates. Mutates and returns the
	 * same array for convenience.
	 */
	function shuffle<T>(arr: T[]): T[] {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	// ─── State ────────────────────────────────────────────────────
	let phrases = $state<Item[]>([]);
	let references = $state<Item[]>([]);
	/** Per-item status. Keyed by `Item.key`. Defaults to 'idle'. */
	let statusByKey = $state<Record<string, ItemStatus>>({});
	/** Once an item is matched, it stays in the layout but is hidden
	    (opacity 0, pointer-events none) so the grid doesn't reflow. */
	let hiddenByKey = $state<Record<string, boolean>>({});
	/** The currently selected item, if any. Always belongs to one side. */
	let selected = $state<Item | null>(null);
	let matchedCount = $state(0);
	/** aria-live message; cleared after a beat so the same word can reannounce. */
	let liveMessage = $state('');
	/** End-card visibility — separate from matchedCount so we can defer
	    the reveal until the last fade-out completes. */
	let showEndCard = $state(false);
	/** Confetti burst guard so we only fire once. */
	let confettiFired = false;

	// ─── Setup ────────────────────────────────────────────────────
	onMount(() => {
		const picks = pickRandomScriptures(PAIR_COUNT);
		const phraseItems: Item[] = picks.map((s) => ({
			key: `phrase-${s.id}`,
			side: 'phrase',
			scriptureId: s.id,
			scripture: s
		}));
		const refItems: Item[] = picks.map((s) => ({
			key: `ref-${s.id}`,
			side: 'reference',
			scriptureId: s.id,
			scripture: s
		}));
		phrases = shuffle(phraseItems);
		references = shuffle(refItems);
	});

	// ─── Interaction ──────────────────────────────────────────────
	function announce(msg: string) {
		// Toggle to force re-announce even for identical strings.
		liveMessage = '';
		// Set on the next microtask so SRs see the change.
		queueMicrotask(() => {
			liveMessage = msg;
		});
	}

	function onItemClick(item: Item) {
		if (hiddenByKey[item.key]) return;
		if (statusByKey[item.key] === 'wrong') return; // mid-shake, ignore

		// Deselect by tapping the same item again.
		if (selected && selected.key === item.key) {
			selected = null;
			return;
		}

		// Replace same-side selection (e.g. tapped one phrase then another).
		if (!selected || selected.side === item.side) {
			selected = item;
			return;
		}

		// We have a cross-side pair to evaluate.
		const a = selected;
		const b = item;
		selected = null;

		if (a.scriptureId === b.scriptureId) {
			handleMatch(a, b);
		} else {
			handleMismatch(a, b);
		}
	}

	function handleMatch(a: Item, b: Item) {
		statusByKey = { ...statusByKey, [a.key]: 'matched', [b.key]: 'matched' };
		announce(`Matched: ${a.scripture.reference}.`);

		// Fade out after the success pulse lands.
		setTimeout(() => {
			hiddenByKey = { ...hiddenByKey, [a.key]: true, [b.key]: true };
			matchedCount += 1;
			if (matchedCount >= PAIR_COUNT) {
				// One last beat so the final pair finishes its fade before
				// the end card overlays in.
				setTimeout(() => {
					showEndCard = true;
					maybeFireConfetti();
				}, 350);
			}
		}, 320);
	}

	function handleMismatch(a: Item, b: Item) {
		statusByKey = { ...statusByKey, [a.key]: 'wrong', [b.key]: 'wrong' };
		announce('Not a match.');

		// Clear wrong status after the shake completes.
		setTimeout(() => {
			statusByKey = { ...statusByKey, [a.key]: 'idle', [b.key]: 'idle' };
		}, 450);
	}

	async function maybeFireConfetti() {
		if (confettiFired) return;
		confettiFired = true;
		// Respect reduced-motion. (The global app.css rule also crushes
		// animation-duration, but confetti is canvas-based and slips through.)
		const prefersReduced =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced) return;
		try {
			const mod = await import('canvas-confetti');
			const confetti = mod.default;
			confetti({
				particleCount: 80,
				spread: 70,
				startVelocity: 35,
				origin: { y: 0.6 },
				// Brand colors only per THEME.md "Confetti"
				colors: ['#94492C', '#A3CFC6', '#CCA72F', '#5B8ABF']
			});
		} catch {
			// canvas-confetti not installed yet — silently no-op. The
			// dependency is declared in package.json; user must pnpm install.
		}
	}

	// Derived helper — give each item its visual classes.
	function itemClass(item: Item): string {
		const status = statusByKey[item.key] ?? 'idle';
		const hidden = hiddenByKey[item.key];
		const isSelected = selected?.key === item.key;

		return cn(
			// Base pill card
			'group relative w-full text-left',
			'rounded-2xl p-4 md:p-5 min-h-[64px]',
			'bg-surface-container-lowest text-on-surface',
			'shadow-editorial',
			'transition-all duration-200 ease-out-soft',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			// Hover lift (only when interactable)
			!hidden &&
				status === 'idle' &&
				'hover:-translate-y-0.5 hover:shadow-floating cursor-pointer',
			// Selected state
			isSelected && 'ring-2 ring-primary scale-[1.02] shadow-floating',
			// Match success — soft success tint + scale pulse
			status === 'matched' && 'bg-success/20 ring-2 ring-success scale-[1.03]',
			// Wrong — soft error tint + shake animation
			status === 'wrong' && 'bg-error/10 ring-2 ring-error/60 animate-demo-shake',
			// Hidden after match — fade out, take no clicks
			hidden && 'opacity-0 pointer-events-none'
		);
	}

	function bookChipClass(item: Item): string {
		// Small chip used only for color coding. Combine with the
		// short label so it carries semantics on its own.
		return cn(
			'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm uppercase tracking-wide',
			'text-on-primary',
			BOOK_META[item.scripture.book].tailwindBg
		);
	}
</script>

<section
	id="scripture-match-demo"
	class="relative mx-auto w-full max-w-5xl px-4 md:px-8"
	aria-labelledby="scripture-match-heading"
>
	<header class="mx-auto mb-8 max-w-2xl text-center md:mb-12">
		<p class="eyebrow">Scripture Match</p>
		<h2 id="scripture-match-heading" class="font-serif text-display-sm md:text-display-md">
			Eight scriptures. Match the phrase to the reference.
		</h2>
		<p class="mt-3 text-body-md text-on-surface-variant md:text-body-lg">
			Tap a key phrase, then tap the reference it belongs to. Get all eight to win.
		</p>
		<p class="mt-4 text-body-sm text-on-surface-variant" aria-live="polite">
			Matched <strong class="text-on-surface">{matchedCount}</strong> of {PAIR_COUNT}
		</p>
	</header>

	{#if !showEndCard}
		<div class="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8" role="group" aria-label="Matching board">
			<!-- Key phrases column -->
			<ul class="flex flex-col gap-3 md:gap-4" aria-label="Key phrases">
				{#each phrases as item (item.key)}
					<li>
						<button
							type="button"
							class={itemClass(item)}
							onclick={() => onItemClick(item)}
							aria-pressed={selected?.key === item.key}
							aria-label={`Key phrase: ${item.scripture.keyPhrase}`}
							disabled={hiddenByKey[item.key]}
						>
							<div class="flex items-start gap-3">
								<span class={bookChipClass(item)} aria-hidden="true">
									{BOOK_META[item.scripture.book].short}
								</span>
								<!-- Status icon — color is never the only signal -->
								<span
									class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center"
									aria-hidden="true"
								>
									{#if statusByKey[item.key] === 'matched'}
										<Check class="text-success" />
									{:else if statusByKey[item.key] === 'wrong'}
										<X class="text-error" />
									{/if}
								</span>
							</div>
							<p class="mt-2 text-body-md leading-snug md:text-body-lg">
								{item.scripture.keyPhrase}
							</p>
						</button>
					</li>
				{/each}
			</ul>

			<!-- References column -->
			<ul class="flex flex-col gap-3 md:gap-4" aria-label="Scripture references">
				{#each references as item (item.key)}
					<li>
						<button
							type="button"
							class={itemClass(item)}
							onclick={() => onItemClick(item)}
							aria-pressed={selected?.key === item.key}
							aria-label={`Reference: ${item.scripture.reference}`}
							disabled={hiddenByKey[item.key]}
						>
							<div class="flex items-start gap-3">
								<span class={bookChipClass(item)} aria-hidden="true">
									{BOOK_META[item.scripture.book].short}
								</span>
								<span
									class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center"
									aria-hidden="true"
								>
									{#if statusByKey[item.key] === 'matched'}
										<Check class="text-success" />
									{:else if statusByKey[item.key] === 'wrong'}
										<X class="text-error" />
									{/if}
								</span>
							</div>
							<p class="mt-2 font-serif text-lg italic leading-snug md:text-xl">
								{item.scripture.reference}
							</p>
							<p class="mt-1 text-body-sm text-on-surface-variant">
								{BOOK_META[item.scripture.book].label}
							</p>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- End card — surfaces after the final fade completes -->
	{#if showEndCard}
		<div
			class="mx-auto mt-4 max-w-2xl rounded-5xl bg-surface-container-lowest p-8 text-center shadow-floating md:p-12"
			role="region"
			aria-labelledby="scripture-match-endcard-heading"
		>
			<span
				class="inline-flex items-center justify-center rounded-full bg-tertiary-fixed/60 p-3 text-tertiary"
				aria-hidden="true"
			>
				<Sparkles />
			</span>
			<h3
				id="scripture-match-endcard-heading"
				class="mt-4 font-serif text-display-md md:text-display-lg"
			>
				8 matched. 92 to go.
			</h3>
			<p class="mx-auto mt-3 max-w-md text-body-md text-on-surface-variant md:text-body-lg">
				Master all 100 inside the app, with mastery tracking, the Scripture Builder, and the
				Sidekick AI.
			</p>
			<div class="mt-8 flex justify-center">
				<StoreButtons size="default" showComingSoon />
			</div>
		</div>
	{/if}

	<!-- Visually hidden live region for screen readers -->
	<div class="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</div>
</section>

