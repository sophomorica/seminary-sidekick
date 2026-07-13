<script lang="ts">
	import { Crown, LoaderCircle, Users } from 'lucide-svelte';
	import type { GroupPlayPlayer, GroupPlayRoom } from '$lib/services/groupPlay';

	type Props = {
		room: GroupPlayRoom;
		players: GroupPlayPlayer[];
		selfId: string;
		connectionWarning?: boolean;
	};

	let { room, players, selfId, connectionWarning = false }: Props = $props();
</script>

<section
	class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-editorial md:p-8"
	aria-labelledby="lobby-heading"
>
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="eyebrow">Class code {room.code}</p>
			<h1 id="lobby-heading" class="font-serif text-display-sm md:text-display-md">
				Waiting for your teacher
			</h1>
		</div>
		<LoaderCircle
			class="mt-1 size-6 shrink-0 text-primary motion-safe:animate-spin"
			aria-hidden="true"
		/>
	</div>

	<p class="mt-3 text-body-lg text-on-surface-variant">
		You're in. The activity will begin here when your teacher starts it.
	</p>

	{#if connectionWarning}
		<p class="mt-5 rounded-2xl bg-error-light px-4 py-3 text-body-md text-error" role="status">
			Connection interrupted. We'll keep trying.
		</p>
	{/if}

	<div class="mt-8 rounded-3xl bg-surface-container-low p-5">
		<div class="flex items-center justify-between gap-4">
			<h2 class="flex items-center gap-2 font-sans text-title-lg">
				<Users class="size-5 text-primary" aria-hidden="true" />
				Players
			</h2>
			<span class="text-label-md text-on-surface-variant"
				>{players.length} / {room.player_cap}</span
			>
		</div>

		{#if players.length === 0}
			<p class="mt-4 text-body-md text-on-surface-variant">Loading the class roster…</p>
		{:else}
			<ul class="mt-4 grid gap-2" aria-label="Players in this class">
				{#each players as player (player.id)}
					<li
						class="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest px-4 py-3"
					>
						<span class="font-medium text-on-surface">
							{player.nickname}
							{#if player.id === selfId}
								<span class="text-body-sm text-on-surface-variant">(you)</span>
							{/if}
						</span>
						{#if player.is_host}
							<span
								class="flex items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 text-label-sm uppercase text-on-primary-container"
							>
								<Crown class="size-3.5" aria-hidden="true" />
								Host
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
