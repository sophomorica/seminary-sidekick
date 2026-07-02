<script lang="ts" module>
	import { type VariantProps } from 'tailwind-variants';
	import { tv } from '$lib/utils.js';

	export const toggleVariants = tv({
		base: "text-on-surface-variant hover:text-on-surface aria-pressed:bg-primary aria-pressed:text-on-primary data-[state=on]:bg-primary data-[state=on]:text-on-primary focus-visible:ring-primary aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error gap-1 rounded-full text-label-lg transition-colors ease-out-soft [&_svg:not([class*='size-'])]:size-4 group/toggle hover:bg-surface-container-low inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: 'bg-transparent',
				outline:
					'border border-outline-variant/40 bg-transparent hover:bg-surface-container-low'
			},
			size: {
				default:
					'h-10 min-w-10 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
				sm: "h-8 min-w-8 px-3 text-label-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
				lg: 'h-12 min-w-12 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ToggleVariant = VariantProps<typeof toggleVariants>['variant'];
	export type ToggleSize = VariantProps<typeof toggleVariants>['size'];
	export type ToggleVariants = VariantProps<typeof toggleVariants>;
</script>

<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = 'default',
		variant = 'default',
		...restProps
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root
	bind:ref
	bind:pressed
	data-slot="toggle"
	class={cn(toggleVariants({ variant, size }), className)}
	{...restProps}
/>
