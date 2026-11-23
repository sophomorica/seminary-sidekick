<!-- A teaching idea card. Clicking it opens the full how-to in the preview pane (?idea=<slug>). -->
<script lang="ts">
	import { page } from '$app/state';
	import { withIdea } from '$lib/teach/ideaHref';
	import { CATEGORY_LABELS, COURSE_LABELS, type TeachingIdea } from '$lib/teach/ideas';

	/** Heading level for the idea title; use 4 when the card sits under an h3. */
	let { idea, level = 3 }: { idea: TeachingIdea; level?: 3 | 4 } = $props();
	const where = $derived(idea.book === 'general' ? COURSE_LABELS[idea.course] : `${idea.book}`);
	const selected = $derived(page.url.searchParams.get('idea') === idea.slug);
</script>

<a
	href={withIdea(page.url, idea.slug)}
	data-sveltekit-noscroll
	data-testid="idea-card"
	aria-current={selected ? 'true' : undefined}
	class="card card-hover flex gap-4 text-left focus-ring {selected ? 'ring-2 ring-primary' : ''}"
>
	<div class="min-w-0 grow">
		<p class="eyebrow">{CATEGORY_LABELS[idea.category] ?? idea.category} · {where}</p>
		<svelte:element this={`h${level}`} class="font-serif text-xl">{idea.title}</svelte:element>
		<p class="mt-2 text-on-surface-variant">{idea.summary}</p>
		<p class="mt-3 text-label-lg text-primary">See how it works →</p>
	</div>
	{#if idea.imageUrl}
		<img
			src={idea.imageUrl}
			alt=""
			loading="lazy"
			class="hidden h-20 w-24 shrink-0 rounded-2xl object-cover sm:block"
		/>
	{/if}
</a>
