<script lang="ts" module>
	import { type VariantProps } from 'tailwind-variants';
	import { tv } from '$lib/utils';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	/**
	 * Button — Seminary Sidekick's primary interactive element.
	 *
	 * Variants per THEME.md:
	 *  - primary    Default brand CTA (warm rust, white text)
	 *  - secondary  Sage, white text
	 *  - outlined   Transparent with ghost border, primary text
	 *  - ghost      Transparent with no border
	 *  - tertiary   Premium gold container — RESERVED for sacred moments
	 *  - destructive  Red — destructive actions only
	 *
	 * Sizes:
	 *  - sm       h-9, compact
	 *  - default  h-12 (44px tap target), the standard size
	 *  - lg       h-14, hero CTAs
	 *  - icon     h-12 w-12 square
	 *
	 * Buttons are pill-shaped (rounded-full) by design. Don't override the radius.
	 */
	export const buttonVariants = tv({
		base: [
			'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full',
			'font-sans font-semibold tracking-[0.5px]',
			'transition-colors duration-150 ease-out-soft',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
			'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
			'disabled:pointer-events-none disabled:opacity-50',
			'[&_svg]:size-4 [&_svg]:shrink-0'
		].join(' '),
		variants: {
			variant: {
				primary: 'bg-primary text-on-primary hover:bg-primary-container',
				secondary: 'bg-secondary text-on-secondary hover:opacity-90',
				outlined:
					'border border-outline-variant/40 bg-transparent text-primary hover:bg-surface-container-low',
				ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low',
				tertiary: 'bg-tertiary-container text-on-primary hover:opacity-90',
				destructive: 'bg-error text-on-primary hover:opacity-90'
			},
			size: {
				sm: 'h-9 px-4 text-sm',
				default: 'h-12 px-6 text-label-lg',
				lg: 'h-14 px-8 text-base',
				icon: 'h-12 w-12'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default'
		}
	});

	export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
	export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

	type CommonButtonProps = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		ref?: HTMLButtonElement | HTMLAnchorElement | null;
	};

	export type ButtonProps = CommonButtonProps &
		(
			| ({ href: string } & Omit<HTMLAnchorAttributes, 'class'>)
			| ({ href?: never } & Omit<HTMLButtonAttributes, 'class'>)
		);
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className,
		variant = 'primary',
		size = 'default',
		ref = $bindable(null),
		href,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref as HTMLAnchorElement}
		class={cn(buttonVariants({ variant, size }), className)}
		{href}
		{...restProps as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref as HTMLButtonElement}
		class={cn(buttonVariants({ variant, size }), className)}
		type={(restProps as HTMLButtonAttributes).type ?? 'button'}
		{...restProps as HTMLButtonAttributes}
	>
		{@render children?.()}
	</button>
{/if}
