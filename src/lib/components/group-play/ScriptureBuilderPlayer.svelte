<script lang="ts">
	import { onDestroy } from 'svelte';
	import { AlertTriangle, CheckCircle2, LoaderCircle, RefreshCw, Users } from 'lucide-svelte';
	import {
		GroupPlayError,
		submitSbFinish,
		type GroupPlayPlayer,
		type GroupPlayRoom,
		type GroupSbFinish
	} from '$lib/services/groupPlay';
	import SbRaceBoard from './SbRaceBoard.svelte';
	import SbRaceTypingBoard from './SbRaceTypingBoard.svelte';
	import {
		DNF_MISTAKE_COUNT,
		formatSeconds,
		isTypingDifficulty,
		parseScriptureBuilderSetup
	} from './scriptureBuilder';

	type Props = {
		room: GroupPlayRoom;
		players: GroupPlayPlayer[];
		finishes: GroupSbFinish[];
		finishesLoaded: boolean;
		selfId: string;
		connectionWarning?: boolean;
	};

	let {
		room,
		players,
		finishes,
		finishesLoaded,
		selfId,
		connectionWarning = false
	}: Props = $props();
	let localFinishes = $state<GroupSbFinish[]>([]);
	let submitting = $state(false);
	let submitError = $state('');
	let pendingFinish = $state<{ elapsedMs: number; mistakeCount: number } | null>(null);
	let heldIndex = $state<number | null>(null);
	let advanceTimer: number | undefined;

	const setup = $derived(parseScriptureBuilderSetup(room.scope));
	const allFinishes = $derived(
		[...finishes, ...localFinishes].filter(
			(finish, index, merged) =>
				merged.findIndex((candidate) => candidate.id === finish.id) === index
		)
	);
	const myFinishes = $derived(allFinishes.filter((finish) => finish.player_id === selfId));
	const scriptureIndex = $derived.by(() => {
		if (!setup.config) return 0;
		const lastIndex = Math.max(0, setup.config.scriptureIds.length - 1);
		if (setup.config.playMode === 'roundByRound') {
			return Math.min(lastIndex, Math.max(0, room.current_question_index));
		}
		return heldIndex ?? Math.min(lastIndex, myFinishes.length);
	});
	const scripture = $derived(setup.scriptures[scriptureIndex]);
	const currentFinish = $derived(
		myFinishes.find((finish) => finish.scripture_index === scriptureIndex)
	);
	const distractorPool = $derived(
		setup.scriptures.filter((candidate) => candidate.id !== scripture?.id)
	);
	const racerCount = $derived(players.filter((player) => !player.is_host).length);
	const finishedThisRound = $derived(
		new Set(
			allFinishes
				.filter((finish) => finish.scripture_index === scriptureIndex)
				.map((finish) => finish.player_id)
		).size
	);
	const isSetDone = $derived(
		setup.config?.playMode === 'setOfN' &&
			myFinishes.length >= (setup.config?.scriptureIds.length ?? 0)
	);
	const isSingleScripture = $derived((setup.config?.scriptureIds.length ?? 0) === 1);
	const rankInRound = $derived.by(() => {
		if (!currentFinish || setup.config?.playMode !== 'roundByRound') return null;
		const round = allFinishes
			.filter((finish) => finish.scripture_index === scriptureIndex)
			.toSorted((a, b) => Date.parse(a.completed_at) - Date.parse(b.completed_at));
		const index = round.findIndex((finish) => finish.id === currentFinish.id);
		return index >= 0 ? index + 1 : null;
	});

	onDestroy(() => {
		if (advanceTimer) window.clearTimeout(advanceTimer);
	});

	async function recordFinish(elapsedMs: number, mistakeCount: number) {
		if (submitting || currentFinish) return;
		pendingFinish = { elapsedMs, mistakeCount };
		submitting = true;
		submitError = '';
		if (setup.config?.playMode === 'setOfN') heldIndex = scriptureIndex;

		try {
			const finish = await submitSbFinish(
				room.id,
				selfId,
				scriptureIndex,
				elapsedMs,
				mistakeCount
			);
			localFinishes = [...localFinishes, finish];
			pendingFinish = null;

			if (setup.config?.playMode === 'setOfN') {
				advanceTimer = window.setTimeout(() => {
					heldIndex = null;
				}, 900);
			}
		} catch (cause) {
			submitError =
				cause instanceof GroupPlayError
					? cause.message
					: 'Could not save your finish. Check your connection and retry.';
		} finally {
			submitting = false;
		}
	}
</script>

