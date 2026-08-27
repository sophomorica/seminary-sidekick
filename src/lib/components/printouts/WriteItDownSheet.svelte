<!--
  Advanced write-it-down sheet. Not cutouts — large reference + blank lines
  so a student at the front of the room can write the verse.
-->
<script lang="ts">
	import type { Scripture } from '$lib/data/types';

	let { scripture }: { scripture: Scripture } = $props();

	const lineIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
</script>

<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
	<header
		class="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-primary pb-3"
	>
		<div>
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Scripture Builder
			</p>
			<p class="mt-2 text-label-md text-on-surface-variant uppercase">{scripture.name}</p>
		</div>
		<p
			class="inline-block rounded-full bg-primary px-3 py-1 text-label-sm font-semibold tracking-wide text-on-primary uppercase"
		>
			Advanced
		</p>
	</header>

	<h1
		class="font-serif text-[2.75rem] leading-none text-primary md:text-[3.5rem] print:text-[48pt]"
	>
		{scripture.reference}
	</h1>

	<p class="mt-4 mb-8 text-body-lg text-on-surface-variant">
		Write the verse from memory. Large enough to use at the board.
	</p>

	<div class="space-y-5" aria-hidden="true">
		{#each lineIndexes as lineIndex (lineIndex)}
			<div class="border-b-2 border-outline-variant pb-6"></div>
		{/each}
	</div>

	<footer class="mt-8 text-label-sm text-on-surface-variant">
		<p>US Letter · write-it-down · seminarysidekick.com</p>
	</footer>
</article>
