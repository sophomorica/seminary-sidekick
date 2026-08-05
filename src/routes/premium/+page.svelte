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
    4. Pricing             — real plan cards ($4.99/mo, $34.99/yr,
                             "Save 42%"), subscription managed via
                             the stores. No free trial (owner
                             decision, 2026-06-13).
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
			<p class="text-xs font-semibold uppercase tracking-[1.5px] text-on-tertiary-container">
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
				$4.99/month or $34.99/year · Managed through the App Store
			</p>
		</div>
	</section>

	<!-- ─── 2. What you get ───────────────────────────────────────── -->
	<section class="relative bg-surface py-16 md:py-24" aria-labelledby="premium-features-headline">
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
					<PremiumFeature icon={feature.icon} title={feature.title} body={feature.body} />
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
					body="Where did you feel God's love for you this week — and how did you pass it along to someone else?"
					reference="From John 3:16"
				/>

				<SampleOutput
					label="Reflection question"
					icon={MessageCircleQuestion}
					title="Sit with this."
					body="The Lord promises that if we humble ourselves, he will “make weak things become strong.” Where in your life do you most need that promise right now?"
					reference="From Ether 12:27"
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
	<section class="relative bg-surface py-16 md:py-24" aria-labelledby="premium-pricing-headline">
		<div class="mx-auto max-w-3xl px-4 text-center md:px-8">
			<p class="eyebrow">Pricing</p>
			<h2
				id="premium-pricing-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				One subscription. Two ways to pay.
			</h2>
			<p class="mx-auto mt-5 max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
				Premium unlocks Seminary Sidekick AI for the whole school year. Subscribe inside the
				app — billing manages through the App Store, and you can cancel any time, right from
				your device settings.
			</p>

			<!-- Plan cards — prices locked 2026-06-13; keep in sync with the app's upgrade screen. -->
			<div class="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
				<div
					class="flex flex-col items-center gap-1 rounded-4xl bg-surface-container-lowest px-8 py-8 shadow-editorial"
				>
					<span class="text-label-md uppercase text-on-surface-variant">Monthly</span>
					<p class="mt-2 font-serif text-display-md text-on-surface">$4.99</p>
					<p class="text-body-sm text-on-surface-variant">per month</p>
				</div>
				<div
					class="relative flex flex-col items-center gap-1 rounded-4xl bg-surface-container-lowest px-8 py-8 shadow-floating ring-2 ring-premium-gold/60"
				>
					<span
						class="absolute -top-3 rounded-full bg-premium-gold px-3 py-1 text-label-sm font-semibold uppercase text-on-tertiary-container"
					>
						Save 42%
					</span>
					<span class="text-label-md uppercase text-on-surface-variant">Yearly</span>
					<p class="mt-2 font-serif text-display-md text-on-surface">$34.99</p>
					<p class="text-body-sm text-on-surface-variant">per year</p>
				</div>
			</div>

			<div
				class="mx-auto mt-8 inline-flex flex-col items-center gap-3 rounded-4xl bg-surface-container-lowest px-8 py-6 shadow-editorial"
			>
				<span class="text-label-md uppercase text-tertiary">Included with Premium</span>
				<p class="font-serif text-headline-md text-on-surface">
					Daily prompt · Journal · Goals · Reflection · Connections · Chat
				</p>
				<!-- Class Play hosting limits — keep in sync with the app
				     (group_play_service.dart: free = 1 game/week, cap 6). -->
				<p class="max-w-md text-body-sm text-on-surface-variant">
					Plus unlimited Class Play hosting with class rooms for up to 30 players. Free
					accounts can host one casual game a week with up to 6 players — Premium removes
					both limits. Players always join free. Future Sidekick AI features included as
					they ship.
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
				Download {SITE_NAME}, subscribe in a couple of taps, and meet your Sidekick.
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
