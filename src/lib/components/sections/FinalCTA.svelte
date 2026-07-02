<!--
  FinalCTA — TASK-B-015

  The confident closer. Last conversion band before the footer.

  Full-width `bg-primary` treatment with `text-on-primary` (white) for strong,
  warm, editorial presence. Models Hero's generous vertical rhythm and
  centered textual weight but as a solid dark band.

  - Headline exactly: "Start with the first scripture. Get the app."
  - Short supporting line — reverent, direct, non-salesy.
  - Uses <StoreButtons /> (reads real URLs + availability flags from store.ts).
  - Variant="secondary" + size="lg" for high visual impact and excellent
    contrast (sage buttons on rust primary band).
  - Fully responsive, AA contrast verified via tokens.
  - Pure Tailwind utilities only. No <style> blocks. Svelte 5 runes.

  Placed last in homepage composition (see CLAUDE.md example).
-->
<script lang="ts">
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { reveal } from '$lib/actions';
</script>

<section
	id="final-cta"
	class="bg-primary py-16 text-on-primary md:py-20 lg:py-24"
	aria-labelledby="final-cta-headline"
>
	<div class="mx-auto max-w-4xl px-4 text-center md:px-8" use:reveal>
		<h2
			id="final-cta-headline"
			class="font-serif text-display-lg tracking-tight md:text-4xl lg:text-5xl"
		>
			Start with the first scripture. Get the app.
		</h2>

		<p class="mt-4 text-lg leading-relaxed text-on-primary/90 md:text-xl md:leading-relaxed">
			Free for seminary students. Mastery begins with a single verse.
		</p>

		<div class="mt-10 flex justify-center">
			<StoreButtons variant="secondary" size="lg" showComingSoon />
		</div>
	</div>
</section>
