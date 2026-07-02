<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let {
		class: className,
		ref = $bindable(null),
		level = 3,
		children,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> & {
		ref?: HTMLHeadingElement | null;
		/** Heading level — default h3. Override when card title needs to be h2 etc. */
		level?: 1 | 2 | 3 | 4 | 5 | 6;
	} = $props();

	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={cn('font-serif text-headline-lg text-on-surface', className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
