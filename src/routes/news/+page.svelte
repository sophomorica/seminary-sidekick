<script lang="ts">
	import PostCard from '$lib/components/news/PostCard.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();
	const posts = $derived(data.posts);

	const pageTitle = `News & devotionals — ${SITE_NAME}`;
	const pageDescription =
		'Release notes, devotionals, teacher tips, and behind-the-scenes posts from the Seminary Sidekick team.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={`${SITE_URL}/news`} />
	<meta property="og:title" content="News & devotionals" />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${SITE_URL}/news`} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<main class="section mx-auto max-w-4xl px-4 md:px-8">
	<header class="mb-12 text-center">
		<p class="eyebrow">Read</p>
		<h1 class="font-serif text-display-lg">News &amp; devotionals</h1>
		<p class="mt-4 max-w-2xl mx-auto text-body-lg text-on-surface-variant">
			Release notes, devotionals, teacher tips, and behind-the-scenes writing from the
			Seminary Sidekick team.
		</p>
		<p class="mt-3">
			<a
				href="/news/rss.xml"
				class="inline-flex items-center gap-1 text-sm text-accent hover:text-primary focus-ring rounded underline-offset-2 hover:underline"
				aria-label="Subscribe to the Seminary Sidekick news feed via RSS"
			>
				Subscribe via RSS
			</a>
		</p>
	</header>

	{#if posts.length === 0}
		<!-- Graceful empty state — on-brand, useful, hopeful. Critical while content/news/ is empty. -->
		<div class="card mx-auto max-w-2xl text-center">
			<p class="eyebrow">News</p>
			<h2 class="font-serif text-display-sm">No posts yet</h2>
			<p class="mt-3 text-body-lg text-on-surface-variant">
				Devotionals and release notes will land here when we publish them. Meanwhile the app
				is live on the App Store and Google Play.
			</p>

			<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
				<a
					href="/quick-quiz"
					class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition hover:bg-primary/90 focus-ring"
				>
					Try the Quick Quiz demo
				</a>
				<a
					href="/for-teachers"
					class="inline-flex items-center justify-center rounded-full border border-outline-variant/40 px-6 py-3 text-label-lg text-on-surface transition hover:bg-surface-container focus-ring"
				>
					Explore for teachers
				</a>
			</div>

			<p class="mt-6 text-body-sm text-on-surface-variant">
				Or head back to the <a href="/" class="text-primary hover:underline">homepage</a>.
			</p>
		</div>
	{:else}
		<div class="space-y-6">
			{#each posts as post (post.slug)}
				<PostCard {post} />
			{/each}
		</div>

		<!-- Subtle footer affordance -->
		<div class="mt-12 text-center text-body-sm text-on-surface-variant">
			<a
				href="/news/rss.xml"
				class="hover:text-primary focus-ring rounded underline-offset-2 hover:underline"
			>
				Subscribe to updates via RSS
			</a>
		</div>
	{/if}
</main>
