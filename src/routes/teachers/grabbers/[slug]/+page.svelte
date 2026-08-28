<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { MIXER_FRAMING, SEMINARY_YEAR_LABEL } from '$lib/teachers/mixer';
	import { ArrowLeft, Printer } from 'lucide-svelte';

	let { data } = $props();

	const grabber = $derived(data.grabber);
	const pageTitle = $derived(`${grabber.title} — ${SITE_NAME}`);
	const pageDescription = $derived(grabber.summary);
	const canonical = $derived(`${SITE_URL}${grabber.href}`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<section class="bg-surface pt-16 pb-12 md:pt-24 md:pb-16" aria-labelledby="grabber-headline">
	<div class="mx-auto max-w-3xl px-4 md:px-8">
		<p class="eyebrow">{SEMINARY_YEAR_LABEL} · {MIXER_FRAMING}</p>
		<h1 id="grabber-headline" class="font-serif text-display-lg tracking-tight md:text-hero-lg">
			{grabber.title}
		</h1>
		<p class="mt-6 text-lg leading-relaxed text-on-surface-variant md:text-xl">
			{grabber.summary}
		</p>
		<div class="mt-8 flex flex-wrap gap-3">
			{#if grabber.printHref && grabber.printLabel}
				<Button href={grabber.printHref} variant="primary">
					<Printer aria-hidden="true" />
					{grabber.printLabel}
				</Button>
			{/if}
			<Button href="/teachers" variant="outlined">
				<ArrowLeft aria-hidden="true" />
				Back to mixer
			</Button>
		</div>
	</div>
</section>

<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="how-to-run">
	<div class="mx-auto max-w-3xl space-y-8 px-4 md:px-8">
		<article class="card">
			<h2 id="how-to-run" class="font-serif text-headline-lg">How to run it</h2>
			<dl class="mt-5 grid gap-4 sm:grid-cols-2">
				<div>
					<dt class="font-semibold text-on-surface">Time</dt>
					<dd class="text-on-surface-variant">{grabber.time}</dd>
				</div>
				<div>
					<dt class="font-semibold text-on-surface">Materials</dt>
					<dd class="text-on-surface-variant">{grabber.materials}</dd>
				</div>
			</dl>
			<ol class="mt-6 list-decimal space-y-3 pl-5 text-body-md text-on-surface-variant">
				{#each grabber.howTo as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
		</article>

		<article class="card">
			<h2 class="font-serif text-headline-lg">Works in later years</h2>
			<p class="mt-3 text-body-md text-on-surface-variant">{grabber.transferable}</p>
		</article>

		<p class="text-body-sm text-on-surface-variant">
			Need tiles for a verse?
			<a
				href="/teachers/printouts"
				class="font-semibold text-accent underline-offset-2 hover:underline"
			>
				Scripture Builder printouts
			</a>
		</p>
	</div>
</section>
