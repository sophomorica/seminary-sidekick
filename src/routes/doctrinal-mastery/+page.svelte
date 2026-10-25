<script lang="ts">
	import { SITE_URL } from '$lib/config/site';
	import { DOCTRINAL_MASTERY_GUIDE } from '$lib/config/guides';

	let { data } = $props();
	const canonical = `${SITE_URL}${DOCTRINAL_MASTERY_GUIDE.path}`;
</script>

<svelte:head>
	<title>{DOCTRINAL_MASTERY_GUIDE.seoTitle}</title>
	<meta name="description" content={data.summary} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={DOCTRINAL_MASTERY_GUIDE.seoTitle} />
	<meta property="og:description" content={data.summary} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-8">
		<h1 class="font-serif text-display-lg tracking-tight md:text-hero-lg">{data.title}</h1>
	</header>

	<div class="post-body">
		<!-- body_md from Supabase, rendered server-side. Trusted: only the service role can write posts. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.html}
	</div>
</article>
