<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		hover = false,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement | null;
		/** Adds the card-hover lift on hover. Use for clickable cards. */
		hover?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn(
		'bg-surface-container-lowest text-on-surface rounded-4xl p-8 shadow-editorial',
		hover &&
			'transition-all duration-250 ease-out-soft hover:-translate-y-1 hover:shadow-floating cursor-pointer',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
