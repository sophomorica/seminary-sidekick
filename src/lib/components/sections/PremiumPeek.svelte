<!--
  PremiumPeek — TASK-B-012

  Homepage section that introduces Seminary Sidekick AI without selling
  the full premium page. Two columns on desktop, stacked on mobile:

    Left  — a stylized mockup of the Sidekick AI journal / chat surface.
            Currently a designed placeholder card that anticipates the
            real screenshot at /images/premium/chat-screenshot.png (see
            static/images/premium/chat-screenshot.txt for spec). When
            the asset lands, swap the placeholder block for an <img>.

    Right — eyebrow with the premium-gold gradient (the only place this
            gradient lives on the homepage), serif headline, short
            sub-copy, a four-item bulleted list of what Sidekick AI
            does, and a "Learn more about Premium →" outlined CTA.

  Per THEME.md "Premium / Sidekick AI" rules:
    - Gold is an accent, not a fill. Section background stays bg-surface.
    - One subtle premium-gold-light radial behind the screenshot card
      so the gold reads as ambient, not decorative.
    - Tinted shadows (shadow-floating on the screenshot card).
    - Pill button via the outlined Button variant.

  Composition into the homepage happens in TASK-C-100.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		ArrowRight,
		Sparkles,
		Sun,
		Target,
		MessageCircleQuestion,
		BookOpen
	} from 'lucide-svelte';
	import { reveal } from '$lib/actions';

	type Feature = {
		icon: typeof Sun;
		title: string;
		body: string;
	};

	const features: Feature[] = [
		{
			icon: Sun,
			title: 'A daily prompt',
			body: 'A short, reverent question to start the day in the scriptures.'
		},
		{
			icon: Target,
			title: 'Suggested goals',
			body: 'Bite-sized weekly goals tuned to the verses you’re working on.'
		},
		{
			icon: MessageCircleQuestion,
			title: 'Reflection questions',
			body: 'Open-ended prompts that turn study into a journal, not a quiz.'
		},
		{
			icon: BookOpen,
			title: 'Scripture connections',
			body: 'Sidekick links today’s verse to the rest of doctrinal mastery.'
		}
	];
</script>

<section
	id="premium-peek"
	class="relative overflow-hidden bg-surface py-16 md:py-24"
	aria-labelledby="premium-peek-headline"
>
	<!--
		Ambient premium-gold-light radial behind the screenshot column.
		Low opacity so the section reads as "warm" rather than "gold."
		Per THEME.md: gold is sacred, used as an accent, never a fill.
	-->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 45% 55% at 22% 50%, var(--color-premium-gold-light) 0%, transparent 60%);
			opacity: 0.35;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16"
		use:reveal
	>
		<!-- Screenshot column -->
		<div class="order-2 lg:order-1">
			<!--
				Floating "screenshot" frame. When a real export lands at
				/images/premium/chat-screenshot.png, replace the inner
				placeholder block with:
				  <img
				    src="/images/premium/chat-screenshot.png"
				    alt="Seminary Sidekick AI suggesting today's reflection prompt."
				    class="block w-full"
				    loading="lazy"
				    decoding="async"
				  />
			-->
			<div
				class="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-surface-container-lowest p-6 shadow-floating md:p-8 lg:max-w-none"
			>
				<!-- Header chip: Today + date + faint wordmark -->
				<div class="flex items-center justify-between">
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-premium-gold-light/60 px-3 py-1 text-label-md uppercase text-on-surface"
					>
						<Sparkles class="h-3.5 w-3.5 text-premium-gold" aria-hidden="true" />
						Today
					</span>
					<span class="text-body-sm text-on-surface-variant">Wednesday, May 27</span>
				</div>

				<!-- Sidekick AI prompt card -->
				<div
					class="relative mt-6 overflow-hidden rounded-3xl bg-surface-container-low p-6 shadow-editorial"
				>
					<!-- Gold edge marker -->
					<span
						class="absolute top-4 bottom-4 left-0 w-1 rounded-r-full bg-premium-gold"
						aria-hidden="true"
					></span>

					<p class="font-serif text-headline-md italic text-on-surface">
						Today’s prompt.
					</p>
					<p class="mt-3 text-body-md leading-relaxed text-on-surface">
						How does keeping the commandments show love for the Savior in your life this
						week?
					</p>

					<span
						class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-book-nt/10 px-3 py-1 text-label-md text-book-nt"
					>
						From John 14:15
					</span>
				</div>

				<!-- Faux user reply bubble -->
				<div class="mt-4 flex justify-end">
					<div
						class="max-w-[80%] rounded-3xl rounded-tr-md bg-primary-fixed px-4 py-3 text-body-md text-on-primary-container"
					>
						I noticed I was quicker to forgive my sister this week, even when
						<span class="opacity-60">…</span>
					</div>
				</div>

				<!-- Suggested goal chip -->
				<div class="mt-6 flex items-center justify-between">
					<span
						class="inline-flex items-center gap-2 rounded-full border border-premium-gold/40 px-3 py-1.5 text-label-md text-on-surface"
					>
						<Sparkles class="h-3.5 w-3.5 text-premium-gold" aria-hidden="true" />
						Suggested goal — memorize John 14:15 by Friday
					</span>
				</div>
			</div>
		</div>

		<!-- Copy column -->
		<div class="order-1 max-w-xl lg:order-2">
			<!--
				Premium-gold gradient eyebrow. The only homepage element that
				uses this gradient — it signals "this is the sacred part."
			-->
			<p
				class="bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to bg-clip-text text-xs font-semibold uppercase tracking-[1.5px] text-transparent"
			>
				Seminary Sidekick AI · Premium
			</p>

			<h2
				id="premium-peek-headline"
				class="mt-3 font-serif text-display-md tracking-tight md:text-display-lg"
			>
				A study companion that meets you where you are.
			</h2>

			<p class="mt-5 max-w-lg text-body-lg leading-relaxed text-on-surface-variant">
				Sidekick AI turns daily study into a journal, not a quiz. Curated for doctrinal
				mastery, calm by design, and unmistakably yours.
			</p>

			<ul class="mt-8 space-y-5">
				{#each features as feature (feature.title)}
					<li class="flex items-start gap-4">
						<span
							class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-premium-gold-light/70 text-tertiary"
							aria-hidden="true"
						>
							<feature.icon class="h-5 w-5" />
						</span>
						<div>
							<p class="font-serif text-headline-sm text-on-surface">
								{feature.title}
							</p>
							<p class="mt-1 text-body-md text-on-surface-variant">{feature.body}</p>
						</div>
					</li>
				{/each}
			</ul>

			<div class="mt-10">
				<Button href="/premium" variant="outlined">
					Learn more about Premium
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>
		</div>
	</div>
</section>
