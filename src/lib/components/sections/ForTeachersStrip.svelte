<!--
  ForTeachersStrip — TASK-B-013

  Compact homepage strip pitching Seminary Sidekick to teachers and parents.
  Three sentences max for the pitch. Trust signals as a clean horizontal row
  (wraps on mobile). Live saved-class pointer + a link to the teacher library.
  CTAs link to /teachers, /for-teachers, and /for-teachers#saved-class.

  Visuals follow Hero.svelte + THEME.md exactly:
  - surface-container background for section rhythm
  - .eyebrow utility
  - Button from ui/button (outlined variant for secondary feel)
  - lucide-svelte icons
  - Svelte 5 runes ($props ready if needed)
  - Pure Tailwind, no <style> blocks
  - Mobile-first, generous but compact spacing, editorial calm voice
  - Respects reduced motion (none applied here)
-->

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from 'lucide-svelte';
	import { reveal } from '$lib/actions';
</script>

<section class="bg-surface-container py-12 md:py-16" aria-labelledby="for-teachers-strip-headline">
	<div class="mx-auto max-w-6xl px-4 md:px-8" use:reveal>
		<p class="eyebrow">For teachers & parents</p>

		<h2
			id="for-teachers-strip-headline"
			class="font-serif text-headline-md max-w-3xl tracking-tight"
		>
			A focused, reverent companion for the students in your class and home.
		</h2>

		<div class="mt-4 max-w-2xl space-y-3 text-body-lg text-on-surface-variant">
			<p>
				Seminary Sidekick helps your students internalize the scriptures without ads, social
				noise, or distractions. Save the classroom once — students pick their name next
				period.
			</p>
			<p>
				Everything is age-appropriate and privacy-first. The AI is curated specifically to
				support doctrinal mastery.
			</p>
		</div>

		<!-- Trust signals: horizontal list on desktop, wraps cleanly on mobile -->
		<div class="mt-6 flex flex-wrap items-center gap-2">
			{#each ['No ads', 'Age-appropriate', 'Privacy-first', 'AI curated for doctrinal mastery'] as signal (signal)}
				<span
					class="rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-surface md:text-sm"
				>
					{signal}
				</span>
			{/each}
		</div>

		<p class="mt-6 max-w-2xl text-body-md text-on-surface-variant">
			<a
				href="/for-teachers#saved-class"
				class="font-semibold text-accent underline-offset-2 hover:underline"
				>Save your class</a
			>
			in the app today.
			<a href="/teachers" class="font-semibold text-accent underline-offset-2 hover:underline"
				>The teacher library</a
			>
			is open — advice, Class Play help, and doctrinal mastery tips. Lesson plans and testimonials
			come when they are real.
		</p>

		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/teachers" variant="outlined">
				Teacher library
				<ArrowRight aria-hidden="true" />
			</Button>
			<Button href="/for-teachers" variant="outlined">
				For teachers
				<ArrowRight aria-hidden="true" />
			</Button>
			<Button href="/for-teachers#saved-class" variant="outlined">
				How to save a class
				<ArrowRight aria-hidden="true" />
			</Button>
		</div>
	</div>
</section>
