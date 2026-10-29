<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();
	const guide = $derived(data.guide);
	const pageTitle = $derived(`${guide.title} | ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}/guides/${guide.slug}`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={guide.excerpt} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={guide.excerpt} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-8">
		<h1 class="font-serif text-display-lg tracking-tight md:text-hero-lg">{guide.title}</h1>
	</header>

	<div class="post-body">
		<!-- Server render of body_md. Anon cannot write public.posts. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html guide.html}
	</div>
</article>
