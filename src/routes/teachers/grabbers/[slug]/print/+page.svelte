<!--
  Print-ready US Letter sheet. Nav/footer hide via isGrabberPrintPath.
-->
<script lang="ts">
	import GrabberPrintSheet from '$lib/components/teachers/GrabberPrintSheet.svelte';
	import PrintToolbar from '$lib/components/teachers/PrintToolbar.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	let { data } = $props();

	const grabber = $derived(data.grabber);
	const pageTitle = $derived(`${grabber.title} printout — ${SITE_NAME}`);
	const canonical = $derived(`${SITE_URL}${grabber.printHref ?? grabber.href}`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={grabber.summary} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content="noindex" />
</svelte:head>

<PrintToolbar backHref={grabber.href} backLabel={grabber.title} />

<div class="bg-surface px-4 py-8 md:px-8 print:bg-white print:px-0 print:py-0">
	<GrabberPrintSheet {grabber} />
</div>
