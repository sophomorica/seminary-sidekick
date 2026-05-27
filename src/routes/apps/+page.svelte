<!--
  /apps — The Seminary Sidekick Suite portfolio page (TASK-B-032)

  Tier 1 has exactly one live app (Scripture Mastery). This page exists
  to plant the suite framing so adding app #2 is a 0-day refactor:
  add another <AppCard /> to the grid.

  Structure:
    - Hero band: eyebrow + "One app today. More coming." headline +
      short sub explaining the suite vision.
    - App grid: one live AppCard + one Coming-soon AppCard. 1 col mobile,
      2 col desktop.
    - "Why a suite?" footer band — 2-3 sentences on the brand vision.

  Copy stance: aspirational but not breathy. We have not committed to
  app #2 publicly, so the placeholder card never names a specific app.
  Pricing and Android availability are handled by the shared store
  config — no per-page swaps required when those change.
-->
<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import AppCard from '$lib/components/apps/AppCard.svelte';
	import { BookOpen, Sparkles } from 'lucide-svelte';

	const pageTitle = `The Seminary Sidekick Suite — ${SITE_NAME}`;
	const pageDescription =
		'Seminary Sidekick is becoming a suite of focused, reverent tools for seminary students and teachers. Scripture Mastery is the first. More are on the way.';
	const canonical = `${SITE_URL}/apps`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- ─── Hero band ──────────────────────────────────────────────── -->
<section
	class="bg-surface relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16"
	aria-labelledby="apps-hero-headline"
>
	<!-- Ambient warm gradient, same recipe as Hero.svelte. -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 55% 45% at 18% 10%, var(--color-primary-fixed) 0%, transparent 55%),
			radial-gradient(ellipse 45% 40% at 88% 90%, var(--color-secondary-container) 0%, transparent 60%);
			opacity: 0.45;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-5xl px-4 md:px-8">
		<p class="eyebrow">The Seminary Sidekick Suite</p>
		<h1
			id="apps-hero-headline"
			class="text-display-lg md:text-hero-lg max-w-3xl font-serif tracking-tight"
		>
			One app today. More coming.
		</h1>

		<p
			class="text-on-surface-variant mt-5 max-w-2xl text-lg leading-relaxed md:text-xl"
		>
			Seminary Sidekick is growing into a suite of focused, reverent tools for seminary
			students and the teachers who shape them. Scripture Mastery is the first. The next
			ones are built with the same craft and the same conviction — that this hour of the
			day deserves a tool that takes it seriously.
		</p>
	</div>
</section>

<!-- ─── App grid ──────────────────────────────────────────────── -->
<section class="bg-surface pb-16 md:pb-24" aria-label="Apps in the Seminary Sidekick suite">
	<div class="mx-auto max-w-5xl px-4 md:px-8">
		<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			<li class="h-full">
				<AppCard
					title="Scripture Mastery"
					description="Study, build, prove, and master the 100 doctrinal mastery scriptures — with a Scripture Builder that asks you to produce the words, not just recognize them."
					icon={BookOpen}
					href="/apps/scripture-mastery"
					eyebrow="Live now"
					storeButtons
				/>
			</li>

			<li class="h-full">
				<AppCard
					title="Another Sidekick is in the works."
					description="The next app in the suite is being built with the same care. We'll announce it here first — sign up for the news feed if you want to hear when it lands."
					icon={Sparkles}
					comingSoon
				/>
			</li>
		</ul>
	</div>
</section>

<!-- ─── Why a suite? footer band ─────────────────────────────── -->
<section
	class="bg-surface-container-low py-16 md:py-24"
	aria-labelledby="why-suite-headline"
>
	<div class="mx-auto max-w-3xl px-4 text-center md:px-8">
		<p class="eyebrow">Why a suite?</p>
		<h2 id="why-suite-headline" class="text-display-md md:text-display-lg font-serif tracking-tight">
			One brand. Many tools. The same standard.
		</h2>
		<p class="text-on-surface-variant mt-5 text-body-lg leading-relaxed md:text-lg">
			Every Sidekick app earns its place against a simple test: does it make seminary
			feel like the best hour of the day? When the answer is yes, it ships. When it isn't,
			it waits. That's why there's one app on this page today instead of three.
		</p>
	</div>
</section>
