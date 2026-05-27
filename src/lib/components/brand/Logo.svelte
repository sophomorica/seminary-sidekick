<script lang="ts">
	import { cn } from '$lib/utils';

	/**
	 * Logo — Seminary Sidekick brand mark.
	 *
	 * Renders the app icon (from `static/images/brand/app-icon.png`,
	 * sourced from the Flutter app's `assets/icon/app_icon.png`) next to
	 * the wordmark in Merriweather italic. Wraps in an `<a>` to home.
	 *
	 * The icon is the same one used on iOS, macOS, and the Play Store —
	 * keeping the website and the apps visually unified.
	 */
	let {
		class: className,
		size = 'default',
		showWordmark = true
	}: {
		class?: string;
		size?: 'sm' | 'default' | 'lg';
		/** Hide the "Seminary Sidekick" text and render just the icon. */
		showWordmark?: boolean;
	} = $props();

	const iconSizeClasses = {
		sm: 'h-6 w-6',
		default: 'h-8 w-8 md:h-9 md:w-9',
		lg: 'h-12 w-12 md:h-14 md:w-14'
	};

	const textSizeClasses = {
		sm: 'text-base',
		default: 'text-lg md:text-xl',
		lg: 'text-2xl md:text-3xl'
	};
</script>

<a
	href="/"
	class={cn(
		'group inline-flex items-center gap-2.5',
		'focus-ring rounded-md transition-colors',
		className
	)}
	aria-label="Seminary Sidekick — home"
>
	<img
		src="/images/brand/app-icon.png"
		alt=""
		class={cn(iconSizeClasses[size], 'rounded-[20%] shadow-editorial')}
		decoding="async"
		fetchpriority="high"
	/>
	{#if showWordmark}
		<span
			class={cn(
				'font-serif italic font-bold text-on-surface',
				'transition-colors group-hover:text-primary',
				textSizeClasses[size]
			)}
		>
			Seminary&nbsp;Sidekick
		</span>
	{/if}
</a>
