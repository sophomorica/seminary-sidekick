<!--
  /update — fallback for the in-app update banner link when the visitor's
  device isn't recognisably iOS or Android (+page.server.ts redirects those).
  Shows both store links. Not in the sitemap; noindex.
-->
<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
</script>

<svelte:head>
	<title>Update {SITE_NAME}</title>
	<meta name="description" content="Get the latest version of {SITE_NAME}." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-surface pt-16 pb-20 md:pt-24 md:pb-28" aria-labelledby="update-headline">
	<div class="mx-auto max-w-2xl px-4 text-center md:px-8">
		<p class="eyebrow">App update</p>
		<h1 id="update-headline" class="text-display-lg md:text-hero-lg font-serif tracking-tight">
			Get the latest {SITE_NAME}
		</h1>
		<p class="mt-4 text-lg text-on-surface-variant">
			Open your app store to update to the newest version.
		</p>
		<StoreButtons size="lg" class="mt-8 justify-center" />
	</div>
</section>
