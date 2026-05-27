<!--
  HowItWorks — TASK-B-011

  The four-step loop that drives the whole product: Study → Build → Prove → Master.
  This is the section that explains *why* the app works, in four moves the reader
  can hold in their head after one read.

  Per THEME.md:
  - Section bg surface-container-low (alternating rhythm with the surface Hero
    above it and the surface PremiumPeek below).
  - Cards use the Card primitive with `hover` for the editorial → floating lift.
  - Each step has a soft tinted icon disc — the four discs use different
    brand-aligned tints so the cards read as a sequence without numbering doing
    all the work.
  - Gold (mastery-eternal) only appears on the Master disc. Per THEME.md "Mastery
    level colors (used in screenshots and the How-it-works section)", gold here is
    sanctioned because it IS the scripture-mastery moment — not premium-AI usage.

  Each step also has a paired illustration placeholder under static/images/how/.
  The live component renders a lucide icon today; when real illustrations land
  the owner swaps the icon block for an <img> per the .txt files.
-->

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Icon, BookOpen, Blocks, ShieldCheck, Sparkles } from 'lucide-svelte';

	type Step = {
		number: string;
		title: string;
		body: string;
		// `typeof Icon` is the base lucide-svelte 0.470 type that every named
		// icon extends. Mass-swap to `@lucide/svelte` is deferred (see Hero).
		icon: typeof Icon;
		/** Tailwind classes for the icon disc background + icon color. */
		iconBg: string;
		iconColor: string;
	};

	const steps: Step[] = [
		{
			number: '01',
			title: 'Study',
			body: 'Read the scripture and hear it aloud. First contact, no pressure.',
			icon: BookOpen,
			iconBg: 'bg-primary-fixed',
			iconColor: 'text-primary'
		},
		{
			number: '02',
			title: 'Build',
			body: 'Drag word tiles to reconstruct the verse — a verse you can build is a verse you understand.',
			icon: Blocks,
			iconBg: 'bg-secondary-container',
			iconColor: 'text-secondary'
		},
		{
			number: '03',
			title: 'Prove',
			body: 'Type or say it cold, no prompts. The moment you know you know it.',
			icon: ShieldCheck,
			iconBg: 'bg-accent-light/30',
			iconColor: 'text-accent'
		},
		{
			number: '04',
			title: 'Master',
			body: 'Daily review keeps it sealed in. Year after year, not just for the quiz.',
			icon: Sparkles,
			iconBg: 'bg-tertiary-fixed',
			iconColor: 'text-tertiary'
		}
	];
</script>

<section
	id="how-it-works"
	class="bg-surface-container-low py-16 md:py-24"
	aria-labelledby="how-it-works-headline"
>
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<div class="max-w-3xl">
			<p class="eyebrow">How it works</p>
			<h2
				id="how-it-works-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Study, build, prove, master.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				Four passes through the same scripture, each one a different way of meeting the
				words. That's why they stick.
			</p>
		</div>

		<ol
			class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
			aria-label="The four-step mastery loop"
		>
			{#each steps as step (step.number)}
				{@const Icon = step.icon}
				<li class="h-full">
					<Card.Root hover class="flex h-full flex-col gap-5">
						<!--
							Icon disc — soft tinted background per step. When the real
							illustration lands (see static/images/how/<step>.txt), swap
							this <div> for an <img> at the intended path.
						-->
						<div
							class="flex h-14 w-14 items-center justify-center rounded-full {step.iconBg}"
							aria-hidden="true"
						>
							<Icon class="h-7 w-7 {step.iconColor}" stroke-width={1.5} />
						</div>

						<div class="flex items-baseline gap-3">
							<span
								class="text-label-md text-on-surface-variant tabular-nums uppercase"
								aria-hidden="true"
							>
								{step.number}
							</span>
							<h3 class="font-serif text-headline-md">{step.title}</h3>
						</div>

						<p class="text-on-surface-variant">{step.body}</p>
					</Card.Root>
				</li>
			{/each}
		</ol>
	</div>
</section>
