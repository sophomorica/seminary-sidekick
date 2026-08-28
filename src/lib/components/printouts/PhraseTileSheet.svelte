<!--
  Classroom cut-out tiles for Beginner / Intermediate Scripture Builder.
  Two-column grid of smaller dashed tiles so longer verses fit US Letter.
  Still several tiles per page — not one phrase per page. Unnumbered. Mixed.
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

	const copy = $derived(LEVEL_COPY[difficulty]);
</script>

<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
	<header
		class="mb-3 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-primary pb-2"
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

	<p class="mb-3 text-body-sm text-on-surface-variant">
		Cut on the dashed lines. Mix the pieces on a board — they are not in order. Same phrase
		chunks as {copy.label} Scripture Builder in the app.
	</p>

	<ul
		class="grid grid-cols-2 gap-2 print:grid-cols-2"
		aria-label={`${copy.label} phrase tiles`}
		data-tile-grid="2"
	>
		{#each chunks as phrase, tileKey (`${tileKey}-${phrase}`)}
			<li
				class="flex min-h-[0.62in] items-center rounded-2xl border-2 border-dashed border-outline bg-surface-container-low px-3 py-2 print:min-h-[0.58in]"
			>
				<p
					class="font-serif text-[1.15rem] leading-snug text-on-surface italic md:text-[1.25rem] print:text-[16pt]"
				>
					{phrase}
				</p>
			</li>
		{/each}
	</ul>

	<footer class="mt-3 text-label-sm text-on-surface-variant">
		<p>seminarysidekick.com</p>
	</footer>
</article>
