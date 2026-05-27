/**
 * Class-name helper. Combines clsx (conditional classes) with twMerge
 * (Tailwind class de-duplication / conflict resolution).
 *
 * Usage:
 *   <div class={cn("p-4", isActive && "bg-primary", className)} />
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
