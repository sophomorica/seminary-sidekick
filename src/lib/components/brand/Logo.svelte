<script lang="ts">
	import { cn } from '$lib/utils';

	/**
	 * Logo — placeholder, text-only. Replace with real SVG/PNG when the
	 * owner provides the final logo (see open question #3 in NEW_SITE_PLAN.md).
	 *
	 * Static/images/brand/logo.svg is the intended path. Until that exists,
	 * we render "Seminary Sidekick" in Merriweather italic.
	 */
	let {
		class: className,
		size = 'default'
	}: {
		class?: string;
		size?: 'sm' | 'default' | 'lg';
	} = $props();

	const sizeClasses = {
		sm: 'text-lg',
		default: 'text-xl md:text-2xl',
		lg: 'text-3xl md:text-4xl'
	};
</script>

<a
	href="/"
	class={cn(
		'inline-flex items-baseline gap-2 font-serif italic font-bold text-on-surface',
		'transition-colors hover:text-primary focus-ring rounded-md',
		sizeClasses[size],
		className
	)}
	aria-label="Seminary Sidekick — home"
>
	Seminary&nbsp;Sidekick
</a>
