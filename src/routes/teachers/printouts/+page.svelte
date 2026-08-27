<!--
  /teachers/printouts — Scripture Builder classroom printouts.

  Proof slice: 2 Nephi 2:25, all three levels, US Letter.
  Factory for the other 99 verses comes after this URL exists.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { getScripture } from '$lib/data/scriptures';
	import {
		LEVEL_COPY,
		PRINTOUT_LEVELS,
		PRINTOUT_VERSES,
		printoutPdfPath,
		printoutSheetPath,
		type PrintoutLevel
	} from '$lib/scripture-builder/printouts';
	import { Printer, Download } from 'lucide-svelte';

	const pageTitle = `Scripture Builder printouts — ${SITE_NAME}`;
	const pageDescription =
		'Print US Letter Scripture Builder tiles and write-it-down sheets for seminary class. Proof verse: 2 Nephi 2:25.';
	const canonical = `${SITE_URL}/teachers/printouts`;

	let selectedSlug = $state(PRINTOUT_VERSES[0].slug);

	const selectedEntry = $derived(
		PRINTOUT_VERSES.find((verse) => verse.slug === selectedSlug) ?? PRINTOUT_VERSES[0]
	);
	const scripture = $derived(getScripture(selectedEntry.scriptureId));

	const levels = PRINTOUT_LEVELS;

	function sheetHref(level: PrintoutLevel): string {
		return printoutSheetPath(selectedSlug, level);
	}

	function pdfHref(level: PrintoutLevel): string {
		return printoutPdfPath(selectedSlug, level);
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<section class="bg-surface pt-16 pb-12 md:pt-24 md:pb-16" aria-labelledby="printouts-headline">
	<div class="mx-auto max-w-3xl px-4 md:px-8">
		<p class="eyebrow">For seminary teachers</p>
		<h1
			id="printouts-headline"
			class="font-serif text-display-lg tracking-tight md:text-hero-lg"
		>
			Scripture Builder printouts
		</h1>
		<p class="mt-6 text-lg leading-relaxed text-on-surface-variant md:text-xl">
			Print large phrase tiles for the board, or a write-it-down sheet. Same Beginner and
			Intermediate chunks as the app. This first page is 2 Nephi 2:25 — more verses come after
			teachers can print this one.
		</p>
	</div>
</section>

<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="printouts-picker">
	<div class="mx-auto max-w-3xl space-y-8 px-4 md:px-8">
		<div class="card">
			<h2 id="printouts-picker" class="font-serif text-headline-lg">Choose a scripture</h2>
			<div class="mt-5">
				<Label for="printout-verse">Scripture</Label>
				<select
					id="printout-verse"
					class="mt-2 h-12 w-full rounded-full border border-outline-variant/40 bg-surface-container-lowest px-5 text-body-md text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
					bind:value={selectedSlug}
				>
					{#each PRINTOUT_VERSES as verse (verse.slug)}
						{@const option = getScripture(verse.scriptureId)}
						{#if option}
							<option value={verse.slug}>{option.reference} — {option.name}</option>
						{/if}
					{/each}
				</select>
			</div>
			{#if scripture}
				<blockquote class="scripture mt-6 text-left">
					“{scripture.fullText}”
					<footer>{scripture.reference} — {scripture.name}</footer>
				</blockquote>
			{/if}
		</div>

		<ul class="space-y-6" aria-label="Printout levels">
			{#each levels as level (level)}
				{@const copy = LEVEL_COPY[level]}
				<li>
					<Card.Root>
						<h3 class="font-serif text-headline-md">{copy.label}</h3>
						<p class="mt-3 text-body-md text-on-surface-variant">{copy.blurb}</p>
						<div class="mt-6 flex flex-wrap gap-3">
							<Button href={sheetHref(level)} variant="primary">
								<Printer aria-hidden="true" />
								{copy.action}
							</Button>
							<Button href={pdfHref(level)} variant="outlined" download>
								<Download aria-hidden="true" />
								Download PDF
							</Button>
						</div>
					</Card.Root>
				</li>
			{/each}
		</ul>

		<p class="text-body-sm text-on-surface-variant">
			Print / Save as PDF: open a sheet, then use your browser’s Print dialog (Destination:
			Save as PDF, paper size US Letter). Or download the ready PDF.
		</p>
	</div>
</section>
