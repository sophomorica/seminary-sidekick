<!--
  Classroom cut-out tiles for Beginner / Intermediate Scripture Builder.
  Several large tiles per US Letter page — not one phrase per page.
-->
<script lang="ts">
	import type { Scripture } from '$lib/data/types';
	import type { TapDifficulty } from '$lib/scripture-builder/chunking';
	import { LEVEL_COPY } from '$lib/scripture-builder/printouts';

	let {
		scripture,
		difficulty,
		chunks
	}: {
		scripture: Scripture;
		difficulty: TapDifficulty;
		chunks: string[];
	} = $props();

	const twoCol = $derived(chunks.length > 5);
	const copy = $derived(LEVEL_COPY[difficulty]);
</script>

<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
	<header
		class="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-primary pb-3"
	>
		<div>
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Scripture Builder
			</p>
			<h1 class="font-serif text-display-sm text-primary md:text-display-md">
				{scripture.reference}
			</h1>
		</div>
		<div class="text-right">
			<p
				class="inline-block rounded-full bg-primary px-3 py-1 text-label-sm font-semibold tracking-wide text-on-primary uppercase"
			>
				{copy.label}
			</p>
			<p class="mt-1 text-body-sm text-on-surface-variant">
				US Letter · cut-out tiles · {scripture.name}
			</p>
		</div>
	</header>

	<p class="mb-4 text-body-md text-on-surface-variant">
		Cut on the dashed lines. Put the tiles on a board so the class can see them from across the
		room. Same phrase chunks as {copy.label} Scripture Builder in the app.
	</p>

	<ul
		class={twoCol
			? 'grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-2'
			: 'flex flex-col gap-3'}
		aria-label={`${copy.label} phrase tiles`}
	>
		{#each chunks as phrase, index (index)}
			<li
				class="flex min-h-[1.45in] items-center rounded-[1.25rem] border-2 border-dashed border-outline bg-surface-container-low px-5 py-4 print:min-h-[1.5in]"
			>
				<p
					class="font-serif text-[1.85rem] leading-tight text-on-surface italic md:text-[2.15rem] print:text-[32pt]"
				>
					{phrase}
				</p>
			</li>
		{/each}
	</ul>

	<footer class="mt-4 flex flex-wrap justify-between gap-2 text-label-sm text-on-surface-variant">
		<p>{scripture.fullText}</p>
		<p>seminarysidekick.com</p>
	</footer>
</article>
