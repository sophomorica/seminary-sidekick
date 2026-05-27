<!--
  NewsPreview — TASK-B-014

  Homepage strip that surfaces the 3 most recent news posts. Devotionals,
  release notes, behind-the-scenes — a "what's happening here" beat
  that gives the brand a heartbeat and seeds the resource library habit.

  Visual conventions follow THEME.md + sibling sections (Hero,
  ForTeachersStrip, FinalCTA) exactly:
    - bg-surface-container for section rhythm (one tonal step above surface)
    - .eyebrow + serif display headline + muted sub-line
    - Cards: surface-container-lowest, rounded-[2rem], shadow-editorial,
      lift on hover via .card-hover (defined in app.css)
    - 1 col mobile / 3 cols desktop, lg:grid-cols-3 gap-6
    - Whole card is a link, formatted date, optional cover, line-clamp-3 excerpt
    - "All posts →" button (outlined) below the grid

  Empty state: when there are no posts yet, render a single placeholder
  card so the homepage rhythm and section meta remain intact.

  Data source is `loadPosts()` from $lib/content/loadPosts — Vite-inlined,
  synchronous, sorted by date desc.

  Composition into the homepage happens in TASK-C-100 (not here).
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from 'lucide-svelte';
	import { loadPosts } from '$lib/content/loadPosts';

	const posts = $derived(loadPosts().slice(0, 3));

	/** Format an ISO YYYY-MM-DD date as "Month D, YYYY" for the card meta. */
	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<section
	id="news-preview"
	class="bg-surface-container py-16 md:py-24"
	aria-labelledby="news-preview-headline"
>
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<p class="eyebrow">What's new</p>

		<h2
			id="news-preview-headline"
			class="font-serif text-display-md tracking-tight md:text-display-lg max-w-3xl"
		>
			Devotionals, release notes, behind the scenes.
		</h2>

		<p class="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
			Short reads from the Seminary Sidekick team — a steady, quiet thread of
			scripture, craft, and the work of building this thing.
		</p>

		<div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
			{#if posts.length === 0}
				<!--
					Empty state — render once across the grid so the section keeps its
					presence on the homepage. Wrapped in the standard card so it sits
					at the same elevation a real post card would.
				-->
				<div class="card lg:col-span-3 text-center">
					<p class="eyebrow">Coming soon</p>
					<h3 class="font-serif text-headline-lg text-on-surface">
						The first posts land with launch.
					</h3>
					<p class="mt-3 mx-auto max-w-xl text-body-md text-on-surface-variant">
						Devotionals, release notes, and behind-the-scenes writing are on
						the way. Subscribe via the news feed once it goes live.
					</p>
				</div>
			{:else}
				{#each posts as post (post.slug)}
					<a
						href={`/news/${post.slug}`}
						class="card card-hover group focus-ring flex flex-col"
						aria-labelledby={`news-preview-title-${post.slug}`}
					>
						{#if post.cover}
							<img
								src={post.cover}
								alt=""
								class="mb-5 w-full rounded-2xl object-cover"
								style="aspect-ratio: 16 / 9;"
								loading="lazy"
							/>
						{/if}

						<time
							datetime={post.date}
							class="text-body-sm text-on-surface-variant"
						>
							{formatDate(post.date)}
						</time>

						<h3
							id={`news-preview-title-${post.slug}`}
							class="mt-2 font-serif text-headline-lg text-on-surface transition-colors group-hover:text-primary"
						>
							{post.title}
						</h3>

						<p class="mt-3 line-clamp-3 text-body-md text-on-surface-variant">
							{post.excerpt}
						</p>
					</a>
				{/each}
			{/if}
		</div>

		<div class="mt-10">
			<Button href="/news" variant="outlined">
				All posts
				<ArrowRight aria-hidden="true" />
			</Button>
		</div>
	</div>
</section>
