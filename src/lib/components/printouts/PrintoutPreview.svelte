<script lang="ts">
	import { track } from '$lib/analytics/plausible';
	import PrintoutSheet from '$lib/components/printouts/PrintoutSheet.svelte';
	import { Button } from '$lib/components/ui/button';
	import { LEVEL_COPY, printoutSheetPath } from '$lib/scripture-builder/printouts';
	import type { PrintoutSheet as Sheet } from '$lib/scripture-builder/printoutSheet';
	import { Printer } from 'lucide-svelte';

	let { slug, sheet }: { slug: string; sheet: Sheet } = $props();

	const copy = $derived(LEVEL_COPY[sheet.level]);
	const morePages = $derived(sheet.kind === 'tiles' ? sheet.pages.length - 1 : 0);

	function trackPrintoutPrint() {
		track('printout_print');
	}
</script>

<section
	data-printout-preview
	data-preview-level={sheet.level}
	class="space-y-3"
	aria-labelledby="printout-preview-heading"
>
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h3 id="printout-preview-heading" class="font-serif text-headline-sm">
			{copy.label} preview
		</h3>
		<Button
			href={printoutSheetPath(slug, sheet.level)}
			variant="primary"
			onclick={trackPrintoutPrint}
		>
			<Printer aria-hidden="true" />
			{copy.action}
		</Button>
	</div>

	<a
		href={printoutSheetPath(slug, sheet.level)}
		onclick={trackPrintoutPrint}
		class="block rounded-[2rem] bg-surface-container-lowest p-4 shadow-editorial focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
		aria-label="{copy.action} — {copy.label} sheet for {sheet.reference}"
	>
		<!-- zoom shrinks layout size, unlike transform, so the clip box shrinks with it. -->
		<div
			aria-hidden="true"
			inert
			class="pointer-events-none mx-auto h-[11in] w-[8.5in] overflow-hidden [zoom:0.28] sm:[zoom:0.5] md:[zoom:0.62]"
		>
			<PrintoutSheet {sheet} titleHeading={false} />
		</div>
		{#if morePages > 0}
			<p class="mt-2 text-body-sm text-on-surface-variant">
				+ {morePages} more {morePages === 1 ? 'page' : 'pages'} per group on the sheet
			</p>
		{/if}
	</a>
</section>
