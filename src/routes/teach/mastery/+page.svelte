<!--
  /teach/mastery — doctrinal mastery teaching ideas grouped by year, with
  games and memory helps first. Rhyme ideas are left out for now.
  Original summaries only; no downloads, no other products.
-->
<script lang="ts">
	import IdeaBrowser from '$lib/components/teach/IdeaBrowser.svelte';
	import IdeaCard from '$lib/components/teach/IdeaCard.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();

	const pageTitle = `Doctrinal mastery teaching ideas — ${SITE_NAME}`;
	const pageDescription =
		'Short, original doctrinal mastery ideas for seminary teachers: games, memory helps and lesson ideas, sorted by year.';
	const canonical = `${SITE_URL}/teach/mastery`;
	const anchor = (course: string) => course.toLowerCase().replace(/[^a-z]+/g, '-');
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
	<p class="mb-4">
		<a href="/teach" class="text-primary hover:underline">← All teaching ideas</a>
	</p>
	<header class="mb-10">
		<p class="eyebrow">For teachers</p>
		<h1 class="font-serif text-display-lg">Doctrinal mastery ideas</h1>
		<p class="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
			Games, memory helps and lesson ideas for doctrinal mastery, written in our own words and
			sorted by year. Games and memory helps come first.
		</p>
	</header>

	<IdeaBrowser selected={data.selected}>
		{#if !data.loaded}
			<div class="card text-center" data-testid="mastery-empty">
				<h2 class="font-serif text-display-sm">Ideas aren't loaded yet.</h2>
				<p class="mt-3 text-on-surface-variant">Check back soon.</p>
			</div>
		{:else if data.courses.length === 0}
			<div class="card text-center" data-testid="mastery-empty">
				<h2 class="font-serif text-display-sm">No doctrinal mastery ideas yet.</h2>
			</div>
		{:else}
			<p class="mb-4 text-body-sm text-on-surface-variant" data-testid="mastery-count">
				{data.count} idea{data.count === 1 ? '' : 's'}
			</p>
			<nav aria-label="Years" class="mb-10">
				<ul class="flex flex-wrap gap-2">
					{#each data.courses as c (c.course)}
						<li>
							<a
								href={`#${anchor(c.course)}`}
								class="inline-flex rounded-full border border-outline-variant/40 px-4 py-1 text-body-sm hover:bg-surface-container focus-ring"
							>
								{c.label}
								<span class="ml-1 text-on-surface-variant"
									>({c.games.length + c.other.length})</span
								>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			{#each data.courses as c (c.course)}
				<section
					id={anchor(c.course)}
					class="mb-14 scroll-mt-24"
					aria-labelledby={`h-${anchor(c.course)}`}
					data-testid="mastery-course"
				>
					<h2 id={`h-${anchor(c.course)}`} class="font-serif text-display-sm">
						{c.label}
					</h2>
					{#if c.games.length}
						<h3 class="mt-6 mb-3 text-label-lg">Games and memory helps</h3>
						<div class="grid gap-4 md:grid-cols-2" data-testid="mastery-games">
							{#each c.games as idea, i (i)}
								<IdeaCard {idea} />
							{/each}
						</div>
					{/if}
					{#if c.other.length}
						<h3 class="mt-6 mb-3 text-label-lg">
							{c.games.length ? 'More ideas' : 'Ideas'}
						</h3>
						<div class="grid gap-4 md:grid-cols-2">
							{#each c.other as idea, i (i)}
								<IdeaCard {idea} />
							{/each}
						</div>
					{/if}
				</section>
			{/each}
		{/if}

		<p class="mt-8 text-body-sm text-on-surface-variant">
			Looking for the scripture list itself? See
			<a href="/doctrinal-mastery" class="text-primary hover:underline">doctrinal mastery</a>.
		</p>
	</IdeaBrowser>
</main>
