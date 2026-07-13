<script lang="ts">
	import { onMount } from 'svelte';
	import { Clock3, LoaderCircle } from 'lucide-svelte';
	import type { Scripture } from '$lib/data/types';
	import type { GroupSbChunkDifficulty } from '$lib/services/groupPlay';
	import { cn } from '$lib/utils';
	import { buildRaceChunks, DNF_MISTAKE_COUNT, type RaceChunk } from './scriptureBuilder';

	type Props = {
		scripture: Scripture;
		difficulty: GroupSbChunkDifficulty;
		distractorPool: Scripture[];
		timeoutSeconds?: number;
		onfinish: (elapsedMs: number, mistakeCount: number) => void;
	};

	let { scripture, difficulty, distractorPool, timeoutSeconds, onfinish }: Props = $props();
	let targets = $state<RaceChunk[]>([]);
	let pool = $state<RaceChunk[]>([]);
	let usedIds = $state<string[]>([]);
	let nextSlot = $state(0);
	let mistakeCount = $state(0);
	let finished = $state(false);
	let ready = $state(false);
	let shakingId = $state<string | null>(null);
	let remainingMs = $state(0);
	let startedAt = 0;
	let shakeTimer: number | undefined;

	const progressPercent = $derived(
		targets.length > 0 ? Math.min(100, (nextSlot / targets.length) * 100) : 0
	);
	const remainingSeconds = $derived(Math.ceil(remainingMs / 1000));

	onMount(() => {
		const board = buildRaceChunks(scripture, difficulty, distractorPool);
		targets = board.targets;
		pool = board.pool;
		startedAt = performance.now();
		remainingMs = timeoutSeconds ? timeoutSeconds * 1000 : 0;
		ready = true;

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
			if (shakeTimer) window.clearTimeout(shakeTimer);
		};
	});

	function complete(elapsedMs: number, mistakes: number) {
		if (finished) return;
		finished = true;
		onfinish(elapsedMs, mistakes);
	}

	function tapChunk(chunk: RaceChunk) {
		if (finished || usedIds.includes(chunk.id)) return;
		const expected = targets[nextSlot];
		if (!chunk.isDistractor && expected && chunk.text === expected.text) {
			usedIds = [...usedIds, chunk.id];
			nextSlot += 1;
			if (nextSlot >= targets.length) {
				complete(Math.round(performance.now() - startedAt), mistakeCount);
			}
			return;
		}

		mistakeCount += 1;
		shakingId = chunk.id;
		if (shakeTimer) window.clearTimeout(shakeTimer);
		shakeTimer = window.setTimeout(() => {
			shakingId = null;
		}, 400);
	}
</script>

<div class="mt-5">
	<div class="flex items-center justify-between gap-3 text-body-sm text-on-surface-variant">
		<span>{nextSlot} of {targets.length} chunks placed</span>
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
			class="h-full rounded-full bg-primary transition-[width] duration-150"
			style:width={`${progressPercent}%`}
		></div>
	</div>

	{#if !ready}
		<div class="py-16 text-center">
			<LoaderCircle
				class="mx-auto size-7 text-primary motion-safe:animate-spin"
				aria-hidden="true"
			/>
			<p class="mt-3 text-body-md text-on-surface-variant">Preparing the scripture…</p>
		</div>
	{:else}
		<div
			class="mt-6 rounded-3xl bg-surface-container-low p-5 md:p-6"
			aria-label={`Scripture progress: ${nextSlot} of ${targets.length} chunks placed`}
		>
			<ol class="flex flex-wrap gap-x-2 gap-y-3 font-serif text-title-lg leading-relaxed">
				{#each targets as target, index (target.id)}
					<li>
						{#if index < nextSlot}
							<span
								class="font-semibold text-primary underline decoration-primary/20"
							>
								{target.text}
							</span>
						{:else if index === nextSlot && !finished}
							<span
								class="text-primary/55 underline decoration-dashed underline-offset-4"
								aria-hidden="true"
							>
								{'—'.repeat(Math.min(10, Math.max(3, target.text.length)))}
							</span>
						{:else}
							<span class="text-on-surface/15" aria-hidden="true">
								{target.text
									.split(' ')
									.map((word) =>
										'_'.repeat(Math.min(8, Math.max(2, word.length)))
									)
									.join(' ')}
							</span>
						{/if}
					</li>
				{/each}
			</ol>
		</div>

		<div class="my-6 h-px bg-surface-container-high" aria-hidden="true"></div>

		<p class="text-center text-label-md uppercase text-on-surface-variant">
			Tap the next words in order
		</p>
		<ul class="mt-4 flex flex-wrap justify-center gap-2.5" aria-label="Available word chunks">
			{#each pool as chunk (chunk.id)}
				<li>
					<button
						type="button"
						class={cn(
							'focus-ring min-h-11 rounded-xl px-3.5 py-2 font-serif text-body-md font-semibold shadow-editorial transition-all duration-150 ease-out-soft',
							'bg-surface-container-lowest text-on-surface hover:-translate-y-0.5 hover:shadow-floating',
							usedIds.includes(chunk.id) && 'pointer-events-none opacity-20',
							shakingId === chunk.id &&
								'ring-2 ring-error motion-safe:animate-demo-shake'
						)}
						disabled={finished || usedIds.includes(chunk.id)}
						onclick={() => tapChunk(chunk)}
					>
						{chunk.text}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
