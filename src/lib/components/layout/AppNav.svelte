<script lang="ts">
	import { MAIN_NAV } from '$lib/config/nav';
	import Logo from '$lib/components/brand/Logo.svelte';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { Menu, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			closeMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header
	class="sticky top-0 z-40 border-b border-outline-variant/0 bg-surface/85 backdrop-blur-md backdrop-saturate-150"
>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
		<!-- Brand -->
		<Logo />

		<!-- Desktop nav -->
		<nav aria-label="Primary" class="hidden md:block">
			<ul class="flex items-center gap-2">
				{#each MAIN_NAV.filter((l) => l.visible !== false) as link (link.href)}
					<li>
						<a
							href={link.href}
							class={cn(
								'focus-ring rounded-full px-4 py-2 text-label-lg text-on-surface',
								'transition-colors hover:bg-surface-container-low hover:text-primary'
							)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Desktop CTAs + mobile menu trigger -->
		<div class="flex items-center gap-2">
			<div class="hidden md:block">
				<StoreButtons size="sm" showComingSoon={false} />
			</div>

			<button
				type="button"
				class="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low md:hidden"
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={isOpen}
				aria-controls="mobile-menu"
				onclick={toggleMenu}
			>
				{#if isOpen}
					<X aria-hidden="true" />
				{:else}
					<Menu aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu panel -->
	{#if isOpen}
		<div
			id="mobile-menu"
			class="border-t border-outline-variant/20 bg-surface-container-lowest px-4 pb-6 pt-2 md:hidden"
		>
			<nav aria-label="Mobile primary">
				<ul class="flex flex-col">
					{#each MAIN_NAV.filter((l) => l.visible !== false) as link (link.href)}
						<li>
							<a
								href={link.href}
								onclick={closeMenu}
								class="focus-ring block rounded-2xl px-4 py-3 text-headline-sm text-on-surface hover:bg-surface-container-low"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="mt-4">
				<StoreButtons size="default" />
			</div>
		</div>
	{/if}
</header>
