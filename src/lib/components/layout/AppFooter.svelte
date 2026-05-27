<script lang="ts">
	import { FOOTER_NAV } from '$lib/config/nav';
	import { SITE_NAME, COPYRIGHT_YEAR, SOCIAL_LINKS } from '$lib/config/site';
	import Logo from '$lib/components/brand/Logo.svelte';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { Twitter, Instagram, Facebook, Youtube } from 'lucide-svelte';
</script>

<footer class="bg-surface-container-low" aria-label="Site footer">
	<div class="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
		<!-- Top: brand + tagline + store CTAs -->
		<div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
			<div>
				<Logo size="lg" class="mb-3" />
				<p class="max-w-md text-body-lg text-on-surface-variant">
					Master the 100 doctrinal mastery scriptures. A focused, fun, reverent way to
					study, build, prove, and master.
				</p>
			</div>
			<div class="flex flex-col items-start gap-4 md:items-end md:justify-end">
				<StoreButtons />
			</div>
		</div>

		<!-- Middle: link columns -->
		<nav aria-label="Footer" class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
			{#each FOOTER_NAV as group (group.heading)}
				<div>
					<h2 class="mb-3 text-label-md uppercase text-on-surface-variant">
						{group.heading}
					</h2>
					<ul class="flex flex-col gap-2">
						{#each group.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="focus-ring rounded text-body-md text-on-surface transition-colors hover:text-primary"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>

		<!-- Bottom: socials + copyright -->
		<div
			class="flex flex-col items-start justify-between gap-4 border-t border-outline-variant/30 pt-8 md:flex-row md:items-center"
		>
			<p class="text-body-sm text-on-surface-variant">
				© {COPYRIGHT_YEAR}
				{SITE_NAME}. Built for seminary students everywhere.
			</p>
			<div class="flex items-center gap-4">
				{#if SOCIAL_LINKS.twitter}
					<a
						href={SOCIAL_LINKS.twitter}
						target="_blank"
						rel="noopener noreferrer"
						class="focus-ring rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
						aria-label="Twitter"
					>
						<Twitter aria-hidden="true" />
					</a>
				{/if}
				{#if SOCIAL_LINKS.instagram}
					<a
						href={SOCIAL_LINKS.instagram}
						target="_blank"
						rel="noopener noreferrer"
						class="focus-ring rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
						aria-label="Instagram"
					>
						<Instagram aria-hidden="true" />
					</a>
				{/if}
				{#if SOCIAL_LINKS.facebook}
					<a
						href={SOCIAL_LINKS.facebook}
						target="_blank"
						rel="noopener noreferrer"
						class="focus-ring rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
						aria-label="Facebook"
					>
						<Facebook aria-hidden="true" />
					</a>
				{/if}
				{#if SOCIAL_LINKS.youtube}
					<a
						href={SOCIAL_LINKS.youtube}
						target="_blank"
						rel="noopener noreferrer"
						class="focus-ring rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
						aria-label="YouTube"
					>
						<Youtube aria-hidden="true" />
					</a>
				{/if}
			</div>
		</div>
	</div>
</footer>
