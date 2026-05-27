<script lang="ts">
	import '../app.css';
	import SkipLink from '$lib/components/layout/SkipLink.svelte';
	import AppNav from '$lib/components/layout/AppNav.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#FFF8F6" />
</svelte:head>

<SkipLink />
<AppNav />

<main id="main-content" class="min-h-[60vh]">
	{@render children()}
</main>

<AppFooter />
