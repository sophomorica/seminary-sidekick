<!--
  Compact finder preview of the classroom sheet.
  Same mixed tiles or first-letter hints as the print page — a thumbnail,
  not another full US Letter sheet sitting on the library page.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Scripture } from '$lib/data/types';
	import { advancedHintLines } from '$lib/scripture-builder/advancedHints';
	import {
		LEVEL_COPY,
		printoutHasStaticPdf,
		printoutPdfPath,
		printoutSheetPath,
		type PrintoutLevel
	} from '$lib/scripture-builder/printouts';
	import { Download, Printer } from 'lucide-svelte';

	let {
		slug,
		level,
		scripture,
		chunks
	}: {
		slug: string;
		level: PrintoutLevel;
		scripture: Scripture;
		chunks: string[];
	} = $props();

	const copy = $derived(LEVEL_COPY[level]);
	const hasPdf = $derived(printoutHasStaticPdf(slug));
	const previewLimit = 8;
	const visibleChunks = $derived(chunks.slice(0, previewLimit));
	const hiddenCount = $derived(Math.max(0, chunks.length - previewLimit));
	const hintLines = $derived(advancedHintLines(scripture.fullText));
	const visibleHints = $derived(hintLines.slice(0, 4));
	const hiddenHints = $derived(Math.max(0, hintLines.length - visibleHints.length));
</script>

<section
	data-printout-preview
	data-preview-level={level}
	class="space-y-3"
	aria-labelledby="printout-preview-heading"
>
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h3 id="printout-preview-heading" class="font-serif text-headline-sm">
			{copy.label} preview
		</h3>
		<div class="flex flex-wrap items-center gap-2">
			<Button href={printoutSheetPath(slug, level)} variant="primary">
				<Printer aria-hidden="true" />
				{copy.action}
			</Button>
			{#if hasPdf}
				<Button
					href={printoutPdfPath(slug, level)}
					variant="outlined"
					download
					aria-label="Download PDF"
				>
					<Download aria-hidden="true" />
					Save PDF
				</Button>
			{/if}
		</div>
	</div>

	<a
		href={printoutSheetPath(slug, level)}
		class="block rounded-[2rem] bg-surface-container-lowest p-4 shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
		aria-label="{copy.action} — {copy.label} sheet for {scripture.reference}"
	>
		<p class="text-xs font-semibold tracking-[1.5px] text-primary uppercase">
			{scripture.reference}
		</p>
		{#if level === 'advanced'}
			<div class="mt-3 rounded-[1.25rem] bg-secondary-container px-4 py-3">
				<p
					class="font-serif text-body-sm leading-relaxed tracking-wide text-on-secondary-container"
				>
					{#each visibleHints as line, lineKey (`${lineKey}-${line}`)}
						<span class="block">{line}</span>
					{/each}
				</p>
			</div>
			{#if hiddenHints > 0}
				<p class="mt-2 text-body-sm text-on-surface-variant">
					+ {hiddenHints} more hint lines on the sheet
				</p>
			{/if}
		{:else}
			<ul class="mt-3 grid grid-cols-2 gap-2" data-tile-grid="2">
				{#each visibleChunks as phrase, tileKey (`${tileKey}-${phrase}`)}
					<li
						class="flex min-h-11 items-center rounded-[1.25rem] border-2 border-dashed border-outline bg-surface-container-low px-3 py-2"
					>
						<p class="font-serif text-body-sm leading-snug text-on-surface italic">
							{phrase}
						</p>
					</li>
				{/each}
			</ul>
			{#if hiddenCount > 0}
				<p class="mt-2 text-body-sm text-on-surface-variant">
					+ {hiddenCount} more tiles on the sheet
				</p>
			{/if}
		{/if}
	</a>
</section>
