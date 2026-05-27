<!--
  PremiumFeature — TASK-B-030

  Card tile used inside the /premium "What you get" grid. One icon,
  one serif headline, one line of body. The icon sits inside a soft
  premium-gold-light circle so the gold reads as ambient accent
  (THEME.md "sacred moment, not decoration").

  Used by: src/routes/premium/+page.svelte
-->
<script lang="ts">
	import { Sun } from 'lucide-svelte';

	let {
		icon: Icon,
		title,
		body
	}: {
		/** Lucide icon component. Typed as `typeof Sun` to match the legacy
		    SvelteComponentTyped classes that lucide-svelte still exports. */
		icon: typeof Sun;
		title: string;
		body: string;
	} = $props();
</script>

<div
	class="card card-hover flex flex-col gap-4 h-full"
	style="transition: box-shadow 250ms var(--ease-out-soft), transform 250ms var(--ease-out-soft);"
>
	<span
		class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-premium-gold-light/70 text-tertiary"
		aria-hidden="true"
	>
		<Icon class="h-6 w-6" />
	</span>

	<div>
		<h3 class="font-serif text-headline-md text-on-surface">
			{title}
		</h3>
		<p class="mt-2 text-body-md leading-relaxed text-on-surface-variant">
			{body}
		</p>
	</div>
</div>
