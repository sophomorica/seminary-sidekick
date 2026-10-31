<!--
  Card list + preview pane. Desktop: sticky side pane. Mobile: the selected idea
  slides up full screen with a back link. State lives in ?idea=<slug>, so it works
  without JS and every open idea is a shareable link.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import IdeaPreview from '$lib/components/teach/IdeaPreview.svelte';
	import type { IdeaDetail } from '$lib/server/teachingIdeas';
	import { withIdea } from '$lib/teach/ideaHref';

	let { selected, children }: { selected: IdeaDetail | null; children: Snippet } = $props();
	const closeHref = $derived(withIdea(page.url, ''));
</script>

<div class="lg:grid lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start lg:gap-8">
	<div class="min-w-0">{@render children()}</div>
	<aside
		aria-label="Idea preview"
		data-testid="idea-pane"
		class={selected
			? 'sheet fixed inset-0 z-50 overflow-y-auto bg-surface p-5 lg:static lg:z-auto lg:block lg:max-h-[calc(100vh-7rem)] lg:rounded-4xl lg:bg-surface-container lg:p-6 lg:sticky lg:top-24'
			: 'hidden lg:sticky lg:top-24 lg:block lg:rounded-4xl lg:bg-surface-container lg:p-6'}
	>
		{#if selected}
			<p class="mb-4 lg:hidden">
				<a
					href={closeHref}
					data-sveltekit-noscroll
					class="text-primary hover:underline"
					data-testid="idea-back">← Back to ideas</a
				>
			</p>
			{#key selected.slug}
				<IdeaPreview idea={selected} />
			{/key}
		{:else}
			<p class="text-on-surface-variant" data-testid="idea-pane-empty">
				Pick an idea to see the full how-to: materials, steps and questions to ask.
			</p>
		{/if}
	</aside>
</div>

<style>
	@media (max-width: 1023px) {
		.sheet {
			animation: slide-up 200ms ease-out;
		}
	}
	@keyframes slide-up {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sheet {
			animation: none;
		}
	}
</style>
