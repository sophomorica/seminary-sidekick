<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Grabber, GrabberIcon } from '$lib/teachers/mixer';
	import { Icon, Printer, IdCard, Compass, Users, Armchair, Layers } from 'lucide-svelte';

	let { grabber }: { grabber: Grabber } = $props();

	const icons: Record<GrabberIcon, typeof Icon> = {
		printer: Printer,
		tent: IdCard,
		compass: Compass,
		users: Users,
		chair: Armchair,
		beats: Layers
	};

	const IconCmp = $derived(icons[grabber.icon]);
</script>

<article class="card card-hover flex h-full flex-col" aria-labelledby={`grabber-${grabber.slug}`}>
	<div class="flex items-start gap-4">
		<span
			class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary"
			aria-hidden="true"
		>
			<IconCmp class="h-6 w-6" stroke-width={1.5} />
		</span>
		<div class="min-w-0">
			<p class="text-label-md font-semibold tracking-[1px] text-primary uppercase">
				{grabber.kicker}
			</p>
			<h2 id={`grabber-${grabber.slug}`} class="mt-1 font-serif text-headline-lg">
				{grabber.title}
			</h2>
		</div>
	</div>

	<p class="mt-4 text-body-md text-on-surface-variant">{grabber.summary}</p>

	<dl class="mt-5 grid gap-3 text-body-sm sm:grid-cols-2">
		<div>
			<dt class="font-semibold text-on-surface">Time</dt>
			<dd class="text-on-surface-variant">{grabber.time}</dd>
		</div>
		<div>
			<dt class="font-semibold text-on-surface">Materials</dt>
			<dd class="text-on-surface-variant">{grabber.materials}</dd>
		</div>
	</dl>

	<div class="mt-6 flex flex-wrap gap-3">
		<Button href={grabber.href} variant="primary">
			{grabber.actionLabel}
		</Button>
		{#if grabber.printHref && grabber.printLabel}
			<Button href={grabber.printHref} variant="outlined">
				<Printer aria-hidden="true" />
				{grabber.printLabel}
			</Button>
		{/if}
	</div>
</article>
