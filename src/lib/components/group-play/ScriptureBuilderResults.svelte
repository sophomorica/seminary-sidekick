<script lang="ts">
	import { AlertTriangle, Crown, LoaderCircle, Medal, Trophy } from 'lucide-svelte';
	import type { GroupPlayPlayer, GroupPlayRoom, GroupSbFinish } from '$lib/services/groupPlay';
	import { parseScriptureBuilderSetup, rankScriptureBuilderPlayers } from './scriptureBuilder';

	type Props = {
		room: GroupPlayRoom;
		players: GroupPlayPlayer[];
		finishes: GroupSbFinish[];
		finishesLoaded: boolean;
		selfId: string;
	};

	let { room, players, finishes, finishesLoaded, selfId }: Props = $props();
	const setup = $derived(parseScriptureBuilderSetup(room.scope));
	const leaderboard = $derived(
		setup.config ? rankScriptureBuilderPlayers(players, setup.config, finishes) : []
	);
	const topThree = $derived(leaderboard.slice(0, 3));

	function podiumClass(index: number): string {
		if (index === 0) return 'order-2 min-h-44 bg-tertiary-fixed text-on-tertiary-container';
		if (index === 1)
			return 'order-1 min-h-36 bg-secondary-container text-on-secondary-container';
		return 'order-3 min-h-32 bg-surface-container-high text-on-surface';
	}
</script>

<section
	class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-floating md:p-8"
	aria-labelledby="sb-results-heading"
>
	<header class="text-center">
		<Trophy class="mx-auto size-10 text-tertiary" aria-hidden="true" />
		<p class="eyebrow mt-5">Final standings</p>
		<h1 id="sb-results-heading" class="font-serif text-display-md">Scripture race complete</h1>
	</header>

	{#if setup.error}
		<div class="mt-8 rounded-2xl bg-error-light p-5 text-center text-error">
			<AlertTriangle class="mx-auto size-7" aria-hidden="true" />
			<p class="mt-3 text-body-md">{setup.error}</p>
		</div>
	{:else if !finishesLoaded}
		<div class="py-12 text-center">
			<LoaderCircle
				class="mx-auto size-7 text-primary motion-safe:animate-spin"
				aria-hidden="true"
			/>
			<p class="mt-3 text-body-md text-on-surface-variant">Calculating race results…</p>
		</div>
	{:else if leaderboard.length === 0}
		<p class="mt-8 rounded-2xl bg-surface-container-low p-5 text-center text-body-lg">
			No racers joined this game.
		</p>
	{:else}
		{#if topThree.length > 0}
			<ol class="mt-8 grid grid-cols-3 items-end gap-2" aria-label="Top three racers">
				{#each topThree as row, index (row.player.id)}
					<li class={`rounded-3xl px-2 py-5 text-center ${podiumClass(index)}`}>
						{#if index === 0}
							<Crown class="mx-auto size-6" aria-hidden="true" />
						{:else}
							<Medal class="mx-auto size-5" aria-hidden="true" />
						{/if}
						<p class="mt-2 text-label-md uppercase">{index + 1}</p>
						<p class="mt-2 truncate text-title-lg" title={row.player.nickname}>
							{row.player.nickname}
						</p>
						<p class="mt-1 text-body-sm">{row.score}</p>
					</li>
				{/each}
			</ol>
		{/if}

		<ol class="mt-8 grid gap-2" aria-label="Full race results">
			{#each leaderboard as row, index (row.player.id)}
				<li
					class="flex min-h-14 items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3"
				>
					<span
						class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-label-lg text-primary"
					>
						{index + 1}
					</span>
					<span class="min-w-0 flex-1">
						<span class="block truncate font-medium text-on-surface">
							{row.player.nickname}
							{#if row.player.id === selfId}
								<span class="text-body-sm text-on-surface-variant">(you)</span>
							{/if}
						</span>
						<span class="block truncate text-body-sm text-on-surface-variant"
							>{row.detail}</span
						>
					</span>
					<span class="shrink-0 text-label-lg text-on-surface">{row.score}</span>
				</li>
			{/each}
		</ol>
	{/if}
</section>
