<!--
  Print-ready US Letter sheet. Nav/footer are hidden by the root layout
  on this path. @page letter lives in app.css (utilities cannot set page size).
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import PhraseTileSheet from '$lib/components/printouts/PhraseTileSheet.svelte';
	import WriteItDownSheet from '$lib/components/printouts/WriteItDownSheet.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import {
		LEVEL_COPY,
		printoutPdfPath,
		printoutSheetPath
	} from '$lib/scripture-builder/printouts';
	import { ArrowLeft, Download, Printer } from 'lucide-svelte';

	let { data } = $props();

	const copy = $derived(LEVEL_COPY[data.level]);
	const pageTitle = $derived(
		`${data.scripture.reference} · ${copy.label} printout — ${SITE_NAME}`
	);
	const pageDescription = $derived(
		`US Letter ${copy.label} Scripture Builder printout for ${data.scripture.reference}.`
	);
	const canonical = $derived(`${SITE_URL}${printoutSheetPath(data.slug, data.level)}`);

	function printSheet() {
		window.print();
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta name="robots" content="noindex" />
</svelte:head>

<div
	class="print-toolbar print:hidden border-b border-outline-variant/40 bg-surface-container-lowest px-4 py-4 md:px-8"
>
	<div class="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3">
		<Button href="/teachers/printouts" variant="ghost" size="sm">
			<ArrowLeft aria-hidden="true" />
			All printouts
		</Button>
		<div class="flex flex-wrap gap-2">
			<Button variant="primary" size="sm" onclick={printSheet}>
				<Printer aria-hidden="true" />
				Print / Save as PDF
			</Button>
			<Button
				href={printoutPdfPath(data.slug, data.level)}
				variant="outlined"
				size="sm"
				download
			>
				<Download aria-hidden="true" />
				Download PDF
			</Button>
		</div>
	</div>
</div>

<div class="bg-surface px-4 py-8 md:px-8 print:bg-white print:px-0 print:py-0">
	{#if data.level === 'advanced'}
		<WriteItDownSheet scripture={data.scripture} />
	{:else}
		<PhraseTileSheet scripture={data.scripture} difficulty={data.level} chunks={data.chunks} />
	{/if}
</div>
