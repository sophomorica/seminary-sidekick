<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();
	const post = $derived(data.post);

	const pageTitle = $derived(`${post.title} — ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}/news/${post.slug}`);
	const imageUrl = $derived(
		post.imageUrl
			? post.imageUrl.startsWith('http')
				? post.imageUrl
				: `${SITE_URL}${post.imageUrl}`
			: null
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={post.excerpt} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonical} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<a
		href="/news"
		class="mb-8 inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary focus-ring rounded underline-offset-2 hover:underline"
	>
		← Back to news
	</a>

	<header class="mb-12">
		<p class="eyebrow">{post.dateLabel}</p>
		<h1 class="font-serif text-display-lg md:text-hero-lg">{post.title}</h1>
		<p class="mt-4 text-body-lg text-on-surface-variant">{post.excerpt}</p>
	</header>

	<div class="post-body">
		<!-- Server render of body_md. Anon cannot write public.posts. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html post.html}
	</div>

	<footer class="mt-16 border-t border-outline-variant/30 pt-8">
		<p class="text-body-sm text-on-surface-variant">
			Written by Patrick.
			<a href="/news" class="ml-2 focus-ring rounded text-primary hover:underline">
				← Back to news
			</a>
		</p>
	</footer>
</article>
