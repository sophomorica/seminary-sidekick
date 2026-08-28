<!--
  /teachers/printouts — Scripture Builder classroom printouts.

  Full doctrinal-mastery library from `$lib/data/scriptures`.
  Finder + this-week pin. Three US Letter levels per verse.
-->
<script lang="ts">
	import VerseFinder from '$lib/components/printouts/VerseFinder.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { TOTAL_SCRIPTURES } from '$lib/data/scriptures';
	import {
		DEFAULT_PRINTOUT_SLUG,
		LEVEL_COPY,
		PRINTOUT_LEVELS,
		PRINTOUT_VERSE_COUNT,
		loadPrintoutScripture,
		printoutHasStaticPdf,
		printoutPdfPath,
		printoutSheetPath
	} from '$lib/scripture-builder/printouts';
	import { Download, Printer } from 'lucide-svelte';

	let { data } = $props();

	const pageTitle = `Scripture Builder printouts — ${SITE_NAME}`;
	const pageDescription = `Print US Letter Scripture Builder tiles and first-letter hint sheets for all ${PRINTOUT_VERSE_COUNT} doctrinal-mastery verses.`;
	const canonical = `${SITE_URL}/teachers/printouts`;

	const thisWeek = $derived(data.thisWeek);
	let chosenSlug = $state<string | null>(null);
	const selectedSlug = $derived(chosenSlug ?? data.defaultSlug);

	const scripture = $derived(
		loadPrintoutScripture(selectedSlug) ?? loadPrintoutScripture(DEFAULT_PRINTOUT_SLUG)
	);
	const hasReadyPdf = $derived(printoutHasStaticPdf(selectedSlug));
	const levels = PRINTOUT_LEVELS;

	function chooseVerse(slug: string) {
		chosenSlug = slug;
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
			<p class="mt-3 text-body-md text-on-surface-variant">
				This week is pinned. Search by reference, name, or a keyword.
			</p>
			<div class="mt-5">
				<VerseFinder {selectedSlug} {thisWeek} {chooseVerse}>
					{#snippet afterPin()}
						{#if scripture}
							<blockquote class="scripture mt-6 text-left">
								“{scripture.fullText}”
								<footer>{scripture.reference} — {scripture.name}</footer>
							</blockquote>
						{/if}

						<ul class="mt-8 space-y-6" aria-label="Printout levels">
							{#each levels as level (level)}
								{@const copy = LEVEL_COPY[level]}
								<li class="rounded-[2rem] bg-surface-container-low p-6">
									<h3 class="font-serif text-headline-md">{copy.label}</h3>
									<p class="mt-3 text-body-md text-on-surface-variant">
										{copy.blurb}
									</p>
									<div class="mt-6 flex flex-wrap gap-3">
										<Button
											href={printoutSheetPath(selectedSlug, level)}
											variant="primary"
										>
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
								</li>
							{/each}
						</ul>
					{/snippet}
				</VerseFinder>
			</div>
		</div>

		<p class="text-body-sm text-on-surface-variant">
			Open a sheet, then use your browser’s Print dialog (Destination: Save as PDF, paper size
			US Letter). Ready PDFs are available for 2 Nephi 2:25.
		</p>
	</div>
</section>
