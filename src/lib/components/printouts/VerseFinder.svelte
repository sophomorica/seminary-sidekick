<!--
  Scripture finder for teacher printouts.
  Search + book facets + a result list. Not a 100-item select.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
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
	let pickedSlug = $state('');

	const facets: FinderBook[] = ['all', ...BOOK_ORDER];
	const hits = $derived(findPrintoutVerses(query, book));
	const thisWeekHits = $derived(
		thisWeek.slugs.flatMap((slug): FinderHit[] => {
			const scripture = loadPrintoutScripture(slug);
			return scripture ? [{ slug, scripture }] : [];
		})
	);

	const activeSlug = $derived(
		pickedSlug || selectedSlug || thisWeek.slugs[0] || DEFAULT_PRINTOUT_SLUG
	);
	const scripture = $derived(
		loadPrintoutScripture(activeSlug) ?? loadPrintoutScripture(DEFAULT_PRINTOUT_SLUG)
	);
	const hasReadyPdf = $derived(printoutHasStaticPdf(activeSlug));
	const userPicked = $derived(Boolean(pickedSlug || selectedSlug));
	const cfmPin = $derived(
		!userPicked && (thisWeek.kind === 'doctrinal-mastery' || thisWeek.kind === 'proximal')
	);
	const pinHits = $derived.by((): FinderHit[] => {
		if (userPicked && scripture) {
			return [{ slug: activeSlug, scripture }];
		}
		return thisWeekHits;
	});
	const pinLabel = $derived(cfmPin ? thisWeek.label : 'Selected scripture');
	const pinDetail = $derived(cfmPin ? thisWeek.detail : (scripture?.keyPhrase ?? ''));

	function choose(slug: string) {
		pickedSlug = slug;
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

	function tileClass(active: boolean): string {
		return [
			'flex min-h-11 w-full items-center rounded-[1.25rem] px-3 py-2 text-left',
			'font-serif text-body-sm leading-snug transition-colors duration-150 ease-out-soft',
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

	<div
		data-this-week={thisWeek.kind}
		class="rounded-[1.5rem] bg-primary-fixed px-4 py-3"
		aria-labelledby="this-week-heading"
	>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div class="min-w-0">
				<p class="text-xs font-semibold tracking-[1.5px] text-primary uppercase">
					{pinLabel}
				</p>
				<h3 id="this-week-heading" class="sr-only">
					{pinHits.map((hit) => hit.scripture.reference).join(' · ') || pinLabel}
				</h3>
				{#if pinDetail}
					<p class="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">
						{pinDetail}
					</p>
				{/if}
				<ul class="mt-2 space-y-2" aria-label={pinLabel}>
					{#each pinHits as hit (hit.slug)}
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
			<TooltipProvider delayDuration={200}>
				<nav class="flex shrink-0 flex-wrap gap-2" aria-label="Print this scripture">
					{#each PRINTOUT_LEVELS as level (level)}
						{@const copy = LEVEL_COPY[level]}
						<Tooltip>
							<TooltipTrigger>
								{#snippet child({ props })}
									<Button
										{...props}
										href={printoutSheetPath(activeSlug, level)}
										variant="outlined"
										size="sm"
										class="min-h-11"
										title={copy.blurb}
										aria-label="{copy.action} — {copy.label}"
									>
										{copy.label}
									</Button>
								{/snippet}
							</TooltipTrigger>
							<TooltipContent
								side="top"
								sideOffset={8}
								class="max-w-xs flex-col items-start text-left"
							>
								{copy.blurb}
							</TooltipContent>
						</Tooltip>
					{/each}
				</nav>
			</TooltipProvider>
		</div>
	</div>

	<div>
		<p class="text-body-sm text-on-surface-variant">
			{hits.length} of {PRINTOUT_VERSE_COUNT} verses
		</p>
		<TooltipProvider delayDuration={200}>
			{#if hits.length === 0}
				<p class="mt-3 text-body-md text-on-surface-variant">
					No verses match that search.
				</p>
			{:else}
				<ul
					class="mt-3 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 md:grid-cols-3"
					aria-label="Matching scriptures"
				>
					{#each hits as hit (hit.slug)}
						<li>
							<Tooltip>
								<TooltipTrigger>
									{#snippet child({ props })}
										<button
											{...props}
											type="button"
											class={tileClass(activeSlug === hit.slug)}
											aria-pressed={activeSlug === hit.slug}
											aria-label={hit.scripture.reference}
											data-verse-slug={hit.slug}
											title={hit.scripture.keyPhrase}
											onpointerdown={() => choose(hit.slug)}
											onclick={() => choose(hit.slug)}
										>
											{hit.scripture.reference}
											<span class="sr-only">
												{hit.scripture.name}. {hit.scripture.keyPhrase}
											</span>
										</button>
									{/snippet}
								</TooltipTrigger>
								<TooltipContent
									side="top"
									sideOffset={8}
									class="max-w-sm flex-col items-start text-left"
								>
									<span class="font-serif text-xs">{hit.scripture.name}</span>
									<span class="text-xs leading-relaxed"
										>{hit.scripture.keyPhrase}</span
									>
								</TooltipContent>
							</Tooltip>
						</li>
					{/each}
				</ul>
			{/if}

			{#if scripture}
				<Tooltip>
					<TooltipTrigger class="mt-2 block w-full cursor-help text-left">
						{#snippet child({ props })}
							<div {...props} title={scripture.fullText}>
								<blockquote class="scripture line-clamp-4 text-left">
									“{scripture.fullText}”
									<footer>{scripture.reference} — {scripture.name}</footer>
								</blockquote>
							</div>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent
						side="top"
						sideOffset={8}
						class="max-h-72 max-w-md flex-col items-start overflow-y-auto text-left"
					>
						<span class="font-serif text-xs">
							{scripture.reference} — {scripture.name}
						</span>
						<span class="text-xs leading-relaxed">“{scripture.fullText}”</span>
					</TooltipContent>
				</Tooltip>
			{/if}
		</TooltipProvider>
	</div>

	{#key activeSlug}
		<ul class="space-y-3" aria-label="Printout levels">
			{#each PRINTOUT_LEVELS as level (level)}
				{@const copy = LEVEL_COPY[level]}
				<li
					class="group relative flex flex-wrap items-center justify-between gap-3 rounded-[2rem] bg-surface-container-low px-5 py-3"
				>
					<h3
						class="font-serif text-headline-sm text-on-surface underline decoration-dotted decoration-outline-variant underline-offset-4"
						title={copy.blurb}
						aria-describedby="printout-level-{level}-blurb"
					>
						{copy.label}
					</h3>
					<p id="printout-level-{level}-blurb" class="sr-only">{copy.blurb}</p>
					<p
						aria-hidden="true"
						class="pointer-events-none absolute bottom-full left-5 right-5 z-10 mb-2 hidden rounded-[1.25rem] bg-on-surface px-3 py-2 text-body-sm text-surface shadow-editorial group-hover:block group-focus-within:block sm:right-auto sm:max-w-xs"
					>
						{copy.blurb}
					</p>
					<div class="flex shrink-0 flex-wrap items-center gap-2">
						<Button href={printoutSheetPath(activeSlug, level)} variant="primary">
							<Printer aria-hidden="true" />
							{copy.action}
						</Button>
						{#if hasReadyPdf}
							<Button
								href={printoutPdfPath(activeSlug, level)}
								variant="outlined"
								size="icon"
								download
								aria-label="Download PDF"
							>
								<Download aria-hidden="true" />
							</Button>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/key}
</div>
