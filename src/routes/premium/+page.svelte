<!--
  /premium — TASK-B-030

  Deep-dive on Seminary Sidekick AI (the premium tier inside the
  Flutter app). This page is the natural follow-up to the homepage's
  PremiumPeek section.

  Structure:
    1. Hero strip          — premium-gold gradient band, "Your AI
                             study companion." headline, sub, CTAs.
    2. "What you get"      — six feature tiles (PremiumFeature).
    3. "Sample outputs"    — three hand-curated example cards
                             (SampleOutput) that prove the AI without
                             a live Grok call.
    4. Pricing             — short note: free trial inside the app,
                             subscription managed via the stores.
    5. Final CTA           — StoreButtons + outlined "Read about the
                             app →" link to /apps/scripture-mastery.

  Per THEME.md "Premium / Sidekick AI": gold is sacred, used as
  accent — not as background fill across the whole page. The hero is
  the one place we go gold; the rest of the page falls back to the
  surface hierarchy.
-->
<script lang="ts">
	import {
		Sun,
		BookHeart,
		Target,
		MessageCircleQuestion,
		Link2,
		Sparkles,
		ArrowRight
	} from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import PremiumFeature from '$lib/components/premium/PremiumFeature.svelte';
	import SampleOutput from '$lib/components/premium/SampleOutput.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';

	const pageTitle = `Seminary Sidekick AI — Premium`;
	const pageDescription =
		'Daily prompts, a journal that writes back, suggested goals, reflection questions, scripture connections, and chat with Sidekick — the AI study companion inside Seminary Sidekick.';
	const canonical = `${SITE_URL}/premium`;

	const features = [
		{
			icon: Sun,
			title: 'A daily prompt',
			body: 'A short, reverent question to start the day in the scriptures — picked for where you are in the curriculum.'
		},
		{
			icon: BookHeart,
			title: 'Journal with dynamic prompts',
			body: 'Your journal writes back. Sidekick offers new angles when you’re stuck and remembers what you’ve worked on.'
		},
		{
			icon: Target,
			title: 'Suggested goals',
			body: 'Bite-sized weekly goals tuned to the verses you’re working on — never the same generic checklist twice.'
		},
		{
			icon: MessageCircleQuestion,
			title: 'Reflection questions',
			body: 'Open-ended prompts that turn study into reflection, not a quiz — and turn a few minutes into something you remember.'
		},
		{
			icon: Link2,
			title: 'Scripture connections',
			body: 'Sidekick links today’s verse to the rest of doctrinal mastery so the 100 start to feel like one story.'
		},
		{
			icon: Sparkles,
			title: 'Chat with Sidekick',
			body: 'A curated, scripture-scoped chat. Ask follow-up questions on a verse you’re studying — calm, not chaotic.'
		}
	];
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content="Seminary Sidekick AI — Premium" />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main>
	<!-- ─── 1. Hero strip ─────────────────────────────────────────── -->
	<section
		class="relative overflow-hidden bg-gradient-to-br from-premium-gradient-from to-premium-gradient-to pt-20 pb-20 md:pt-28 md:pb-28"
		aria-labelledby="premium-hero-headline"
	>
		<!-- Subtle radial highlight so the gradient breathes rather than reading flat. -->
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(ellipse 60% 60% at 80% 20%, rgb(255 255 255 / 0.35) 0%, transparent 55%);"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto max-w-4xl px-4 text-center md:px-8">
			<p
				class="text-xs font-semibold uppercase tracking-[1.5px] text-on-tertiary-container"
			>
				Seminary Sidekick AI · Premium
			</p>

			<h1
				id="premium-hero-headline"
				class="mt-4 font-serif text-display-lg tracking-tight text-on-tertiary-container md:text-hero-lg"
			>
				Your AI study companion.
			</h1>

			<p
				class="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-on-tertiary-container/85 md:text-xl"
			>
				A calm, curated voice that meets you in the scriptures every day — built around
				doctrinal mastery, not generic chat.
			</p>

			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<StoreButtons size="default" showComingSoon />
			</div>

			<p class="mt-6 text-body-sm text-on-tertiary-container/75">
				Free trial inside the app · Subscription manages through the App Store or Play Store
			</p>
		</div>
	</section>

	<!-- ─── 2. What you get ───────────────────────────────────────── -->
	<section
		class="relative bg-surface py-16 md:py-24"
		aria-labelledby="premium-features-headline"
	>
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<div class="max-w-2xl">
				<p class="eyebrow">What you get</p>
				<h2
					id="premium-features-headline"
					class="font-serif text-display-md tracking-tight md:text-display-lg"
				>
					Six small things that change how you study.
				</h2>
				<p class="mt-4 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
					Sidekick AI is woven through the app — never a tab you have to remember to open.
					It’s there when you open a scripture, when you write in your journal, when you
					set a goal for the week.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each features as feature (feature.title)}
					<PremiumFeature
						icon={feature.icon}
						title={feature.title}
						body={feature.body}
					/>
				{/each}
			</div>
		</div>
	</section>

	<!-- ─── 3. Sample outputs ────────────────────────────────────── -->
	<section
		class="relative overflow-hidden bg-surface-container-low py-16 md:py-24"
		aria-labelledby="premium-samples-headline"
	>
		<!-- Ambient gold wash — keeps the section feeling "AI-touched" without going full gold. -->
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(ellipse 50% 50% at 50% 0%, var(--color-premium-gold-light) 0%, transparent 60%); opacity: 0.25;"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto max-w-6xl px-4 md:px-8">
			<div class="max-w-2xl">
				<p class="eyebrow">What it sounds like</p>
				<h2
					id="premium-samples-headline"
					class="font-serif text-display-md tracking-tight md:text-display-lg"
				>
					Sample outputs.
				</h2>
				<p class="mt-4 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
					Real examples of what Sidekick produces — hand-picked so you can hear the voice
					before you ever tap subscribe.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
				<SampleOutput
					label="Daily prompt"
					icon={Sun}
					title="Today’s prompt."
					body="How does keeping the commandments show love for the Savior in your life this week?"
					reference="From John 14:15"
				/>

				<SampleOutput
					label="Reflection question"
					icon={MessageCircleQuestion}
					title="Sit with this."
					body="Where in your life right now do you most need to remember that you are God’s “workmanship, created in Christ Jesus unto good works”?"
					reference="From Ephesians 2:10"
				/>

				<SampleOutput
					label="Suggested goal"
					icon={Target}
					title="A small step this week."
					body="Memorize Mosiah 2:17 by Friday — three minutes of Scripture Builder each morning, prove it cold on the weekend."
					reference="Mosiah 2:17"
				/>
			</div>
		</div>
	</section>

	<!-- ─── 4. Pricing ───────────────────────────────────────────── -->
	<section
		class="relative bg-surface py-16 md:py-24"
		aria-labelledby="premium-pricing-headline"
	>
		<div class="mx-auto max-w-3xl px-4 text-center md:px-8">
			<p class="eyebrow">Pricing</p>
			<h2
				id="premium-pricing-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Free trial inside the app.
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
				Premium unlocks Seminary Sidekick AI for the whole school year. Subscription
				manages through the App Store or Google Play — cancel any time, right from your
				device settings.
			</p>

			<div
				class="mx-auto mt-10 inline-flex flex-col items-center gap-3 rounded-4xl bg-surface-container-lowest px-8 py-6 shadow-editorial"
			>
				<span class="text-label-md uppercase text-tertiary">Included with Premium</span>
				<p class="font-serif text-headline-md text-on-surface">
					Daily prompt · Journal · Goals · Reflection · Connections · Chat
				</p>
				<p class="text-body-sm text-on-surface-variant">
					Everything on this page, plus future Sidekick AI features as they ship.
				</p>
			</div>
		</div>
	</section>

	<!-- ─── 5. Final CTA ─────────────────────────────────────────── -->
	<section
		class="relative overflow-hidden bg-surface-container py-16 md:py-24"
		aria-labelledby="premium-cta-headline"
	>
		<div class="mx-auto max-w-3xl px-4 text-center md:px-8">
			<h2
				id="premium-cta-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Try Premium inside the app.
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
				Download {SITE_NAME}, start the free trial, and meet your Sidekick.
			</p>

			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<StoreButtons size="default" showComingSoon />
				<Button href="/apps/scripture-mastery" variant="outlined">
					Read about the app
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>
		</div>
	</section>
</main>
