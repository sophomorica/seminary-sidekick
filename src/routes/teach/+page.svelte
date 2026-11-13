<!--
  /teach — teaching-idea finder. Short ideas in our own words, filterable by
  year, book, type and keyword. Server-filtered and paged: never a catalog dump.
  No downloads, no "free file" badges (not verified), no other products.
-->
<script lang="ts">
	import IdeaBrowser from '$lib/components/teach/IdeaBrowser.svelte';
	import IdeaCard from '$lib/components/teach/IdeaCard.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { CATEGORY_LABELS, COURSE_LABELS } from '$lib/teach/ideas';

	let { data } = $props();

	const pageTitle = `Seminary teaching ideas — ${SITE_NAME}`;
	const pageDescription =
		'Short, original teaching ideas for seminary: lesson ideas, games, doctrinal mastery helps and classroom tips, sorted by book.';
	const canonical = `${SITE_URL}/teach`;
	const courses = ['OT', 'NT', 'BoM', 'D&C'] as const;

	function pageHref(p: number) {
		const parts = [
			['course', data.filter.course],
			['book', data.filter.book],
			['category', data.filter.category],
			['q', data.filter.q],
			['page', p > 1 ? String(p) : '']
		].filter(([, v]) => v);
		const qs = parts.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
		return qs ? `/teach?${qs}` : '/teach';
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main class="section mx-auto max-w-7xl px-4 md:px-8">
	<header class="mb-10">
		<p class="eyebrow">For teachers</p>
		<h1 class="font-serif text-display-lg">Teaching idea finder</h1>
		<p class="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
			Teaching ideas with full how-tos, written in our own words. Pick a year, a book, a type,
			or search. Book tags are a best guess, so check the reading before you teach.
		</p>
	</header>

	<IdeaBrowser selected={data.selected}>
		<form
			method="GET"
			action="/teach"
			class="mb-8 flex flex-wrap items-end gap-3"
			role="search"
		>
			<label class="flex flex-col text-label-lg">
				Year
				<select
					name="course"
					class="rounded-full border border-outline-variant/40 px-4 py-2"
					value={data.filter.course}
				>
					<option value="">All years</option>
					{#each Object.entries(COURSE_LABELS) as [value, label] (value)}
						<option {value}>{label}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col text-label-lg">
				Book
				<select
					name="book"
					class="rounded-full border border-outline-variant/40 px-4 py-2"
					value={data.filter.book}
				>
					<option value="">All books</option>
					{#each courses as course (course)}
						<optgroup label={COURSE_LABELS[course]}>
							{#each data.books.filter((b) => b.course === course) as book (book.slug)}
								<option value={book.slug}>{book.name}</option>
							{/each}
						</optgroup>
					{/each}
				</select>
			</label>
			<label class="flex flex-col text-label-lg">
				Type
				<select
					name="category"
					class="rounded-full border border-outline-variant/40 px-4 py-2"
					value={data.filter.category}
				>
					<option value="">All types</option>
					{#each Object.entries(CATEGORY_LABELS) as [value, label] (value)}
						<option {value}>{label}</option>
					{/each}
				</select>
			</label>
			<label class="flex grow flex-col text-label-lg">
				Search
				<input
					type="search"
					name="q"
					value={data.filter.q}
					placeholder="e.g. tabernacle, review game"
					class="rounded-full border border-outline-variant/40 px-4 py-2"
				/>
			</label>
			<button
				type="submit"
				class="rounded-full bg-primary px-6 py-2 text-label-lg text-on-primary focus-ring"
			>
				Find ideas
			</button>
		</form>

		{#if data.total === 0}
			<div class="card text-center" data-testid="teach-empty">
				<h2 class="font-serif text-display-sm">Ideas aren't loaded yet.</h2>
				<p class="mt-3 text-on-surface-variant">Check back soon.</p>
			</div>
		{:else if data.matchCount === 0}
			<div class="card text-center" data-testid="teach-no-match">
				<h2 class="font-serif text-display-sm">No ideas match that yet.</h2>
				<p class="mt-3 text-on-surface-variant">
					Try a different type or year, or <a
						href="/teach"
						class="text-primary hover:underline">clear the filters</a
					>.
				</p>
			</div>
		{:else}
			<p class="mb-4 text-body-sm text-on-surface-variant" data-testid="teach-count">
				{data.matchCount} idea{data.matchCount === 1 ? '' : 's'}
			</p>
			<div class="grid gap-4 md:grid-cols-2">
				{#each data.ideas as idea, i (i)}
					<IdeaCard {idea} />
				{/each}
			</div>
			{#if data.pages > 1}
				<nav class="mt-8 flex justify-between" aria-label="Pages">
					{#if data.page > 1}<a
							href={pageHref(data.page - 1)}
							class="text-primary hover:underline">← Previous</a
						>{:else}<span></span>{/if}
					<span class="text-body-sm">Page {data.page} of {data.pages}</span>
					{#if data.page < data.pages}<a
							href={pageHref(data.page + 1)}
							class="text-primary hover:underline">Next →</a
						>{:else}<span></span>{/if}
				</nav>
			{/if}
		{/if}

		<p class="mt-12">
			<a href="/teach/mastery" class="text-primary hover:underline"
				>Doctrinal mastery ideas, by year →</a
			>
		</p>

		<section class="mt-16" aria-labelledby="by-book">
			<h2 id="by-book" class="font-serif text-display-sm">Browse by book</h2>
			{#each courses as course (course)}
				<h3 class="mt-6 text-label-lg">{COURSE_LABELS[course]}</h3>
				<ul class="mt-2 flex flex-wrap gap-2">
					{#each data.books.filter((b) => b.course === course) as book (book.slug)}
						<li>
							<a
								href={`/teach/${book.slug}`}
								class="inline-flex rounded-full border border-outline-variant/40 px-4 py-1 text-body-sm hover:bg-surface-container focus-ring"
							>
								{book.name}
								<span class="ml-1 text-on-surface-variant">({book.count})</span>
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</section>
	</IdeaBrowser>
</main>
