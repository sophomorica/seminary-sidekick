<!--
  /for-teachers — TASK-B-031

  A full page aimed at seminary teachers, parents, and youth leaders.
  Expands the homepage <ForTeachersStrip /> into a real pitch:
    1. Hero with eyebrow + serif headline
    2. "Why we built this" — Patrick's voice (TODO marker for owner refine)
    3. "How a class can use it" — three cards (warmup / habit / group)
    4. "What about AI safety?" — curated, age-appropriate, privacy-first
    5. "Coming soon" forward-looking strip — resource library + community
    6. "Get in touch" CTA — mailto

  Visuals follow THEME.md exactly: tinted surfaces, rounded-4xl cards,
  shadow-editorial, lucide icons, no <style> blocks, no raw hex.
  Sections alternate surface ↔ surface-container-low for rhythm.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '$lib/config/site';
	import {
		Icon,
		Timer,
		Repeat,
		Users,
		ShieldCheck,
		BookOpenCheck,
		Lock,
		Mail,
		ArrowRight,
		Sparkles
	} from 'lucide-svelte';

	const pageTitle = `For teachers — ${SITE_NAME}`;
	const pageDescription =
		'Why we built Seminary Sidekick, how a class can use it, and how we think about AI safety, privacy, and age-appropriateness.';
	const canonical = `${SITE_URL}/for-teachers`;

	type ClassroomUse = {
		title: string;
		body: string;
		icon: typeof Icon;
		iconBg: string;
		iconColor: string;
		hint?: string;
	};

	const classroomUses: ClassroomUse[] = [
		{
			title: '5-minute class warmup',
			body: 'Open the day with a Quick Quiz on this week’s reference. Students get a fast win, you get a read on who still needs the verse.',
			icon: Timer,
			iconBg: 'bg-primary-fixed',
			iconColor: 'text-primary'
		},
		{
			title: 'A daily personal habit',
			body: 'Students take it home and build a streak of two or three Scripture Builder runs a day. Spaced repetition keeps verses sealed in.',
			icon: Repeat,
			iconBg: 'bg-secondary-container',
			iconColor: 'text-secondary'
		},
		{
			title: 'Group competition',
			body: 'Run a class round on the board — books, references, key phrases. A live Kahoot-style multiplayer mode is coming next.',
			icon: Users,
			iconBg: 'bg-accent-light/30',
			iconColor: 'text-accent',
			hint: 'Coming soon'
		}
	];

	type Safeguard = {
		title: string;
		body: string;
		icon: typeof Icon;
	};

	const safeguards: Safeguard[] = [
		{
			title: 'Scoped to doctrinal mastery',
			body: 'Seminary Sidekick AI is not an open chatbot. It only answers questions about the 100 doctrinal-mastery scriptures and how to study them. No tangents, no current-events takes, no theology debates.',
			icon: BookOpenCheck
		},
		{
			title: 'Age-appropriate by default',
			body: 'Prompts, journal questions, and reflection cards are written for seminary-aged students. Every prompt is curated; nothing comes back uninspected from a raw model.',
			icon: ShieldCheck
		},
		{
			title: 'Privacy-first',
			body: 'Progress lives on the device. We don’t sell student data, we don’t need an account to use the app, and the AI doesn’t see anything beyond the snapshot needed to help that student that day.',
			icon: Lock
		}
	];
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

<!-- ─── Hero ───────────────────────────────────────────────────── -->
<section
	class="relative overflow-hidden bg-surface pt-16 pb-12 md:pt-24 md:pb-20"
	aria-labelledby="for-teachers-headline"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 60% 50% at 15% 10%, var(--color-primary-fixed) 0%, transparent 55%),
			radial-gradient(ellipse 50% 45% at 90% 90%, var(--color-secondary-container) 0%, transparent 60%);
			opacity: 0.5;"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-4xl px-4 md:px-8">
		<p class="eyebrow">For teachers and leaders</p>
		<h1
			id="for-teachers-headline"
			class="font-serif text-display-lg tracking-tight md:text-hero-lg"
		>
			A focused, reverent tool for your classroom.
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
			Seminary Sidekick helps your students actually internalize the 100 doctrinal-mastery
			scriptures — without ads, social noise, or the usual app distractions. Built for the
			five minutes before class, the ride home, and every quiet moment in between.
		</p>
	</div>
</section>

<!-- ─── Why we built this ──────────────────────────────────────── -->
<!-- TODO(owner): refine voice. The two paragraphs below are a stand-in for
     Patrick to rewrite in his own voice once he has a quiet evening. Keep
     it personal, plain, specific. -->
