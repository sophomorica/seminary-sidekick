<!--
  Advanced first-letter hint sheet. Same display as Advanced Scripture
  Builder in the app — first letter of each word, remaining letters as
  underscores. Not Master (write-it-down). No verse answer key. No numbers.
-->
<script lang="ts">
	import type { Scripture } from '$lib/data/types';
	import { advancedHintText, advancedHintWords } from '$lib/scripture-builder/advancedHints';

	let { scripture }: { scripture: Scripture } = $props();

	const hintWords = $derived(advancedHintWords(scripture.fullText));
	const hintLine = $derived(advancedHintText(scripture.fullText));
</script>

<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
	<header
		class="mb-6 flex flex-wrap items-end justify-between gap-3 border-b-[3px] border-primary pb-3"
	>
		<div>
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Scripture Builder
			</p>
			<p class="mt-2 text-label-md text-on-surface-variant uppercase">{scripture.name}</p>
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

	<p class="mt-4 mb-8 text-body-lg text-on-surface-variant">
		First-letter hints — same as Advanced Scripture Builder in the app. Fill in the missing
		letters. This sheet is not an answer key.
	</p>

	<p
		class="font-serif text-[2rem] leading-[1.7] tracking-[0.14em] md:text-[2.35rem] print:text-[28pt]"
		data-hint-line={hintLine}
		aria-label={hintLine}
	>
		{#each hintWords as word, wordIndex (`${wordIndex}-${word.map((g) => g.text).join('')}`)}
			{#if wordIndex > 0}<span> </span>{/if}<span class="inline-block whitespace-nowrap"
				>{#each word as glyph, glyphIndex (`${wordIndex}-${glyphIndex}-${glyph.kind}`)}<span
						class={glyph.kind === 'hint'
							? 'font-semibold text-primary'
							: 'text-on-surface-variant'}>{glyph.text}</span
					>{/each}</span
			>
		{/each}
	</p>

	<footer class="mt-10 text-label-sm text-on-surface-variant">
		<p>US Letter · first-letter hints · seminarysidekick.com</p>
	</footer>
</article>
