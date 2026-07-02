<!--
  AppCard — TASK-B-032

  Reusable card for the /apps suite-portfolio grid. Two display modes:

    1. Live app (default) — icon disc, title, description, "Learn more →"
       link, and optionally a row of <StoreButtons />. The whole card lifts
       on hover (card-hover).

    2. Coming-soon (`comingSoon=true`) — neutral icon, muted copy, no link,
       no store buttons. Renders the eyebrow "Coming soon" so the framing
       reads as "future Sidekick app" without naming anything we haven't
       committed to. Sits at slightly lower elevation than a live card so
       the eye lands on the real product first.

  Per THEME.md:
    - rounded-4xl + shadow-editorial (live) / no elevation (coming soon)
    - tinted icon disc using brand tokens (live) or surface tone (placeholder)
    - never a hardcoded hex, never a default shadow-lg/xl
    - generous internal padding, no borders to separate (No-Line)

  Used by /apps. Not currently used elsewhere but built generically so
  Tier 2 (future Sidekick apps) can drop in additional cards with no
  changes to this component.
-->
<script lang="ts">
	import { ArrowRight, type Icon } from 'lucide-svelte';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';

	let {
		title,
		description,
		icon,
		href,
		comingSoon = false,
		storeButtons = false,
		eyebrow,
		iconBg = 'bg-primary-fixed',
		iconColor = 'text-primary'
	}: {
		title: string;
		description: string;
		/** lucide-svelte icon component */
		icon: typeof Icon;
		/** Internal route for the "Learn more" link. Required when not comingSoon. */
		href?: string;
		/** Render as a muted "future app" placeholder instead of a live card. */
		comingSoon?: boolean;
		/** Render <StoreButtons /> in the card footer. Only meaningful when not comingSoon. */
		storeButtons?: boolean;
		/** Override the small uppercase label above the title. Defaults to "Sidekick app" / "Coming soon". */
		eyebrow?: string;
		/** Tailwind class for the icon disc background. */
		iconBg?: string;
		/** Tailwind class for the icon color. */
		iconColor?: string;
	} = $props();

	const resolvedEyebrow = $derived(eyebrow ?? (comingSoon ? 'Coming soon' : 'Sidekick app'));
	const IconCmp = $derived(icon);
</script>

{#if comingSoon}
	<!--
		Coming-soon card. Lower contrast: surface-container-low background
		(no white lift), no shadow, no hover, neutral icon tint. The aim is
		"this slot is reserved" — visible but unmistakably secondary.
	-->
	<div
		class="bg-surface-container-low rounded-4xl flex h-full flex-col gap-5 p-8"
		data-state="coming-soon"
	>
		<div
			class="bg-surface-container-high text-on-surface-variant flex h-14 w-14 items-center justify-center rounded-full"
			aria-hidden="true"
		>
			<IconCmp class="h-7 w-7" stroke-width={1.5} />
		</div>

		<div>
			<p class="text-label-md text-on-surface-variant uppercase">{resolvedEyebrow}</p>
			<h3 class="text-headline-md mt-2 font-serif">{title}</h3>
		</div>

		<p class="text-on-surface-variant">{description}</p>
	</div>
{:else}
	<!--
		Live app card. surface-container-lowest + shadow-editorial + lift on
		hover. Inner "Learn more →" anchor handles navigation; if a card
		needs the entire surface to be clickable, wrap externally.
	-->
	<div class="card card-hover flex h-full flex-col gap-5">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-full {iconBg}"
			aria-hidden="true"
		>
			<IconCmp class="h-7 w-7 {iconColor}" stroke-width={1.5} />
		</div>

		<div>
			<p class="text-label-md text-on-surface-variant uppercase">{resolvedEyebrow}</p>
			<h3 class="text-headline-md mt-2 font-serif">{title}</h3>
		</div>

		<p class="text-on-surface-variant">{description}</p>

		{#if storeButtons}
			<div class="mt-2">
				<StoreButtons size="sm" />
			</div>
		{/if}

		{#if href}
			<div class="mt-auto pt-2">
				<a
					{href}
					class="focus-ring text-label-lg text-primary group inline-flex items-center gap-1.5 underline decoration-primary/0 underline-offset-4 transition-colors hover:decoration-primary/40"
				>
					Learn more
					<ArrowRight
						class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
						aria-hidden="true"
					/>
				</a>
			</div>
		{/if}
	</div>
{/if}
