<!--
  /quick-quiz — standalone route for the Quick Quiz demo (TASK-B-020).

  A small hero on top introduces the demo with the same eyebrow/headline
  rhythm as the rest of the site, then mounts <QuickQuizDemo /> below.
  The demo's outer <section> uses `id="quick-quiz-demo"`, so a Hero CTA
  on the homepage can deep-link with #quick-quiz-demo once the homepage
  composition lands in TASK-C-100.
-->
<script lang="ts">
	import QuickQuizDemo from '$lib/components/demos/quick-quiz/QuickQuizDemo.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	const pageTitle = `Quick Quiz — ${SITE_NAME}`;
	const pageDescription =
		'Five doctrinal-mastery scriptures, one round. A 30-second taste of Seminary Sidekick — read the phrase, pick the reference, see how it feels.';
	const canonical = `${SITE_URL}/quick-quiz`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
</svelte:head>

<!--
  Hero — short, scannable. The demo headline lives inside the demo
  itself ("Five scriptures. One round."), so this hero serves as the
  page-level <h1> and a one-line orientation.
-->
<section
	class="relative overflow-hidden bg-surface pt-12 pb-8 md:pt-20 md:pb-12"
	aria-labelledby="quick-quiz-page-heading"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 60% 50% at 20% 0%, var(--color-primary-fixed) 0%, transparent 60%);
			opacity: 0.45;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-3xl px-4 text-center md:px-8">
		<p class="eyebrow">Try it</p>
		<h1
			id="quick-quiz-page-heading"
			class="font-serif text-display-lg tracking-tight md:text-hero-lg"
		>
			Five scriptures. One round.
		</h1>
		<p class="mx-auto mt-5 max-w-xl text-body-lg text-on-surface-variant md:text-lg">
			A 30-second taste of Seminary Sidekick — no signup, no install. Read the phrase, pick
			the reference.
		</p>
	</div>
</section>

<QuickQuizDemo />
