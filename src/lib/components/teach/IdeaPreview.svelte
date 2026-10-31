<!-- Full how-to for one idea. Used in the preview pane and on /teach/idea/[slug]. -->
<script lang="ts">
	import type { IdeaDetail } from '$lib/server/teachingIdeas';
	import { CATEGORY_LABELS, COURSE_LABELS } from '$lib/teach/ideas';

	let {
		idea,
		headingLevel = 2,
		showPageLink = true
	}: { idea: IdeaDetail; headingLevel?: 1 | 2; showPageLink?: boolean } = $props();
	const where = $derived(idea.book === 'general' ? COURSE_LABELS[idea.course] : idea.book);
</script>

<article data-testid="idea-preview" aria-labelledby="idea-title">
	<p class="eyebrow">{CATEGORY_LABELS[idea.category] ?? idea.category} · {where}</p>
	<svelte:element this={`h${headingLevel}`} id="idea-title" class="font-serif text-display-sm">
		{idea.title}
	</svelte:element>
	<p class="mt-3 text-body-lg text-on-surface-variant">{idea.summary}</p>
	{#if idea.imageUrl}
		<img
			src={idea.imageUrl}
			alt={idea.imageAlt}
			class="mt-6 w-full rounded-3xl"
			width="1024"
			height="768"
			data-testid="idea-image"
		/>
	{/if}
	<div class="post-body idea-body mt-6">
		<!-- body_md is our own write-up, rendered server-side. Only the service role can write it. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html idea.html}
	</div>
	{#if showPageLink}
		<p class="mt-8">
			<a
				href={`/teach/idea/${idea.slug}`}
				class="text-primary hover:underline"
				data-testid="idea-page-link">Open as a full page →</a
			>
		</p>
	{/if}
</article>

<style>
	.idea-body {
		font-size: 1rem;
	}
	.idea-body :global(h2) {
		font-size: 1.15rem;
		margin-top: 1.75em;
		margin-bottom: 0.5em;
	}
</style>
