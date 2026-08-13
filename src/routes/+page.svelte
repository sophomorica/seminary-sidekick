<!--
  Homepage — TASK-C-100

  Thin composition shell. Per CLAUDE.md's parallel-safe pattern,
  every section is owned by its own file under sections/ (or demos/)
  and lands independently; this file just orders them.

  Order per TASK-C-100 (updated when Class Play landed):
    Hero → HowItWorks → QuickQuizDemo → PremiumPeek →
    ScriptureMatchDemo → ClassPlay → ForTeachersStrip →
    NewsPreview → FinalCTA

  The order is deliberate:
  - Hero lands the headline + the two CTAs.
  - HowItWorks explains the loop and plays Scripture Builder
    (study → build → prove → master) so the demos make sense.
  - QuickQuizDemo is the first taste — fast, low-stakes.
  - PremiumPeek introduces Sidekick AI before the visitor decides.
  - ScriptureMatchDemo gives a second, different taste — you've now
    played alone, twice.
  - ClassPlay reframes: "now imagine your whole class on the same
    board, live." Live in the app (in active testing with first
    classrooms) — captures teacher signups for Class Play updates.
  - ForTeachersStrip pivots to the adult buyer/recommender.
  - NewsPreview shows the project is alive.
  - FinalCTA is the last conversion attempt before the footer.

  Don't add anything else here. Section-level work belongs in the
  individual section components. Page-level SEO + structured data
  graduates into the <Seo> component when TASK-B-060 ships.
-->

<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import HowItWorks from '$lib/components/sections/HowItWorks.svelte';
	import { QuickQuizDemo } from '$lib/components/demos/quick-quiz';
	import PremiumPeek from '$lib/components/sections/PremiumPeek.svelte';
	import { ScriptureMatchDemo } from '$lib/components/demos/scripture-match';
	import ClassPlay from '$lib/components/sections/ClassPlay.svelte';
	import ForTeachersStrip from '$lib/components/sections/ForTeachersStrip.svelte';
	import NewsPreview from '$lib/components/sections/NewsPreview.svelte';
	import FinalCTA from '$lib/components/sections/FinalCTA.svelte';

	import { SITE_NAME, TAGLINE } from '$lib/config/site';

	const pageTitle = `${SITE_NAME} — ${TAGLINE}`;
	const pageDescription =
		'A focused, reverent way to master all 100 doctrinal mastery scriptures. Built for seminary students, teachers, and parents.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Hero />
<HowItWorks />
<QuickQuizDemo />
<PremiumPeek />
<ScriptureMatchDemo />
<ClassPlay />
<ForTeachersStrip />
<NewsPreview />
<FinalCTA />
