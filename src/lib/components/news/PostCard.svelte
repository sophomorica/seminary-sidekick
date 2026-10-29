<script lang="ts">
	import type { NewsCard } from '$lib/content/post';

	let { post }: { post: NewsCard } = $props();
</script>

<a
	href={`/news/${post.slug}`}
	class="block card card-hover group focus-ring"
	aria-labelledby={`post-title-${post.slug}`}
>
	<time datetime={post.date} class="text-body-sm text-on-surface-variant">
		{post.dateLabel}
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
</a>
