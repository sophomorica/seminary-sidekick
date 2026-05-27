<!--
  SampleOutput — TASK-B-030

  Static example card on /premium that "proves" the AI writes good
  content without exposing a live Grok call (per NEW_SITE_PLAN.md:
  "We do not expose a live Grok call on the website.").

  Visual treatment per THEME.md "Premium / Sidekick AI":
    - White surface, gold left-edge marker stripe (the gold is sacred
      and used as accent, not fill).
    - Soft premium-gold-light tint as a hairline ring so the card reads
      as "AI-touched" without going full gold.
    - Small label chip up top names the output type ("Daily prompt",
      "Reflection question", "Suggested goal").
    - Optional scripture reference rendered as a book-nt pill in the
      same style as the PremiumPeek mockup.

  Used by: src/routes/premium/+page.svelte
-->
<script lang="ts">
	import { Sparkles } from 'lucide-svelte';

	let {
		label,
		icon: Icon = Sparkles,
		title,
		body,
		reference
	}: {
		/** Short label for the kind of output ("Daily prompt", "Suggested goal"...). */
		label: string;
		/** Lucide icon next to the label. Typed as `typeof Sparkles` to match
		    the legacy SvelteComponentTyped classes lucide-svelte exports. */
		icon?: typeof Sparkles;
		/** Optional italic serif title — e.g. "Today’s prompt." */
		title?: string;
		/** Main body text — the actual AI output. */
		body: string;
		/** Optional scripture reference shown as a book-nt pill at the bottom. */
		reference?: string;
	} = $props();
</script>

<article
	class="relative overflow-hidden rounded-4xl bg-surface-container-lowest p-7 shadow-editorial ring-1 ring-premium-gold-light/40 md:p-8"
>
	<!-- Gold edge marker — same idiom as the PremiumPeek card. -->
	<span
		class="absolute top-6 bottom-6 left-0 w-1 rounded-r-full bg-premium-gold"
		aria-hidden="true"
	></span>

	<div class="flex items-center gap-2">
		<Icon class="h-3.5 w-3.5 text-premium-gold" aria-hidden="true" />
		<span class="text-label-md uppercase text-on-surface-variant">{label}</span>
	</div>

	{#if title}
		<p class="mt-4 font-serif text-headline-md italic text-on-surface">{title}</p>
	{/if}

	<p class="mt-3 text-body-lg leading-relaxed text-on-surface">{body}</p>

	{#if reference}
		<span
			class="mt-5 inline-flex items-center rounded-full bg-book-nt/10 px-3 py-1 text-label-md text-book-nt"
		>
			{reference}
		</span>
	{/if}
</article>
