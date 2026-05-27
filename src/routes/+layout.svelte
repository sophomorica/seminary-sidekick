<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SkipLink from '$lib/components/layout/SkipLink.svelte';
	import AppNav from '$lib/components/layout/AppNav.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SkipLink />
<AppNav />

<main id="main-content" class="min-h-[60vh]">
	{@render children()}
</main>

<AppFooter />
