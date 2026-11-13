<!-- /teach/idea/[slug] — one teaching idea's full how-to, as its own page for sharing and search. -->
<script lang="ts">
	import IdeaPreview from '$lib/components/teach/IdeaPreview.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { bookSlug, findBook } from '$lib/teach/ideas';

	let { data } = $props();
	const idea = $derived(data.idea);
	const pageTitle = $derived(`${idea.title} — seminary teaching idea — ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}/teach/idea/${idea.slug}`);
	const book = $derived(idea.book === 'general' ? undefined : findBook(bookSlug(idea.book)));
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={idea.summary} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={idea.summary} />
	<meta property="og:url" content={canonical} />
	{#if idea.imageUrl}<meta
			property="og:image"
			content={idea.imageUrl.startsWith('/') ? `${SITE_URL}${idea.imageUrl}` : idea.imageUrl}
		/>{/if}
</svelte:head>

<main class="section mx-auto max-w-3xl px-4 md:px-8">
	<p class="mb-6 flex flex-wrap gap-4">
		<a href="/teach" class="text-primary hover:underline">← All teaching ideas</a>
		{#if book}<a href={`/teach/${book.slug}`} class="text-primary hover:underline"
				>More for {book.name}</a
			>{/if}
		{#if idea.category === 'doctrinal_mastery'}<a
				href="/teach/mastery"
				class="text-primary hover:underline">More doctrinal mastery ideas</a
			>{/if}
	</p>
	<IdeaPreview {idea} headingLevel={1} showPageLink={false} />
</main>
