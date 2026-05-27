<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	/**
	 * Separator — used sparingly. Per THEME.md's "No-Line" philosophy,
	 * prefer surface elevation or whitespace before reaching for this.
	 */
	let {
		class: className,
		ref = $bindable(null),
		orientation = 'horizontal',
		decorative = true,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	class={cn(
		'bg-outline-variant/40',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
	{...restProps}
></div>