<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="why-we-built-this">
	<div
		class="mx-auto grid max-w-6xl gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16"
	>
		<div class="max-w-2xl">
			<p class="eyebrow">Why we built this</p>
			<h2
				id="why-we-built-this"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				A small tool for a thing that matters.
			</h2>
			<div class="mt-6 space-y-5 text-lg leading-relaxed text-on-surface-variant">
				<p>
					I sat in seminary, taught seminary, and watched a generation of students try to
					memorize 100 scriptures with flashcards, photocopies, and willpower. Some of it
					stuck. Most of it didn’t. The verses I still know cold are the ones I came back
					to dozens of times — not the ones I crammed for a quiz.
				</p>
				<p>
					Seminary Sidekick is the tool I wished I had as a teacher: a calm, focused place
					where a student can study, build, prove, and master each scripture, then come
					back the next day and prove it again. No ads. No leaderboards begging for
					attention. Just the words and a path to actually owning them.
				</p>
			</div>
		</div>

		<div class="relative">
			<img
				src="/images/illustrations/study.jpg"
				alt="A seminary student studying scripture in a quiet, warm light"
				class="aspect-[4/5] w-full rounded-4xl object-cover shadow-floating"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<!-- ─── How a class can use it ─────────────────────────────────── -->
<section class="bg-surface py-16 md:py-24" aria-labelledby="how-a-class-can-use-it">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">How a class can use it</p>
			<h2
				id="how-a-class-can-use-it"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Three shapes that already work.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				You don’t need to redesign your class around an app. Pick one of these and try it
				for a week.
			</p>
		</div>

		<ul
			class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16"
			aria-label="Three classroom uses"
		>
			{#each classroomUses as use (use.title)}
				{@const Icon = use.icon}
				<li class="h-full">
					<Card.Root class="flex h-full flex-col gap-5">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full {use.iconBg}"
							aria-hidden="true"
						>
							<Icon class="h-7 w-7 {use.iconColor}" stroke-width={1.5} />
						</div>

						<div class="flex flex-wrap items-baseline gap-3">
							<h3 class="font-serif text-headline-md">{use.title}</h3>
							{#if use.hint}
								<span
									class="rounded-full bg-surface-container-low px-2.5 py-0.5 text-xs font-medium tracking-wide text-on-surface-variant uppercase"
								>
									{use.hint}
								</span>
							{/if}
						</div>

						<p class="text-on-surface-variant">{use.body}</p>
					</Card.Root>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ─── What about AI safety? ──────────────────────────────────── -->
<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="ai-safety">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">What about AI safety?</p>
			<h2 id="ai-safety" class="font-serif text-display-md tracking-tight md:text-display-lg">
				Curated, scoped, and quiet about your kids.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				The Seminary Sidekick AI is a premium feature, and we treat it like one. Here’s what
				that means in plain terms.
			</p>
		</div>

		<ul
			class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16"
			aria-label="Three AI safety commitments"
		>
			{#each safeguards as item (item.title)}
				{@const Icon = item.icon}
				<li class="h-full">
					<Card.Root class="flex h-full flex-col gap-5">
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary-fixed"
							aria-hidden="true"
						>
							<Icon class="h-7 w-7 text-tertiary" stroke-width={1.5} />
						</div>
						<h3 class="font-serif text-headline-md">{item.title}</h3>
						<p class="text-on-surface-variant">{item.body}</p>
					</Card.Root>
				</li>
			{/each}
		</ul>

		<div class="mt-10 flex flex-wrap items-center gap-2">
			{#each ['No ads, ever', 'No student data sold', 'AI scoped to doctrinal mastery', 'Account-free to use'] as signal (signal)}
				<span
					class="rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-surface md:text-sm"
				>
					{signal}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Coming soon ────────────────────────────────────────────── -->
<section class="bg-surface py-16 md:py-20" aria-labelledby="coming-soon">
	<div class="mx-auto max-w-4xl px-4 md:px-8">
		<div
			class="flex flex-col gap-6 rounded-5xl bg-surface-container-lowest p-8 shadow-editorial md:flex-row md:items-center md:gap-8 md:p-12"
		>
			<div
				class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed"
				aria-hidden="true"
			>
				<Sparkles class="h-7 w-7 text-tertiary" stroke-width={1.5} />
			</div>
			<div class="flex-1">
				<p class="eyebrow">Coming soon</p>
				<h2
					id="coming-soon"
					class="font-serif text-headline-lg tracking-tight md:text-display-sm"
				>
					A teacher resource library and a place to swap ideas.
				</h2>
				<p class="mt-3 text-on-surface-variant">
					Lesson outlines, object lessons, printable handouts, and a small community of
					teachers sharing what worked this week. We’re building it next, alongside the
					multiplayer class mode. Want a say in what ships first? The mailto below goes
					straight to me.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ─── Get in touch ───────────────────────────────────────────── -->
<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="get-in-touch">
	<div class="mx-auto max-w-3xl px-4 text-center md:px-8">
		<p class="eyebrow">Get in touch</p>
		<h2 id="get-in-touch" class="font-serif text-display-md tracking-tight md:text-display-lg">
			Bringing this into your class? I’d love to hear from you.
		</h2>
		<p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-on-surface-variant">
			Questions, feedback, a quirky idea, or you just want to tell me how your class is using
			it — email goes straight to a human (me).
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<Button href={`mailto:${CONTACT_EMAIL}`} variant="primary">
				<Mail aria-hidden="true" />
				Email {CONTACT_EMAIL}
			</Button>
			<Button href="/premium" variant="outlined">
				See the AI features
				<ArrowRight aria-hidden="true" />
			</Button>
		</div>
	</div>
</section>
