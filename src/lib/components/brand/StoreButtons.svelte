<script lang="ts">
	import { IOS_URL, ANDROID_URL, IOS_AVAILABLE, ANDROID_AVAILABLE } from '$lib/config/store';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Apple, Smartphone } from 'lucide-svelte';

	let {
		size = 'default',
		variant = 'primary',
		showComingSoon = true,
		class: className
	}: {
		size?: 'sm' | 'default' | 'lg';
		variant?: 'primary' | 'secondary' | 'outlined';
		/** Show "Coming soon" pill when a store isn't available. False hides it entirely. */
		showComingSoon?: boolean;
		class?: string;
	} = $props();
</script>

<!--
  Placeholder store buttons. TODO (TASK-C-110): replace with the
  official Apple App Store + Google Play badges from:
    https://developer.apple.com/app-store/marketing/guidelines/
    https://play.google.com/intl/en_us/badges/
  Drop the SVGs in static/images/badges/ and use <img> instead of <Button>.
  Per THEME.md: don't restyle the official badges.
-->
<div class={cn('flex flex-wrap items-center gap-3', className)}>
	{#if IOS_AVAILABLE}
		<Button href={IOS_URL} {variant} {size}>
			<Apple aria-hidden="true" />
			App Store
		</Button>
	{:else if showComingSoon}
		<span
			class="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-label-lg text-on-surface-variant"
		>
			<Apple aria-hidden="true" />
			Coming soon
		</span>
	{/if}

	{#if ANDROID_AVAILABLE}
		<Button href={ANDROID_URL} variant={variant === 'primary' ? 'outlined' : variant} {size}>
			<Smartphone aria-hidden="true" />
			Google Play
		</Button>
	{:else if showComingSoon}
		<span
			class="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-label-lg text-on-surface-variant"
		>
			<Smartphone aria-hidden="true" />
			Coming to Android
		</span>
	{/if}
</div>
