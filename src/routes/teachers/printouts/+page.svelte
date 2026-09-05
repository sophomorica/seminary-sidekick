<!--
  /teachers/printouts — Scripture Builder classroom printouts.

  Full doctrinal-mastery library from `$lib/data/scriptures`.
  Finder + this-week pin. Three US Letter levels per verse.
-->
<script lang="ts">
	import VerseFinder from '$lib/components/printouts/VerseFinder.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { TOTAL_SCRIPTURES } from '$lib/data/scriptures';
	import { PRINTOUT_VERSE_COUNT } from '$lib/scripture-builder/printouts';

	let { data } = $props();

	const pageTitle = `Scripture Builder printouts — ${SITE_NAME}`;
	const pageDescription = `Print US Letter Scripture Builder tiles and first-letter hint sheets for all ${PRINTOUT_VERSE_COUNT} doctrinal-mastery verses.`;
	const canonical = `${SITE_URL}/teachers/printouts`;

	const thisWeek = $derived(data.thisWeek);
	let selectedSlug = $state('');
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

<section class="bg-surface pt-8 pb-6 md:pt-12 md:pb-8" aria-labelledby="printouts-headline">
	<div class="mx-auto max-w-3xl px-4 md:px-8">
		<p class="eyebrow">For seminary teachers</p>
		<h1
			id="printouts-headline"
			class="font-serif text-display-md tracking-tight md:text-display-lg"
		>
			Scripture Builder printouts
		</h1>
		<p class="mt-3 text-body-md text-on-surface-variant md:text-lg">
			Print tiles or first-letter hints. Same chunks as the app. All
			{TOTAL_SCRIPTURES} doctrinal-mastery verses.
		</p>
	</div>
</section>

<section class="bg-surface-container-low py-8 md:py-12" aria-labelledby="printouts-picker">
	<div class="mx-auto max-w-3xl space-y-8 px-4 md:px-8">
		<div class="card">
			<h2 id="printouts-picker" class="font-serif text-headline-md">Choose a scripture</h2>
			<p class="mt-2 text-body-sm text-on-surface-variant">
				Search or pick a book, then print Beginner, Intermediate, or Advanced.
			</p>
			<div class="mt-4">
				<VerseFinder bind:selectedSlug {thisWeek} />
			</div>
		</div>

		<p class="text-body-sm text-on-surface-variant">
			Open a sheet, then use your browser’s Print dialog (Destination: Save as PDF, paper size
			US Letter). Ready PDFs are available for 2 Nephi 2:25.
		</p>
	</div>
</section>
