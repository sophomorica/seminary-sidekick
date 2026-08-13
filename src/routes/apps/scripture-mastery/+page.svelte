<!--
  /apps/scripture-mastery — Product page (TASK-B-032)

  The deep dive on the Flutter app. Visitors who want more detail than
  the homepage land here. Sections, in order:

    1. Hero — phone-mockup placeholder + headline + sub + StoreButtons +
       "Try a Quick Quiz →" CTA.
    2. By the numbers — TOTAL_SCRIPTURES, 4 books (from BOOK_META), 4
       mastery tiers per scripture. Real numbers, sourced from the
       Flutter-owned scripture corpus via $lib/data/scriptures.
    3. Features deep dive — Scripture Builder, Memorize, Quick Quiz +
       Scripture Match, Mastery progression. Card per feature.
    4. Premium teaser — small strip pointing at /premium.
    5. FAQ — 4-5 plainly-answered student/teacher concerns.
    6. Final CTA — <StoreButtons />.

  No new copy duplicates the homepage. We go deeper.

  Pricing + Android availability are intentionally NOT hard-coded — they
  read from $lib/config/store and the FAQ phrases them in a way that
  stays correct whether IOS/ANDROID flip later (e.g., "When it lands,
  you'll see it here." rather than a fixed date).
-->
<script lang="ts">
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { ANDROID_AVAILABLE } from '$lib/config/store';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { ScriptureBuilderShowcase } from '$lib/components/demos/scripture-builder';
	import { TOTAL_SCRIPTURES, countByBook } from '$lib/data/scriptures';
	import { BOOK_META, BOOK_ORDER } from '$lib/data/types';
	import {
		ArrowRight,
		Blocks,
		Eye,
		Star,
		Layers,
		HelpCircle,
		Users,
		type Icon
	} from 'lucide-svelte';

	const pageTitle = `Scripture Mastery — ${SITE_NAME}`;
	const pageDescription =
		'A focused, fun, reverent way to study, build, prove, and master all 100 doctrinal mastery scriptures. Built for seminary students — free to start.';
	const canonical = `${SITE_URL}/apps/scripture-mastery`;

	const byBook = countByBook();

	type Stat = { value: string; label: string; sub: string };
	const stats: Stat[] = [
		{
			value: String(TOTAL_SCRIPTURES),
			label: 'Doctrinal mastery scriptures',
			sub: 'The complete CES list, ready the moment you open the app.'
		},
		{
			value: String(BOOK_ORDER.length),
			label: 'Books of scripture',
			sub: `${BOOK_ORDER.map((b) => BOOK_META[b].short).join(' · ')}`
		},
		{
			value: '4',
			label: 'Mastery tiers per scripture',
			sub: 'Beginner · Intermediate · Advanced · Master — each one harder, on purpose.'
		}
	];

	type Feature = {
		icon: typeof Icon;
		eyebrow: string;
		title: string;
		body: string;
		iconBg: string;
		iconColor: string;
		/** Optional href — when set, the card becomes a link. */
		href?: string;
		/** Optional "coming soon" style hint, displayed beside the title. */
		hint?: string;
	};
	const features: Feature[] = [
		{
			icon: Blocks,
			eyebrow: 'The mastery tool',
			title: 'Scripture Builder',
			body: 'The heart of the app. Four progressive tiers — drag word chunks, then type with hints, then type cold. The Master tier asks you to produce every word from memory, three runs in a row, before it calls anything mastered.',
			iconBg: 'bg-primary-fixed',
			iconColor: 'text-primary',
			href: '#see-scripture-builder'
		},
		{
			icon: Eye,
			eyebrow: 'Study aid',
			title: 'Memorize mode',
			body: 'A study tool, not a quiz. Hide the verse a word at a time, fade to first letters, or jump straight to underscores. Tap any word to peek. The space to make first contact with a passage and notice what is already sticky.',
			iconBg: 'bg-secondary-container',
			iconColor: 'text-secondary'
		},
		{
			icon: Star,
			eyebrow: 'Practice quizzes',
			title: 'Quick Quiz & Scripture Match',
			body: 'Recognition practice for between study sessions — match key phrases to references, or pick the right verse from four. Light, fast, and surprisingly addictive. They keep the verses in rotation without gating mastery.',
			iconBg: 'bg-accent-light/30',
			iconColor: 'text-accent'
		},
		{
			icon: Layers,
			eyebrow: 'Mastery progression',
			title: 'New → Learning → Familiar → Memorized → Mastered → Eternal',
			body: 'Six levels driven by Scripture Builder progress. Climb tier by tier as you prove the verse, and reach Eternal after six months of sustained mastery — a tier that never decays. Gentle review nudges keep you honest without nagging.',
			iconBg: 'bg-tertiary-fixed',
			iconColor: 'text-tertiary'
		},
		{
			icon: Users,
			eyebrow: 'For teachers',
			title: 'Class Play',
			body: 'Live, class-wide rounds — Kahoot-style Quick Quiz or a Scripture Builder race. Save the class once; students join with a four-letter code, pick their name, and the leaderboard updates in real time. Free hosts get one 6-player game a week and one saved class of 6; Premium hosts run unlimited games with up to 30 players.',
			iconBg: 'bg-accent-light/30',
			iconColor: 'text-accent',
			href: '/for-teachers#class-play',
			hint: 'Built in'
		}
	];

	type Faq = { q: string; a: string };
	const faqs: Faq[] = [
		{
			q: 'How long does it take to master a scripture?',
			a: 'A few minutes a day, repeated. Most students reach Memorized on a verse in a week of regular practice and Mastered after three perfect Master-tier runs. The pace is yours — the app waits.'
		},
		{
			q: 'Does it work offline?',
			a: 'Yes. All 100 scriptures, every practice mode, and your mastery progress are stored on your device. No connection needed for the core study loop. Premium AI features require a connection.'
		},
		{
			q: 'Do I need an account?',
			a: 'No. There are no accounts at all — free or premium. Your progress lives on your device, premium is unlocked through your App Store subscription, and Class Play uses anonymous session IDs. Teachers can save a class of first names so students pick their seat instead of inventing a nickname.'
		},
		{
			q: 'What about Android?',
			a: ANDROID_AVAILABLE
				? 'Scripture Mastery is live on both the App Store and Google Play. Pick your platform above.'
				: 'iOS is live first. Android is on the roadmap — when it lands, the Play Store button will appear above. Follow the news feed for the announcement.'
		},
		{
			q: 'Is it actually free?',
			a: 'The full mastery loop — Scripture Builder, study tools, practice quizzes, and progress tracking — is free, and every free account can host one casual Class Play game a week with up to 6 players. Premium ($4.99/month or $34.99/year) adds the Seminary Sidekick AI companion — journal prompts, suggested goals, reflection questions, chat — plus unlimited Class Play hosting with class rooms for up to 30 players. Joining a game is always free; only the host needs Premium.'
		}
	];
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

<!-- ─── Hero ───────────────────────────────────────────────────── -->
<section
	class="bg-surface relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32"
	aria-labelledby="sm-hero-headline"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 60% 50% at 15% 10%, var(--color-primary-fixed) 0%, transparent 55%),
			radial-gradient(ellipse 50% 45% at 90% 90%, var(--color-secondary-container) 0%, transparent 60%);
			opacity: 0.5;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
	>
		<!-- Copy column -->
		<div class="max-w-2xl">
			<p class="eyebrow">Scripture Mastery · Sidekick app 1</p>
			<h1
				id="sm-hero-headline"
				class="text-display-lg md:text-hero-lg lg:text-hero-xl font-serif tracking-tight"
			>
				The app that asks you to prove it.
			</h1>

			<p class="text-on-surface-variant mt-6 max-w-xl text-lg leading-relaxed md:text-xl">
				Most scripture mastery apps test recognition. Scripture Sidekick tests
				<em class="font-serif italic">production</em> — can you type the verse cold, without prompts,
				three times in a row? When the answer is yes, you've mastered it. Not before.
			</p>

			<div class="mt-10 flex flex-wrap items-center gap-3">
				<StoreButtons size="default" showComingSoon />
				<Button href="#see-scripture-builder" variant="outlined">
					Watch Scripture Builder
					<ArrowRight aria-hidden="true" />
				</Button>
				<Button href="/quick-quiz" variant="ghost">
					Try a Quick Quiz
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>

			<p class="text-body-sm text-on-surface-variant mt-6">
				Free to start · No account required · Works offline
			</p>
		</div>

		<!-- Phone mockup column — placeholder until /images/apps/scripture-mastery-hero.png lands -->
		<div class="relative mx-auto w-full max-w-sm lg:max-w-none lg:justify-self-end">
			<div
				class="bg-surface-container-lowest shadow-floating motion-safe:animate-float relative mx-auto aspect-[9/19] w-full max-w-[320px] overflow-hidden rounded-[3rem] lg:max-w-[360px]"
				data-placeholder
			>
				<div
					class="absolute inset-0 flex flex-col items-center justify-between p-8 text-center"
				>
					<div class="flex w-full items-center justify-between">
						<span class="text-label-sm text-on-surface-variant uppercase">9:41</span>
						<span class="bg-on-surface/20 h-1.5 w-12 rounded-full"></span>
					</div>

					<div class="flex flex-1 flex-col items-center justify-center gap-4">
						<span class="text-label-md text-primary uppercase">1 Nephi 3:7</span>
						<blockquote class="scripture text-xl">
							"I will go and do the things which the Lord hath commanded."
							<footer>1 Nephi 3:7 — Book of Mormon</footer>
						</blockquote>
					</div>

					<div
						class="bg-primary text-on-primary flex w-full items-center justify-between rounded-2xl px-5 py-4"
					>
						<div class="text-left">
							<p class="text-label-md uppercase opacity-80">Scripture Builder</p>
							<p class="text-title-lg">Master tier · 2 / 3</p>
						</div>
						<span
							class="bg-on-primary/15 flex h-10 w-10 items-center justify-center rounded-full"
						>
							<ArrowRight aria-hidden="true" />
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section
	id="see-scripture-builder"
	class="scroll-mt-24 bg-surface-container py-16 md:py-24"
	aria-labelledby="see-sb-headline"
