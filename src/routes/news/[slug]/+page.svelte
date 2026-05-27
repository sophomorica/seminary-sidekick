<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();
	const post = $derived(data.post);

	const formattedDate = $derived(
		new Date(post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	const pageTitle = $derived(`${post.title} — ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}/news/${post.slug}`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={post.excerpt} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonical} />
	{#if post.cover}
		<meta property="og:image" content={post.cover} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<!-- Subtle top back link for long-form reading comfort -->
	<a
		href="/news"
		class="mb-8 inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary focus-ring rounded underline-offset-2 hover:underline"
	>
		← Back to news
	</a>

	<header class="mb-12">
		<p class="eyebrow">{formattedDate}</p>
		<h1 class="font-serif text-display-lg md:text-hero-lg">{post.title}</h1>
		<p class="mt-4 text-body-lg text-on-surface-variant">{post.excerpt}</p>
		{#if post.tags.length > 0}
			<ul class="mt-6 flex flex-wrap gap-2">
				{#each post.tags as tag (tag)}
					<li
						class="rounded-full bg-surface-container-low px-3 py-1 text-label-md text-on-surface-variant uppercase"
					>
						{tag}
					</li>
				{/each}
			</ul>
		{/if}
	</header>

	<!--
		Long-form prose container. All typography (h2/h3/p/ul/blockquote/code/hr + scripture
		via .scripture class or generic blockquotes) now lives in .post-body in app.css (TASK-B-040).
		18px Merriweather, 1.7 line-height, generous rhythm, beautiful sacred quotes per THEME.md.
	-->
	<div class="post-body">
		<post.component />
	</div>

	<footer class="mt-16 border-t border-outline-variant/30 pt-8">
		<p class="text-body-sm text-on-surface-variant">
			Written by {post.author}.
			<a href="/news" class="ml-2 focus-ring rounded text-primary hover:underline">
				← Back to news
			</a>
		</p>
	</footer>
</article>
