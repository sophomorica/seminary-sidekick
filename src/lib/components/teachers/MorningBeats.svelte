<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Grabber, MorningBeat } from '$lib/teachers/mixer';

	let {
		grabber,
		teach,
		wrap,
		invite
	}: {
		grabber: Grabber;
		teach: MorningBeat;
		wrap: MorningBeat;
		invite: MorningBeat;
	} = $props();

	const beats: { label: string; beat: MorningBeat }[] = $derived([
		{
			label: 'Grabber',
			beat: {
				ready: true,
				title: grabber.title,
				body: `${grabber.time}. ${grabber.summary}`,
				href: grabber.href,
				actionLabel: grabber.actionLabel
			}
		},
		{ label: 'Teach', beat: teach },
		{ label: 'Wrap', beat: wrap },
		{ label: 'Invite', beat: invite }
	]);
</script>

<ol class="grid gap-6 md:grid-cols-2" aria-label="Four beats. One morning.">
	{#each beats as item, index (item.label)}
		<li class="card flex flex-col">
			<p class="text-label-md font-semibold tracking-[1px] text-primary uppercase">
				{index + 1} · {item.label}
			</p>
			<h3 class="mt-2 font-serif text-headline-md">{item.beat.title}</h3>
			{#if !item.beat.ready}
				<p
					class="mt-3 inline-flex w-fit rounded-full bg-surface-container px-3 py-1 text-body-sm text-on-surface-variant"
				>
					Teach is not ready as a factory
				</p>
			{/if}
			<p class="mt-3 text-body-md text-on-surface-variant">{item.beat.body}</p>
			{#if item.beat.href && item.beat.actionLabel}
				<div class="mt-5">
					<Button href={item.beat.href} variant={index === 0 ? 'primary' : 'outlined'}>
						{item.beat.actionLabel}
					</Button>
				</div>
			{/if}
		</li>
	{/each}
</ol>
