<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		value = $bindable(),
		type = 'text',
		...restProps
	}: HTMLInputAttributes & {
		ref?: HTMLInputElement | null;
	} = $props();
</script>

<input
	bind:this={ref}
	bind:value
	{type}
	class={cn(
		'h-12 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-lowest',
		'px-4 py-2 text-body-lg text-on-surface placeholder:text-on-surface-variant/60',
		'transition-colors duration-150 ease-out-soft',
		'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
/>
