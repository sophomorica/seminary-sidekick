<script lang="ts">
	import type {
		GroupPlayAnswer,
		GroupPlayPlayer,
		GroupPlayRoom,
		GroupSbFinish
	} from '$lib/services/groupPlay';
	import QuizPlayer from './QuizPlayer.svelte';
	import QuizResults from './QuizResults.svelte';
	import ScriptureBuilderPlayer from './ScriptureBuilderPlayer.svelte';
	import ScriptureBuilderResults from './ScriptureBuilderResults.svelte';
	import WaitingLobby from './WaitingLobby.svelte';

	type Props = {
		room: GroupPlayRoom;
		players: GroupPlayPlayer[];
		answers: GroupPlayAnswer[];
		sbFinishes: GroupSbFinish[];
		sbFinishesLoaded: boolean;
		selfId: string;
		serverOffsetMs: number;
		connectionWarning?: boolean;
	};

	let {
		room,
		players,
		answers,
		sbFinishes,
		sbFinishesLoaded,
		selfId,
		serverOffsetMs,
		connectionWarning = false
	}: Props = $props();
	const mode = $derived(room.scope.mode ?? 'quiz');
</script>

{#if room.status === 'lobby'}
	<WaitingLobby {room} {players} {selfId} {connectionWarning} />
{:else if room.status === 'active'}
	{#if mode === 'quiz'}
		{#key `${room.current_question_index}-${room.question_started_at}`}
			<QuizPlayer {room} {players} {answers} {selfId} {serverOffsetMs} {connectionWarning} />
		{/key}
	{:else}
		<ScriptureBuilderPlayer
			{room}
			{players}
			finishes={sbFinishes}
			finishesLoaded={sbFinishesLoaded}
			{selfId}
			{connectionWarning}
		/>
	{/if}
{:else if mode === 'quiz'}
	<QuizResults {players} {selfId} />
{:else}
	<ScriptureBuilderResults
		{room}
		{players}
		finishes={sbFinishes}
		finishesLoaded={sbFinishesLoaded}
		{selfId}
	/>
{/if}
