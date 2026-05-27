<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Verse not found — Seminary Sidekick</title>
	<meta name="description" content="The page you're looking for doesn't exist." />
</svelte:head>

<section class="section mx-auto max-w-3xl px-4 text-center md:px-8">
	<p class="eyebrow">{page.status}</p>
	<h1 class="font-serif text-display-lg md:text-hero-lg">Verse not found.</h1>
	<p class="mx-auto mt-4 max-w-xl text-body-lg text-on-surface-variant">
		The page you're looking for doesn't exist {page.status === 404 ? 'yet' : 'right now'}. Try one
		of these instead.
	</p>
	<div class="mt-10 flex flex-wrap justify-center gap-3">
		<Button href="/">Back home</Button>
		<Button href="/news" variant="outlined">Browse news</Button>
	</div>
</section>
