<!--
  Advanced first-letter hint sheet. Same display as Advanced Scripture
  Builder in the app (TypedDisplayRules): first letter of each word,
  remaining letters as underscores. Not Master. No verse answer key.
  No numbers. Layout contract matches the proof PDF sent to Patrick;
  colors/type follow this site's printout page.
-->
<script lang="ts">
	import type { Scripture } from '$lib/data/types';
	import { advancedHintLines, advancedHintText } from '$lib/scripture-builder/advancedHints';

	let { scripture }: { scripture: Scripture } = $props();

	const hintLine = $derived(advancedHintText(scripture.fullText));
	const hintLines = $derived(advancedHintLines(scripture.fullText));
</script>

<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
	<header
		class="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-primary pb-3"
	>
		<div>
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick
			</p>
			<p class="mt-2 font-serif text-body-md text-on-surface-variant italic">
				Scripture Builder · Advanced
			</p>
		</div>
		<p
			class="inline-block rounded-full bg-primary px-3 py-1 text-label-sm font-semibold tracking-wide text-on-primary uppercase"
		>
			Advanced
		</p>
	</header>

	<h1
		class="font-serif text-[2.75rem] leading-none text-primary md:text-[3.5rem] print:text-[48pt]"
	>
		{scripture.reference}
	</h1>

	<p class="mt-4 mb-8 text-body-lg text-on-surface-variant italic">
		Type it with first-letter hints. Same Advanced as the app. No answer key.
	</p>

	<div class="rounded-[2rem] bg-secondary-container px-6 py-10 md:px-10 md:py-12">
		<p
			class="text-center font-serif text-[1.85rem] leading-[1.9] tracking-[0.08em] text-on-secondary-container md:text-[2.2rem] print:text-[26pt]"
			data-hint-line={hintLine}
			aria-label={hintLine}
		>
			{#each hintLines as line (line)}
				<span class="block">{line}</span>
			{/each}
		</p>
	</div>

	<footer
		class="mt-10 flex flex-wrap items-start justify-between gap-3 text-label-sm text-on-surface-variant"
	>
		<p>
			Same Advanced hints as the app (first letter of each word). Not cutouts. No numbers. No
			full verse.
		</p>
		<p>US Letter · seminarysidekick.com</p>
	</footer>
</article>