>
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">See it work</p>
			<h2
				id="see-sb-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Study it. Build it. Prove it. Master it.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				This is Scripture Builder — not a quiz you recognize, a verse you can produce. Watch
				2 Nephi 2:25 come together the way it does in the app.
			</p>
		</div>
		<ScriptureBuilderShowcase />
	</div>
</section>

<!-- ─── By the numbers ─────────────────────────────────────────── -->
<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="sm-numbers-headline">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">By the numbers</p>
			<h2
				id="sm-numbers-headline"
				class="text-display-md md:text-display-lg font-serif tracking-tight"
			>
				The whole list. Every tier. From day one.
			</h2>
			<p class="text-on-surface-variant mt-5 max-w-2xl text-lg leading-relaxed">
				No tutorial gate, no drip schedule, no waiting for the next unlock. The complete
				doctrinal mastery list is sitting in the app the moment you open it.
			</p>
		</div>

		<dl class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16">
			{#each stats as stat (stat.label)}
				<div class="card flex flex-col gap-3">
					<dt class="text-label-md text-on-surface-variant uppercase">{stat.label}</dt>
					<dd>
						<p
							class="text-on-surface font-serif text-5xl font-bold tracking-tight md:text-6xl"
						>
							{stat.value}
						</p>
						<p class="text-on-surface-variant mt-3 text-body-md">{stat.sub}</p>
					</dd>
				</div>
			{/each}
		</dl>

		<!-- Per-book breakdown chips -->
		<div class="mt-8 flex flex-wrap items-center gap-2">
			{#each BOOK_ORDER as book (book)}
				{@const meta = BOOK_META[book]}
				<span
					class="bg-surface-container-lowest text-on-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-md"
				>
					<span class="h-2.5 w-2.5 rounded-full {meta.tailwindBg}" aria-hidden="true"
					></span>
					{meta.label} · {byBook[book] ?? 0}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Features deep dive ─────────────────────────────────────── -->
<section class="bg-surface py-16 md:py-24" aria-labelledby="sm-features-headline">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">What you get</p>
			<h2
				id="sm-features-headline"
				class="text-display-md md:text-display-lg font-serif tracking-tight"
			>
				A handful of tools, one quiet loop.
			</h2>
			<p class="text-on-surface-variant mt-5 max-w-2xl text-lg leading-relaxed">
				Each one earns its place against a single test: does it help a student move from "I
				sort of remember this" to "I can produce this from memory"?
			</p>
		</div>

		<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16">
			{#each features as feature (feature.title)}
				{@const FeatureIcon = feature.icon}
				{#if feature.href}
					<a
						href={feature.href}
						class="block h-full rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
					>
						<Card.Root hover class="flex h-full flex-col gap-5">
							<div
								class="flex h-14 w-14 items-center justify-center rounded-full {feature.iconBg}"
								aria-hidden="true"
							>
								<FeatureIcon
									class="h-7 w-7 {feature.iconColor}"
									stroke-width={1.5}
								/>
							</div>

							<div>
								<p class="text-label-md text-on-surface-variant uppercase">
									{feature.eyebrow}
								</p>
								<div class="mt-2 flex flex-wrap items-baseline gap-3">
									<h3 class="text-headline-md font-serif">{feature.title}</h3>
									{#if feature.hint}
										<span
											class="rounded-full bg-surface-container-low px-2.5 py-0.5 text-xs font-medium tracking-wide text-on-surface-variant uppercase"
										>
											{feature.hint}
										</span>
									{/if}
								</div>
							</div>

							<p class="text-on-surface-variant">{feature.body}</p>

							<span
								class="mt-auto inline-flex items-center gap-1.5 text-label-lg text-primary"
							>
								Learn more
								<ArrowRight class="h-4 w-4" aria-hidden="true" />
							</span>
						</Card.Root>
					</a>
				{:else}
					<Card.Root class="flex h-full flex-col gap-5">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full {feature.iconBg}"
							aria-hidden="true"
						>
							<FeatureIcon class="h-7 w-7 {feature.iconColor}" stroke-width={1.5} />
						</div>

						<div>
							<p class="text-label-md text-on-surface-variant uppercase">
								{feature.eyebrow}
							</p>
							<h3 class="text-headline-md mt-2 font-serif">{feature.title}</h3>
						</div>

						<p class="text-on-surface-variant">{feature.body}</p>
					</Card.Root>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- ─── Premium teaser strip ───────────────────────────────────── -->
<section
	class="bg-surface-container relative overflow-hidden py-12 md:py-16"
	aria-labelledby="sm-premium-teaser-headline"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 40% 70% at 85% 50%, var(--color-premium-gold-light) 0%, transparent 65%);
			opacity: 0.35;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-8"
	>
		<div class="max-w-2xl">
			<p
				class="from-premium-gradient-from to-premium-gradient-to mb-3 bg-gradient-to-r bg-clip-text text-xs font-semibold tracking-[1.5px] text-transparent uppercase"
			>
				Premium · Seminary Sidekick AI
			</p>
			<h2 id="sm-premium-teaser-headline" class="text-display-sm font-serif tracking-tight">
				A study companion lives inside the app.
			</h2>
			<p class="text-on-surface-variant mt-3 text-body-lg leading-relaxed">
				Daily prompts, dynamic journal questions, suggested goals, reflection prompts — all
				curated for doctrinal mastery, never an open chat.
			</p>
		</div>

		<Button href="/premium" variant="outlined">
			Learn more about Premium
			<ArrowRight aria-hidden="true" />
		</Button>
	</div>
</section>

<!-- ─── FAQ ───────────────────────────────────────────────────── -->
<section class="bg-surface py-16 md:py-24" aria-labelledby="sm-faq-headline">
	<div class="mx-auto max-w-3xl px-4 md:px-8">
		<div class="mb-12 flex items-start gap-4">
			<span
				class="bg-surface-container-high text-on-surface-variant flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
				aria-hidden="true"
			>
				<HelpCircle class="h-6 w-6" stroke-width={1.5} />
			</span>
			<div>
				<p class="eyebrow">FAQ</p>
				<h2
					id="sm-faq-headline"
					class="text-display-md md:text-display-lg font-serif tracking-tight"
				>
					Things people ask before they install.
				</h2>
			</div>
		</div>

		<dl class="space-y-6">
			{#each faqs as faq (faq.q)}
				<div class="card">
					<dt class="text-headline-sm font-serif">{faq.q}</dt>
					<dd class="text-on-surface-variant mt-3 text-body-lg leading-relaxed">
						{faq.a}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!-- ─── Final CTA ─────────────────────────────────────────────── -->
<section
	class="bg-primary text-on-primary py-16 md:py-20 lg:py-24"
	aria-labelledby="sm-final-cta-headline"
>
	<div class="mx-auto max-w-4xl px-4 text-center md:px-8">
		<h2
			id="sm-final-cta-headline"
			class="text-display-lg font-serif tracking-tight md:text-4xl lg:text-5xl"
		>
			Pick a verse. Prove it cold.
		</h2>

		<p class="text-on-primary/90 mt-4 text-lg leading-relaxed md:text-xl md:leading-relaxed">
			Free to start. The first scripture is one tap away.
		</p>

		<div class="mt-10 flex justify-center">
			<StoreButtons variant="secondary" size="lg" showComingSoon />
		</div>
	</div>
</section>
