<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: HTMLLabelAttributes & { ref?: HTMLLabelElement | null } = $props();
</script>

<label
	bind:this={ref}
	class={cn(
		'text-label-lg text-on-surface',
		'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
