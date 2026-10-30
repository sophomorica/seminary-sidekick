<script lang="ts">
	import { CATEGORY_LABELS, COURSE_LABELS, type TeachingIdea } from '$lib/teach/ideas';

	let { idea }: { idea: TeachingIdea } = $props();
	const where = $derived(idea.book === 'general' ? COURSE_LABELS[idea.course] : `${idea.book}`);
</script>

<article class="card" data-testid="idea-card">
	<p class="eyebrow">{CATEGORY_LABELS[idea.category] ?? idea.category} · {where}</p>
	<h3 class="font-serif text-xl">{idea.title}</h3>
	<p class="mt-2 text-on-surface-variant">{idea.summary}</p>
</article>
