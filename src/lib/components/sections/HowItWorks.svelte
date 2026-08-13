<!--
  HowItWorks — TASK-B-011 + Scripture Builder showcase

  The four-step loop that drives the whole product: Study → Build → Prove → Master.
  The live Scripture Builder animation is the section — cards under it jump
  the play-through so a teacher or student can see how the tool actually works.

  Per THEME.md:
  - Section bg surface-container-low (alternating rhythm with the surface Hero
    above it and the surface Quick Quiz below).
  - Gold only on the Master moment (scripture-mastery, not premium-AI).
-->
<script lang="ts">
	import { ScriptureBuilderShowcase } from '$lib/components/demos/scripture-builder';
	import { reveal } from '$lib/actions';
</script>

<section
	id="how-it-works"
	class="scroll-mt-24 bg-surface-container-low py-16 md:py-24"
	aria-labelledby="how-it-works-headline"
>
	<div class="mx-auto max-w-6xl px-4 md:px-8" use:reveal>
		<div class="max-w-3xl">
			<p class="eyebrow">How it works</p>
			<h2
				id="how-it-works-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Study, build, prove, master.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				Four passes through the same scripture — and Scripture Builder is the tool that
				makes each pass stick. Watch it reconstruct 2 Nephi 2:25.
			</p>
		</div>

		<ScriptureBuilderShowcase />
	</div>
</section>
