<script lang="ts">
	import { Crown, Medal, Trophy } from 'lucide-svelte';
	import type { GroupPlayPlayer } from '$lib/services/groupPlay';

	type Props = {
		players: GroupPlayPlayer[];
		selfId: string;
	};

	let { players, selfId }: Props = $props();
	const leaderboard = $derived([...players].sort((a, b) => b.score - a.score));
	const topThree = $derived(leaderboard.slice(0, 3));

	function podiumClass(index: number): string {
		if (index === 0) return 'bg-tertiary-fixed text-on-tertiary-container';
		if (index === 1) return 'bg-secondary-container text-on-secondary-container';
		return 'bg-surface-container-high text-on-surface';
	}
</script>

<section
	class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-floating md:p-8"
	aria-labelledby="results-heading"
>
	<header class="text-center">
		<Trophy class="mx-auto size-10 text-tertiary" aria-hidden="true" />
		<p class="eyebrow mt-5">Final standings</p>
		<h1 id="results-heading" class="font-serif text-display-md">Class Play complete</h1>
	</header>

	{#if topThree.length > 0}
		<ol class="mt-8 grid grid-cols-3 items-end gap-2" aria-label="Top three players">
			{#each topThree as player, index (player.id)}
				<li
					class={`rounded-3xl px-2 py-5 text-center ${podiumClass(index)} ${
						index === 0
							? 'order-2 min-h-44'
							: index === 1
								? 'order-1 min-h-36'
								: 'order-3 min-h-32'
					}`}
				>
					{#if index === 0}
						<Crown class="mx-auto size-6" aria-hidden="true" />
					{:else}
						<Medal class="mx-auto size-5" aria-hidden="true" />
					{/if}
					<p class="mt-2 text-label-md uppercase">{index + 1}</p>
					<p class="mt-2 truncate text-title-lg" title={player.nickname}>
						{player.nickname}
					</p>
					<p class="mt-1 text-body-sm">{player.score} pts</p>
				</li>
			{/each}
		</ol>
	{/if}

	<ol class="mt-8 grid gap-2" aria-label="Full results">
		{#each leaderboard as player, index (player.id)}
			<li
				class="flex min-h-12 items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3"
			>
				<span
					class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-label-lg text-primary"
				>
					{index + 1}
				</span>
				<span class="min-w-0 flex-1 truncate font-medium text-on-surface">
					{player.nickname}
					{#if player.id === selfId}
						<span class="text-body-sm text-on-surface-variant">(you)</span>
					{/if}
				</span>
				<span class="text-label-lg text-on-surface">{player.score} pts</span>
			</li>
		{/each}
	</ol>
</section>
