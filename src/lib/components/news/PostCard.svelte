<script lang="ts">
	import type { NewsPostFrontmatter } from '$lib/content/schema';

	/**
	 * PostCard — compact, beautiful card for the news index.
	 * Uses THEME card patterns (surface-container-lowest, rounded-[2rem], shadow-editorial + lift on hover).
	 * Date formatted consistently with the post template.
	 * Optional cover thumbnail. Tags as subtle pills.
	 * Whole card links to the full post. Fully keyboard accessible.
	 */
	let { post }: { post: NewsPostFrontmatter } = $props();

	const formattedDate = $derived(
		new Date(post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<a
	href={`/news/${post.slug}`}
	class="block card card-hover group focus-ring"
	aria-labelledby={`post-title-${post.slug}`}
>
	{#if post.cover}
		<img
			src={post.cover}
			alt=""
			class="mb-4 w-full rounded-2xl object-cover"
			style="aspect-ratio: 16 / 9; max-height: 10rem;"
		/>
	{/if}

	<time datetime={post.date} class="text-body-sm text-on-surface-variant">
		{formattedDate}
	</time>

	<h3
		id={`post-title-${post.slug}`}
		class="mt-2 font-serif text-headline-lg text-on-surface transition-colors group-hover:text-primary"
	>
		{post.title}
	</h3>

	<p class="mt-3 line-clamp-3 text-body-md text-on-surface-variant">
		{post.excerpt}
	</p>

	{#if post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-1.5">
			{#each post.tags as tag (tag)}
				<span
					class="rounded-full bg-surface-variant px-2.5 py-0.5 text-label-sm text-on-surface-variant/80"
				>
					{tag}
				</span>
			{/each}
		</div>
	{/if}
</a>
