<script lang="ts">
	import copy from './promo-strip.json';

	/** Shared strip. Copy lives in promo-strip.json; this site's source is `sidekick`. */
	function hrefFor(template: string): string {
		return template.replaceAll('{source}', encodeURIComponent(copy.source));
	}
</script>

<aside
	class="w-full bg-surface-container font-sans text-on-surface"
	data-promo-strip
	aria-label="More from Narrow Road"
>
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-5">
		<p class="m-0 text-center sm:hidden">
			<a
				data-promo-short
				class="focus-ring inline-flex min-h-11 items-center text-body-sm whitespace-nowrap text-primary"
				href={hrefFor(copy.short.href)}
				rel="noopener noreferrer"
				target="_blank"
			>
				{copy.short.text}
			</a>
		</p>
		<ul class="m-0 hidden list-none flex-col gap-2.5 p-0 sm:flex">
			{#each copy.items as item (item.id)}
				<li class="text-body-md leading-normal" data-promo-item={item.id}>
					{item.body}
					<a
						class="focus-ring rounded text-body-sm text-primary hover:underline"
						href={hrefFor(item.href)}
						rel="noopener noreferrer"
						target="_blank"
					>
						→ {item.cta}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>
