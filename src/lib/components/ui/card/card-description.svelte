<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: HTMLAttributes<HTMLParagraphElement> & { ref?: HTMLParagraphElement | null } = $props();
</script>

<p bind:this={ref} class={cn('text-body-md text-on-surface-variant', className)} {...restProps}>
	{@render children?.()}
</p>
