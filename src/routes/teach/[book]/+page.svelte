<!-- /teach/[book] — ideas tagged to one book, grouped by type, with an honest note when it's thin. -->
<script lang="ts">
	import IdeaBrowser from '$lib/components/teach/IdeaBrowser.svelte';
	import IdeaCard from '$lib/components/teach/IdeaCard.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { COURSE_LABELS } from '$lib/teach/ideas';

	let { data } = $props();
	const name = $derived(data.book.name === 'D&C' ? 'Doctrine and Covenants' : data.book.name);
	const pageTitle = $derived(`${name} teaching ideas — ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}/teach/${data.book.slug}`);
	const THIN = 3;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`Short, original seminary teaching ideas for ${name}.`} />
	<link rel="canonical" href={canonical} />
</svelte:head>

<main class="section mx-auto max-w-7xl px-4 md:px-8">
	<p class="mb-4">
		<a href="/teach" class="text-primary hover:underline">← All teaching ideas</a>
	</p>
	<header class="mb-10">
		<p class="eyebrow">{COURSE_LABELS[data.book.course]}</p>
		<h1 class="font-serif text-display-lg">{name}</h1>
		<p class="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
			Teaching ideas with full how-tos, written in our own words. Book tags are a best guess.
		</p>
	</header>

	<IdeaBrowser selected={data.selected}>
		{#if data.ideas.length === 0}
			<div class="card text-center" data-testid="book-empty">
				<h2 class="font-serif text-display-sm">We don't have ideas for {name} yet.</h2>
				<p class="mt-3 text-on-surface-variant">
					We'd rather show nothing than pad this page.
					{#if data.yearWide.length}Below are a few ideas that work across {COURSE_LABELS[
							data.book.course
						]}.{/if}
				</p>
			</div>
		{:else}
			{#if data.ideas.length < THIN}
				<p class="mb-4 text-body-sm text-on-surface-variant" data-testid="book-thin">
					Only {data.ideas.length} idea{data.ideas.length === 1 ? '' : 's'} for {name} so far.
				</p>
			{/if}
			{#if data.groups.length > 1}
				<nav aria-label="Idea types" class="mb-8">
					<ul class="flex flex-wrap gap-2">
						{#each data.groups as group (group.category)}
							<li>
								<a
									href={`#${group.category}`}
									class="inline-flex rounded-full border border-outline-variant/40 px-4 py-1 text-body-sm hover:bg-surface-container focus-ring"
								>
									{group.label}
									<span class="ml-1 text-on-surface-variant"
										>({group.ideas.length})</span
									>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}
			{#each data.groups as group (group.category)}
				<section
					id={group.category}
					class="mb-10 scroll-mt-24"
					aria-labelledby={`h-${group.category}`}
					data-testid="category-group"
				>
					<h2 id={`h-${group.category}`} class="mb-4 font-serif text-display-sm">
						{group.label}
					</h2>
					<div class="grid gap-4 md:grid-cols-2">
						{#each group.ideas as idea, i (i)}
							<IdeaCard {idea} />
						{/each}
					</div>
				</section>
			{/each}
		{/if}

		{#if data.yearWide.length && data.ideas.length < THIN}
			<section class="mt-12" aria-labelledby="year-wide">
				<h2 id="year-wide" class="font-serif text-display-sm">
					Ideas for any part of {COURSE_LABELS[data.book.course]}
				</h2>
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					{#each data.yearWide as idea, i (i)}
						<IdeaCard {idea} />
					{/each}
				</div>
			</section>
		{/if}
	</IdeaBrowser>
</main>
