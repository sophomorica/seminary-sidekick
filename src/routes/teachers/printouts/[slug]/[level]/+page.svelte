<script lang="ts">
	import { track } from '$lib/analytics/plausible';
	import PrintoutSheet from '$lib/components/printouts/PrintoutSheet.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { printoutLibraryPath, printoutSheetPath } from '$lib/scripture-builder/printouts';
	import { GROUP_LIMIT, groupLetters } from '$lib/scripture-builder/printoutSheet';
	import { ArrowLeft, Minus, Plus, Printer } from 'lucide-svelte';

	let { data } = $props();

	let groupCount = $state(1);

	const sheet = $derived(data.sheet);
	const letters = $derived(groupLetters(groupCount));
	const printedPages = $derived(sheet.kind === 'tiles' ? letters.length * sheet.pages.length : 1);
	const pagesLabel = $derived(`${printedPages} ${printedPages === 1 ? 'page' : 'pages'}`);
	const groupSpan = $derived(
		letters.length === 1 ? `Group ${letters[0]}` : `Groups ${letters[0]}–${letters.at(-1)}`
	);
	const pageTitle = $derived(`${sheet.reference} · ${sheet.levelLabel} printout — ${SITE_NAME}`);
	const pageDescription = $derived(
		`US Letter ${sheet.levelLabel} Scripture Builder printout for ${sheet.reference}.`
	);
	const canonical = $derived(`${SITE_URL}${printoutSheetPath(data.slug, sheet.level)}`);

	async function printSheet() {
		track('printout_print');
		await document.fonts.ready;
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
	class="print-toolbar border-b border-outline-variant/40 bg-surface-container-lowest px-4 py-4 md:px-8 print:hidden"
>
	<div class="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3">
		<Button href={printoutLibraryPath(data.slug)} variant="ghost" size="sm">
			<ArrowLeft aria-hidden="true" />
			All printouts
		</Button>
		<div class="flex flex-wrap items-center gap-3">
			{#if sheet.kind === 'tiles'}
				<div
					role="group"
					aria-labelledby="group-count-label"
					class="flex flex-wrap items-center gap-2"
					data-group-count={groupCount}
				>
					<span id="group-count-label" class="text-label-lg">Groups</span>
					<Button
						variant="outlined"
						size="sm"
						aria-label="Fewer groups"
						disabled={groupCount <= 1}
						onclick={() => (groupCount -= 1)}
					>
						<Minus aria-hidden="true" />
					</Button>
					<output class="min-w-6 text-center font-semibold" aria-live="polite"
						>{groupCount}</output
					>
					<Button
						variant="outlined"
						size="sm"
						aria-label="More groups"
						disabled={groupCount >= GROUP_LIMIT}
						onclick={() => (groupCount += 1)}
					>
						<Plus aria-hidden="true" />
					</Button>
					<p class="text-body-sm text-on-surface-variant" data-print-summary>
						{groupSpan} · {pagesLabel} · one sheet per group of 3–4
					</p>
				</div>
			{:else}
				<p class="text-body-sm text-on-surface-variant" data-print-summary>
					{pagesLabel} · set Copies in the print dialog
				</p>
			{/if}
			<Button variant="primary" size="sm" onclick={printSheet}>
				<Printer aria-hidden="true" />
				Print / Save as PDF
			</Button>
		</div>
	</div>
</div>

<div
	class="overflow-x-auto bg-surface px-4 py-8 md:px-8 print:overflow-visible print:bg-white print:p-0"
>
	<PrintoutSheet {sheet} groups={groupCount} />
</div>
