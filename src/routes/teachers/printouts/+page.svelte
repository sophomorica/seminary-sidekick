<!--
  /teachers/printouts — Scripture Builder classroom printouts.

  Full doctrinal-mastery library from `$lib/data/scriptures`.
  Three US Letter levels per verse.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { getScripture, TOTAL_SCRIPTURES } from '$lib/data/scriptures';
	import {
		DEFAULT_PRINTOUT_SLUG,
		LEVEL_COPY,
		PRINTOUT_LEVELS,
		PRINTOUT_VERSE_COUNT,
		loadPrintoutScripture,
		printoutHasStaticPdf,
		printoutPdfPath,
		printoutSheetPath,
		PRINTOUT_VERSE_PARAM,
		printoutSlugFromSearch,
		printoutVersesByBook
	} from '$lib/scripture-builder/printouts';
	import { Printer, Download } from 'lucide-svelte';

	const pageTitle = `Scripture Builder printouts — ${SITE_NAME}`;
	const pageDescription = `Print US Letter Scripture Builder tiles and first-letter hint sheets for all ${PRINTOUT_VERSE_COUNT} doctrinal-mastery verses.`;
	const canonical = `${SITE_URL}/teachers/printouts`;

	const bookGroups = printoutVersesByBook();

	// Uncontrolled select (28c8e2b): a bound value reset the teacher's choice.
	// Prerender forbids url.searchParams — start on the signed-off default, apply ?verse= in the browser.
	let selectedSlug = $state(DEFAULT_PRINTOUT_SLUG);

	const scripture = $derived(
		loadPrintoutScripture(selectedSlug) ?? loadPrintoutScripture(DEFAULT_PRINTOUT_SLUG)
	);
	const hasReadyPdf = $derived(printoutHasStaticPdf(selectedSlug));
	const levels = PRINTOUT_LEVELS;

	function applySlugFromUrl() {
		if (!browser) return;
		try {
			if (!page.url.searchParams.get(PRINTOUT_VERSE_PARAM)) return;
			selectedSlug = printoutSlugFromSearch(page.url.searchParams);
		} catch {
			return;
		}
		const select = document.getElementById('printout-verse');
		if (select instanceof HTMLSelectElement) select.value = selectedSlug;
	}

	afterNavigate(applySlugFromUrl);

	function attachVerseSelect(element: HTMLElement) {
		const select = element as HTMLSelectElement;
		select.dataset.pickerReady = 'true';
		const onChange = () => {
			if (select.value) selectedSlug = select.value;
		};
		select.addEventListener('change', onChange);
		select.addEventListener('input', onChange);
		return () => {
			delete select.dataset.pickerReady;
			select.removeEventListener('change', onChange);
			select.removeEventListener('input', onChange);
		};
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
			Print compact mixed phrase tiles for the board, or first-letter hints for Advanced. Same
			Beginner and Intermediate chunks as the app. All {TOTAL_SCRIPTURES} doctrinal-mastery verses
			from the app.
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
					data-verse-count={PRINTOUT_VERSE_COUNT}
					data-selected-slug={selectedSlug}
					{@attach attachVerseSelect}
				>
					{#each bookGroups as group (group.book)}
						<optgroup label={group.label}>
							{#each group.verses as verse (verse.slug)}
								{@const option = getScripture(verse.scriptureId)}
								{#if option}
									<option
										value={verse.slug}
										selected={verse.slug === DEFAULT_PRINTOUT_SLUG}
										>{option.reference} — {option.name}</option
									>
								{/if}
							{/each}
						</optgroup>
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
							<Button href={printoutSheetPath(selectedSlug, level)} variant="primary">
								<Printer aria-hidden="true" />
								{copy.action}
							</Button>
							{#if hasReadyPdf}
								<Button
									href={printoutPdfPath(selectedSlug, level)}
									variant="outlined"
									download
								>
									<Download aria-hidden="true" />
									Download PDF
								</Button>
							{/if}
						</div>
					</Card.Root>
				</li>
			{/each}
		</ul>

		<p class="text-body-sm text-on-surface-variant">
			Open a sheet, then use your browser’s Print dialog (Destination: Save as PDF, paper size
			US Letter). Ready PDFs are available for 2 Nephi 2:25.
		</p>
	</div>
</section>
