/**
 * Class-name helper. Combines clsx (conditional classes) with twMerge
 * (Tailwind class de-duplication / conflict resolution).
 *
 * Usage:
 *   <div class={cn("p-4", isActive && "bg-primary", className)} />
 */
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

/**
 * The custom type-scale utilities defined in app.css (`--text-*` under
 * @theme). tailwind-merge can't infer these are font sizes — it buckets
 * unknown `text-*` classes as text COLORS, so e.g. `text-on-primary
 * text-label-lg` collapsed to just `text-label-lg`, silently stripping
 * button text colors. Keep this list in sync with the @theme block.
 */
const TYPE_SCALE = [
	'hero-xl',
	'hero-lg',
	'display-lg',
	'display-md',
	'display-sm',
	'headline-lg',
	'headline-md',
	'headline-sm',
	'title-lg',
	'body-lg',
	'body-md',
	'body-sm',
	'label-lg',
	'label-md',
	'label-sm'
];

const twMergeConfig = {
	extend: {
		classGroups: {
			'font-size': [{ text: TYPE_SCALE }]
		}
	}
};

const twMerge = extendTailwindMerge(twMergeConfig);

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * `tv` preconfigured with the type-scale-aware merge config above.
 * Components must import this instead of the raw `tailwind-variants`
 * export, or variant color/size classes get merged incorrectly.
 */
export const tv = createTV({ twMergeConfig });

export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
