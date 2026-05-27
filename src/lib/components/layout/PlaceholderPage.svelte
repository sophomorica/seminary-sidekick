<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';

	let {
		title,
		eyebrow = 'Coming soon',
		description,
		taskRef
	}: {
		title: string;
		eyebrow?: string;
		description: string;
		/** TASK-XXX ID that will replace this stub (helpful for agent claims). */
		taskRef?: string;
	} = $props();

	const pageTitle = `${title} — ${SITE_NAME}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="section mx-auto max-w-3xl px-4 md:px-8">
	<p class="eyebrow">{eyebrow}</p>
	<h1 class="font-serif text-display-md md:text-display-lg">{title}</h1>
	<p class="mt-4 text-body-lg text-on-surface-variant">{description}</p>
	{#if taskRef}
		<p class="mt-12 text-body-sm text-on-surface-variant">
			This page is a stub. The full build lives at <code class="font-mono">{taskRef}</code> in
			<code class="font-mono">TODO.md</code>.
		</p>
	{/if}
</section>
