<!--
  Hero — TASK-B-010

  The front door of the brand. Three jobs in this order of priority:
    1. Headline lands in <3 seconds. "Master all 100 doctrinal mastery scriptures."
    2. Two CTAs always visible. Primary = get the app. Secondary = taste the demo.
    3. Show the app exists (phone-mockup screenshot or placeholder).

  Per THEME.md: large radii, tinted shadows, ease-out-soft motion,
  generous whitespace. No-Line philosophy means we never separate the
  hero with a border — surface tone + ambient gradient does the work.

  Composition in TASK-C-100 (homepage) will mount this as the first
  element under <AppNav />.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { SUITE_KICKER } from '$lib/config/site';
	import { ArrowRight } from 'lucide-svelte';

	/**
	 * Whether to render the suite kicker eyebrow above the headline.
	 * Removable for a single-app framing if owner ever wants to drop the
	 * "App 1 of more to come" line.
	 */
	let { showSuiteKicker = true }: { showSuiteKicker?: boolean } = $props();

	// Path the secondary CTA points at. Today: /quick-quiz route stub.
	// After TASK-C-100 composes the demo into the homepage, the natural
	// upgrade is the in-page anchor `#quick-quiz-demo`. Both work; the
	// route stays as a permanent direct-link too.
	const quickQuizHref = '/quick-quiz';
</script>

<section
	id="hero"
	class="relative overflow-hidden bg-surface pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32"
	aria-labelledby="hero-headline"
>
	<!--
		Ambient warm gradient — two soft radials, one primary-fixed (rust
		blush) in the top-left, one secondary-container (sage tint) in the
		bottom-right. Sits behind everything at low opacity so it reads as
		"the page is warm" rather than "there is a gradient."
	-->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 60% 50% at 15% 10%, var(--color-primary-fixed) 0%, transparent 55%),
			radial-gradient(ellipse 50% 45% at 90% 90%, var(--color-secondary-container) 0%, transparent 60%);
			opacity: 0.55;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
	>
		<!-- Copy column -->
		<div class="max-w-2xl">
			{#if showSuiteKicker}
				<p class="eyebrow">{SUITE_KICKER}</p>
			{/if}

			<h1
				id="hero-headline"
				class="font-serif text-display-lg tracking-tight md:text-hero-lg lg:text-hero-xl"
			>
				Master all 100 doctrinal mastery scriptures.
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
				A focused, fun, reverent way to <em class="font-serif italic">study</em>,
				<em class="font-serif italic">build</em>,
				<em class="font-serif italic">prove</em>, and
				<em class="font-serif italic">master</em> — for seminary students who want it to actually
				stick.
			</p>

			<div class="mt-10 flex flex-wrap items-center gap-3">
				<StoreButtons size="default" showComingSoon />
				<Button href={quickQuizHref} variant="outlined">
					Try a Quick Quiz
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>

			<p class="mt-6 text-body-sm text-on-surface-variant">
				Free to start · Built for seminary students
			</p>
		</div>

		<!-- Phone mockup column -->
		<div class="relative mx-auto w-full max-w-sm lg:max-w-none lg:justify-self-end">
			<!--
				Floating phone frame. When a real screenshot lands at
				/images/hero/phone-mockup.png, the <img> below renders inside
				this frame. Until then, the inner placeholder card shows.
			-->
			<div
				class="relative mx-auto aspect-[9/19] w-full max-w-[320px] overflow-hidden rounded-[3rem] bg-surface-container-lowest shadow-floating motion-safe:animate-float lg:max-w-[360px]"
			>
				<!-- Stylized placeholder until real screenshot lands -->
				<div
					class="absolute inset-0 flex flex-col items-center justify-between p-8 text-center"
					data-placeholder
				>
					<!-- Faux app chrome -->
					<div class="flex w-full items-center justify-between">
						<span class="text-label-sm text-on-surface-variant uppercase">9:41</span>
						<span class="h-1.5 w-12 rounded-full bg-on-surface/20"></span>
					</div>

					<!-- Verse card -->
					<div class="flex flex-1 flex-col items-center justify-center gap-4">
						<span class="text-label-md uppercase text-primary">John 14</span>
						<blockquote class="scripture text-xl">
							"If ye love me, keep my commandments."
							<footer>John 14:15 — New Testament</footer>
						</blockquote>
					</div>

					<!-- Faux Scripture Builder tile -->
					<div
						class="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-on-primary"
					>
						<div class="text-left">
							<p class="text-label-md uppercase opacity-80">Scripture Builder</p>
							<p class="text-title-lg">Prove it cold</p>
						</div>
						<span
							class="flex h-10 w-10 items-center justify-center rounded-full bg-on-primary/15"
						>
							<ArrowRight aria-hidden="true" />
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
