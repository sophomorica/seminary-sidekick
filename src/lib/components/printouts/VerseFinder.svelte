<!--
  Scripture finder for teacher printouts.
  Search + book facets + a result list. Not a 100-item select.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { BOOK_META, BOOK_ORDER } from '$lib/data/types';
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
	import type { ThisWeekPin } from '$lib/scripture-builder/thisWeek';
	import {
		findPrintoutVerses,
		type FinderBook,
		type FinderHit
	} from '$lib/scripture-builder/verseFinder';
	import { Download, Printer } from 'lucide-svelte';

	let {
		selectedSlug = $bindable(''),
		thisWeek
	}: {
		selectedSlug: string;
		thisWeek: ThisWeekPin;
	} = $props();

	let query = $state('');
	let book = $state<FinderBook>('all');

	const facets: FinderBook[] = ['all', ...BOOK_ORDER];
	const hits = $derived(findPrintoutVerses(query, book));
	const thisWeekHits = $derived(
		thisWeek.slugs.flatMap((slug): FinderHit[] => {
			const scripture = loadPrintoutScripture(slug);
			return scripture ? [{ slug, scripture }] : [];
		})
	);

	const activeSlug = $derived(selectedSlug || thisWeek.slugs[0] || DEFAULT_PRINTOUT_SLUG);
	const scripture = $derived(
		loadPrintoutScripture(activeSlug) ?? loadPrintoutScripture(DEFAULT_PRINTOUT_SLUG)
	);
	const hasReadyPdf = $derived(printoutHasStaticPdf(activeSlug));

	function choose(slug: string) {
		selectedSlug = slug;
	}

	function facetLabel(facet: FinderBook): string {
		return facet === 'all' ? 'All' : BOOK_META[facet].short;
	}

	function facetKeydown(event: KeyboardEvent) {
		if (
			event.key !== 'ArrowRight' &&
			event.key !== 'ArrowDown' &&
			event.key !== 'ArrowLeft' &&
			event.key !== 'ArrowUp' &&
			event.key !== 'Home' &&
			event.key !== 'End'
		) {
			return;
		}
		event.preventDefault();
		const current = facets.indexOf(book);
		let next: number;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			next = (current + 1) % facets.length;
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			next = (current - 1 + facets.length) % facets.length;
		} else if (event.key === 'Home') {
			next = 0;
		} else {
			next = facets.length - 1;
		}
		const nextBook = facets[next];
		if (!nextBook) return;
		book = nextBook;
		const group = event.currentTarget as HTMLElement;
		queueMicrotask(() => {
			group.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')?.focus();
		});
	}

	function facetClass(active: boolean): string {
		return [
			'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-label-lg',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
			'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			active
				? 'bg-primary text-on-primary'
				: 'bg-surface-container text-on-surface hover:bg-surface-container-high'
		].join(' ');
	}

	function rowClass(active: boolean): string {
		return [
			'w-full scroll-mt-28 cursor-pointer rounded-[1.25rem] px-4 py-3 text-left transition-colors duration-150 ease-out-soft',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
			'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			active
				? 'bg-primary-fixed text-on-surface'
				: 'bg-surface-container-low text-on-surface hover:bg-surface-container'
		].join(' ');
	}
</script>

<div
	id="printout-finder"
	data-verse-count={PRINTOUT_VERSE_COUNT}
	data-selected-slug={activeSlug}
	class="space-y-6"
>
	<div
		data-this-week={thisWeek.kind}
		class="rounded-[2rem] bg-primary-fixed p-5"
		aria-labelledby="this-week-heading"
	>
		<p class="text-xs font-semibold tracking-[1.5px] text-primary uppercase">
			{thisWeek.label}
		</p>
		<h3 id="this-week-heading" class="mt-2 font-serif text-headline-md">
			{thisWeekHits.map((hit) => hit.scripture.reference).join(' · ') || 'This week'}
		</h3>
		<p class="mt-2 text-body-sm text-on-surface-variant">{thisWeek.detail}</p>
		<ul class="mt-4 space-y-2" aria-label="This week’s verses">
			{#each thisWeekHits as hit (hit.slug)}
				<li>
					<button
						type="button"
						class={rowClass(activeSlug === hit.slug)}
						aria-pressed={activeSlug === hit.slug}
						data-this-week-slug={hit.slug}
						onclick={() => choose(hit.slug)}
					>
						<span class="block font-serif text-headline-sm"
							>{hit.scripture.reference}</span
						>
						<span class="mt-1 block text-body-sm text-on-surface-variant"
							>{hit.scripture.name}</span
						>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	{#if scripture}
		<blockquote class="scripture mt-6 text-left">
			“{scripture.fullText}”
			<footer>{scripture.reference} — {scripture.name}</footer>
		</blockquote>
	{/if}

	{#key activeSlug}
		<ul class="mt-8 space-y-6" aria-label="Printout levels">
			{#each PRINTOUT_LEVELS as level (level)}
				{@const copy = LEVEL_COPY[level]}
				<li class="rounded-[2rem] bg-surface-container-low p-6">
					<h3 class="font-serif text-headline-md">{copy.label}</h3>
					<p class="mt-3 text-body-md text-on-surface-variant">
						{copy.blurb}
					</p>
					<div class="mt-6 flex flex-wrap gap-3">
						<Button href={printoutSheetPath(activeSlug, level)} variant="primary">
							<Printer aria-hidden="true" />
							{copy.action}
						</Button>
						{#if hasReadyPdf}
							<Button
								href={printoutPdfPath(activeSlug, level)}
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
	{/key}

	<div>
		<Label for="printout-search">Find a scripture</Label>
		<Input
			id="printout-search"
			type="search"
			class="mt-2"
			placeholder="Reference, name, or keyword — joy, 2 Nephi, Moses"
			autocomplete="off"
			aria-label="Find a scripture"
			bind:value={query}
		/>
	</div>

	<fieldset>
		<legend class="mb-2 text-label-lg text-on-surface">Book</legend>
		<div
			class="flex flex-wrap gap-2"
			role="radiogroup"
			aria-label="Book"
			tabindex="-1"
			onkeydown={facetKeydown}
		>
			{#each facets as facet (facet)}
				<button
					type="button"
					class={facetClass(book === facet)}
					role="radio"
					aria-checked={book === facet}
					tabindex={book === facet ? 0 : -1}
					onclick={() => (book = facet)}
				>
					{facetLabel(facet)}
				</button>
			{/each}
		</div>
	</fieldset>

	<div>
		<p class="text-body-sm text-on-surface-variant">
			{hits.length} of {PRINTOUT_VERSE_COUNT} verses
		</p>
		{#if hits.length === 0}
			<p class="mt-3 text-body-md text-on-surface-variant">No verses match that search.</p>
		{:else}
			<ul
				class="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1"
				aria-label="Matching scriptures"
			>
				{#each hits as hit (hit.slug)}
					<li>
						<button
							type="button"
							class={rowClass(activeSlug === hit.slug)}
							aria-pressed={activeSlug === hit.slug}
							data-verse-slug={hit.slug}
							onclick={() => choose(hit.slug)}
						>
							<span class="block font-serif text-headline-sm"
								>{hit.scripture.reference}</span
							>
							<span class="mt-1 block text-body-sm text-on-surface-variant">
								{hit.scripture.name}
								{#if hit.scripture.keyPhrase}
									— {hit.scripture.keyPhrase}
								{/if}
							</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
