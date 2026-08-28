<!--
  Scripture finder for teacher printouts.
  Search + book facets + a result list. Not a 100-item select.
-->
<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { BOOK_META, BOOK_ORDER } from '$lib/data/types';
	import { PRINTOUT_VERSE_COUNT, loadPrintoutScripture } from '$lib/scripture-builder/printouts';
	import type { ThisWeekPin } from '$lib/scripture-builder/thisWeek';
	import {
		findPrintoutVerses,
		type FinderBook,
		type FinderHit
	} from '$lib/scripture-builder/verseFinder';

	let {
		selectedSlug,
		thisWeek,
		onChoose
	}: {
		selectedSlug: string;
		thisWeek: ThisWeekPin;
		onChoose: (slug: string) => void;
	} = $props();

	let query = $state('');
	let book = $state<FinderBook>('all');

	const hits = $derived(findPrintoutVerses(query, book));
	const thisWeekHits = $derived(
		thisWeek.slugs.flatMap((slug): FinderHit[] => {
			const scripture = loadPrintoutScripture(slug);
			return scripture ? [{ slug, scripture }] : [];
		})
	);

	function choose(slug: string) {
		onChoose(slug);
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
			'w-full cursor-pointer rounded-[1.25rem] px-4 py-3 text-left transition-colors duration-150 ease-out-soft',
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
	data-selected-slug={selectedSlug}
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
						class={rowClass(selectedSlug === hit.slug)}
						aria-pressed={selectedSlug === hit.slug}
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
		<div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Book">
			<button
				type="button"
				class={facetClass(book === 'all')}
				role="radio"
				aria-checked={book === 'all'}
				onclick={() => (book = 'all')}
			>
				All
			</button>
			{#each BOOK_ORDER as nextBook (nextBook)}
				<button
					type="button"
					class={facetClass(book === nextBook)}
					role="radio"
					aria-checked={book === nextBook}
					onclick={() => (book = nextBook)}
				>
					{BOOK_META[nextBook].short}
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
							class={rowClass(selectedSlug === hit.slug)}
							aria-pressed={selectedSlug === hit.slug}
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
