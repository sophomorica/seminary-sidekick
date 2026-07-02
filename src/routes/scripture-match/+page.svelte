<!--
  /scripture-match — standalone home for the Scripture Match demo.

  Small editorial hero, then the demo component. Same demo embeds on
  the homepage (Phase C) via <ScriptureMatchDemo /> — this route exists
  as a permanent direct link for sharing and SEO.
-->
<script lang="ts">
	import ScriptureMatchDemo from '$lib/components/demos/scripture-match/ScriptureMatchDemo.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	const pageTitle = `Scripture Match — ${SITE_NAME}`;
	const description =
		'Match eight doctrinal-mastery scriptures to their references. A taste of the focused, reverent way Seminary Sidekick helps you master all 100.';
	const canonical = `${SITE_URL}/scripture-match`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden bg-surface pt-12 pb-10 md:pt-20 md:pb-14">
	<!-- Ambient warm gradient, mirrors Hero.svelte's treatment. -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 50% 40% at 20% 10%, var(--color-primary-fixed) 0%, transparent 60%),
			radial-gradient(ellipse 45% 40% at 85% 90%, var(--color-secondary-container) 0%, transparent 65%);
			opacity: 0.5;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-3xl px-4 text-center md:px-8">
		<p class="eyebrow">Try it</p>
		<h1 class="font-serif text-display-lg tracking-tight md:text-hero-lg">
			Eight scriptures. Match them.
		</h1>
		<p
			class="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-on-surface-variant md:text-lg"
		>
			A taste of the doctrinal-mastery loop. Pair each key phrase with its reference, then
			bring the other 92 home in the app.
		</p>
	</div>
</section>

<!-- Demo -->
<section class="pb-16 md:pb-24">
	<ScriptureMatchDemo />
</section>
