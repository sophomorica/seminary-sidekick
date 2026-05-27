<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="dropdown-menu-shortcut"
	class={cn(
		'text-on-surface-variant group-focus/dropdown-menu-item:text-on-surface ml-auto text-xs tracking-widest',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
