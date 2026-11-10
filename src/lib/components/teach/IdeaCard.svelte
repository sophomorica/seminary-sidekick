<script lang="ts">
	import { CATEGORY_LABELS, COURSE_LABELS, type TeachingIdea } from '$lib/teach/ideas';

	/** Heading level for the idea title; use 4 when the card sits under an h3. */
	let { idea, level = 3 }: { idea: TeachingIdea; level?: 3 | 4 } = $props();
	const where = $derived(idea.book === 'general' ? COURSE_LABELS[idea.course] : `${idea.book}`);
</script>

<article class="card" data-testid="idea-card">
	<p class="eyebrow">{CATEGORY_LABELS[idea.category] ?? idea.category} · {where}</p>
	<svelte:element this={`h${level}`} class="font-serif text-xl">{idea.title}</svelte:element>
	<p class="mt-2 text-on-surface-variant">{idea.summary}</p>
</article>