<section aria-labelledby="sb-heading">
	{#if connectionWarning}
		<p
			class="mb-4 rounded-2xl bg-error-light px-4 py-3 text-center text-body-md text-error"
			role="status"
		>
			Reconnecting to Class Play…
		</p>
	{/if}

	{#if setup.error}
		<div class="rounded-[2rem] bg-surface-container-lowest p-8 text-center shadow-editorial">
			<AlertTriangle class="mx-auto size-9 text-error" aria-hidden="true" />
			<h1 id="sb-heading" class="mt-5 font-serif text-headline-md">Race unavailable</h1>
			<p class="mt-3 text-body-lg text-on-surface-variant">{setup.error}</p>
		</div>
	{:else if !finishesLoaded}
		<div class="rounded-[2rem] bg-surface-container-lowest p-8 text-center shadow-editorial">
			<LoaderCircle
				class="mx-auto size-8 text-primary motion-safe:animate-spin"
				aria-hidden="true"
			/>
			<h1 id="sb-heading" class="mt-5 font-serif text-headline-md">Syncing your race…</h1>
			<p class="mt-3 text-body-md text-on-surface-variant">
				Checking for scriptures you already finished.
			</p>
		</div>
	{:else if setup.config && scripture}
		<div
			class="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3"
		>
			<div class="flex items-center gap-2 text-primary">
				<Users class="size-4" aria-hidden="true" />
				<span class="text-label-md uppercase">
					{setup.config.playMode === 'roundByRound' || isSingleScripture
						? `${finishedThisRound} finished`
						: `Scripture ${scriptureIndex + 1} of ${setup.config.scriptureIds.length}`}
				</span>
			</div>
			<p class="text-body-sm text-on-surface-variant">
				{racerCount}
				{racerCount === 1 ? 'racer' : 'racers'}
			</p>
		</div>

		<div class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-editorial md:p-8">
			<header>
				<p class="eyebrow">
					{setup.config.playMode === 'roundByRound'
						? `Round ${scriptureIndex + 1} of ${setup.config.scriptureIds.length}`
						: 'Scripture Builder race'}
				</p>
				<h1 id="sb-heading" class="mt-2 font-serif text-headline-lg">
					{scripture.reference}
				</h1>
				<p class="mt-2 text-body-md text-on-surface-variant">{scripture.keyPhrase}</p>
			</header>

			{#if currentFinish}
				<div class="py-10 text-center">
					<CheckCircle2
						class={`mx-auto size-11 ${
							currentFinish.mistake_count === DNF_MISTAKE_COUNT
								? 'text-error'
								: 'text-success'
						}`}
						aria-hidden="true"
					/>
					<h2 class="mt-5 font-serif text-headline-md">
						{currentFinish.mistake_count === DNF_MISTAKE_COUNT
							? 'Out of time'
							: isSetDone && !isSingleScripture
								? 'Set complete!'
								: 'You finished!'}
					</h2>
					<p class="mt-3 text-title-lg text-on-surface">
						{formatSeconds(currentFinish.elapsed_ms)}
						{#if currentFinish.mistake_count !== DNF_MISTAKE_COUNT}
							· {currentFinish.mistake_count}
							{currentFinish.mistake_count === 1 ? 'mistake' : 'mistakes'}
						{/if}
						{#if rankInRound}
							· #{rankInRound} this round
						{/if}
					</p>
					<p class="mt-4 text-body-md text-on-surface-variant">
						{setup.config.playMode === 'roundByRound'
							? 'Waiting for the host to advance…'
							: isSetDone
								? 'Waiting for the host to end the game.'
								: 'Loading the next scripture…'}
					</p>
				</div>
			{:else}
				{#key `${scripture.id}-${scriptureIndex}`}
					{#if isTypingDifficulty(setup.config.chunkDifficulty)}
						<SbRaceTypingBoard
							{scripture}
							difficulty={setup.config.chunkDifficulty}
							timeoutSeconds={setup.config.perScriptureTimeoutSeconds}
							onfinish={recordFinish}
						/>
					{:else}
						<SbRaceBoard
							{scripture}
							difficulty={setup.config.chunkDifficulty}
							{distractorPool}
							timeoutSeconds={setup.config.perScriptureTimeoutSeconds}
							onfinish={recordFinish}
						/>
					{/if}
				{/key}

				<div class="mt-6 min-h-12" aria-live="polite">
					{#if submitting}
						<p
							class="flex items-center justify-center gap-2 text-body-md text-on-surface-variant"
						>
							<LoaderCircle
								class="size-4 motion-safe:animate-spin"
								aria-hidden="true"
							/>
							Saving your finish…
						</p>
					{:else if submitError && pendingFinish}
						<div class="rounded-2xl bg-error-light p-4 text-error">
							<p class="text-body-md">{submitError}</p>
							<button
								type="button"
								class="focus-ring mt-3 inline-flex items-center gap-2 rounded-full bg-error px-4 py-2 text-label-lg text-on-primary"
								onclick={() =>
									recordFinish(
										pendingFinish!.elapsedMs,
										pendingFinish!.mistakeCount
									)}
							>
								<RefreshCw class="size-4" aria-hidden="true" />
								Retry saving
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</section>
