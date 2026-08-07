<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, Clock3, LoaderCircle, Trophy, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import {
		GroupPlayError,
		submitAnswer,
		type GroupPlayAnswer,
		type GroupPlayPlayer,
		type GroupPlayRoom,
		type SubmitAnswerResult
	} from '$lib/services/groupPlay';

	type Props = {
		room: GroupPlayRoom;
		players: GroupPlayPlayer[];
		answers: GroupPlayAnswer[];
		selfId: string;
		serverOffsetMs: number;
		connectionWarning?: boolean;
	};

	let {
		room,
		players,
		answers,
		selfId,
		serverOffsetMs,
		connectionWarning = false
	}: Props = $props();
	let nowMs = $state(Date.now());
	let selectedChoice = $state<number | null>(null);
	let submitted = $state<SubmitAnswerResult | null>(null);
	let submitting = $state(false);
	let submitError = $state('');
	let answerClosed = $state(false);

	const question = $derived(room.question_set?.[room.current_question_index]);
	const questionCount = $derived(room.question_set?.length ?? 0);
	const timeoutSeconds = $derived(
		typeof room.scope.questionTimeoutSeconds === 'number'
			? room.scope.questionTimeoutSeconds
			: 20
	);
	const startedAtMs = $derived(
		room.question_started_at ? Date.parse(room.question_started_at) : Number.NaN
	);
	const remainingMs = $derived(
		Number.isFinite(startedAtMs)
			? Math.max(0, startedAtMs + timeoutSeconds * 1000 - (nowMs + serverOffsetMs))
			: 0
	);
	const remainingSeconds = $derived(Math.ceil(remainingMs / 1000));
	const timePercent = $derived(
		timeoutSeconds > 0 ? Math.min(100, (remainingMs / (timeoutSeconds * 1000)) * 100) : 0
	);
	const timedOut = $derived(Number.isFinite(startedAtMs) && remainingMs <= 0);
	const existingAnswer = $derived(
		answers.find(
			(answer) =>
				answer.player_id === selfId && answer.question_index === room.current_question_index
		)
	);
	const feedback = $derived(
		submitted ??
			(existingAnswer
				? {
						answer: existingAnswer,
						is_correct: existingAnswer.is_correct,
						points_earned: existingAnswer.points_earned,
						response_time_ms: existingAnswer.response_time_ms
					}
				: null)
	);
	const lockedChoice = $derived(selectedChoice ?? existingAnswer?.selected_choice ?? null);
	const sortedPlayers = $derived([...players].sort((a, b) => b.score - a.score));
	const me = $derived(players.find((player) => player.id === selfId));
	const myRank = $derived(sortedPlayers.findIndex((player) => player.id === selfId) + 1);
	const isLocked = $derived(submitting || feedback !== null || timedOut || answerClosed);
	const roundClosed = $derived(timedOut || answerClosed);
	// Choice colors only — outcome text banner uses `feedback` alone so host
	// advance (component remount) cannot skip the points/correctness message.
	const revealResult = $derived(roundClosed && feedback !== null);

	onMount(() => {
		const timer = window.setInterval(() => {
			nowMs = Date.now();
		}, 250);
		return () => window.clearInterval(timer);
	});

	async function handleChoice(choiceIndex: number) {
		if (isLocked || !question) return;

		selectedChoice = choiceIndex;
		submitting = true;
		submitError = '';
		try {
			submitted = await submitAnswer(room.id, room.current_question_index, choiceIndex);
		} catch (cause) {
			submitError =
				cause instanceof GroupPlayError
					? cause.message
					: 'Could not lock in your answer. Check your connection.';
			if (cause instanceof GroupPlayError && cause.code === 'ANSWER_TOO_LATE') {
				answerClosed = true;
				return;
			}
			selectedChoice = null;
		} finally {
			submitting = false;
		}
	}

	function choiceClass(choiceIndex: number): string {
		if (lockedChoice !== choiceIndex) {
			return cn(
				'bg-surface-container-lowest text-on-surface shadow-editorial',
				!isLocked && 'hover:-translate-y-0.5 hover:shadow-floating'
			);
		}
		if (!revealResult || !feedback) {
			return 'bg-primary-fixed text-on-primary-container ring-2 ring-primary';
		}
		return feedback.is_correct
			? 'bg-success-light text-on-surface ring-2 ring-success'
			: 'bg-error-light text-on-surface ring-2 ring-error';
	}
</script>

<section aria-labelledby="quiz-heading">
	{#if connectionWarning}
		<p
			class="mb-4 rounded-2xl bg-error-light px-4 py-3 text-center text-body-md text-error"
			role="status"
		>
			Reconnecting to Class Play…
		</p>
	{/if}

	<div
		class="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3"
		aria-label="Your live score"
	>
		<div class="flex items-center gap-2">
			<Trophy class="size-4 text-tertiary" aria-hidden="true" />
			<span class="text-label-md uppercase text-on-surface-variant">
				{myRank > 0 ? `#${myRank}` : '—'}
			</span>
		</div>
		<p class="text-title-lg text-on-surface">{me?.score ?? 0} points</p>
		<p class="text-body-sm text-on-surface-variant">{players.length} playing</p>
	</div>

	<div class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-editorial md:p-8">
		<div class="flex items-center justify-between gap-4">
			<p class="text-label-md uppercase text-on-surface-variant">
				Question {room.current_question_index + 1} of {questionCount}
			</p>
			<div
				class={cn(
					'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label-lg',
					remainingSeconds <= 5
						? 'bg-error-light text-error'
						: 'bg-primary-fixed text-on-primary-container'
				)}
				aria-label={`${remainingSeconds} seconds remaining`}
			>
				<Clock3 class="size-4" aria-hidden="true" />
				<span class="tabular-nums">{remainingSeconds}s</span>
			</div>
		</div>

		<div
			class="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-container-high"
			aria-hidden="true"
		>
			<div
				class={cn(
					'h-full rounded-full transition-[width] duration-150',
					remainingSeconds <= 5 ? 'bg-error' : 'bg-primary'
				)}
				style:width={`${timePercent}%`}
			></div>
		</div>

		{#if !question}
			<div class="py-12 text-center">
				<LoaderCircle
					class="mx-auto size-7 text-primary motion-safe:animate-spin"
					aria-hidden="true"
				/>
				<p class="mt-4 text-body-lg text-on-surface-variant">Syncing the question…</p>
			</div>
		{:else}
			<h1 id="quiz-heading" class="mt-8 font-serif text-headline-lg leading-relaxed">
				{question.prompt}
			</h1>

			<ul class="mt-7 grid gap-3" aria-label="Answer choices">
				{#each question.options as option, choiceIndex (`${room.current_question_index}-${choiceIndex}`)}
					<li>
						<button
							type="button"
							class={cn(
								'focus-ring flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-title-lg transition-all duration-150 ease-out-soft',
								choiceClass(choiceIndex),
								isLocked && lockedChoice !== choiceIndex && 'opacity-60'
							)}
							disabled={isLocked}
							onclick={() => handleChoice(choiceIndex)}
						>
							<span>{option}</span>
							{#if lockedChoice === choiceIndex}
								<span
									class={cn(
										'flex size-8 shrink-0 items-center justify-center rounded-full',
										revealResult &&
											feedback?.is_correct &&
											'bg-success text-on-primary',
										revealResult &&
											feedback &&
											!feedback.is_correct &&
											'bg-error text-on-primary',
										!revealResult && 'bg-primary text-on-primary'
									)}
									aria-hidden="true"
								>
									{#if submitting}
										<LoaderCircle class="size-4 motion-safe:animate-spin" />
									{:else if revealResult && feedback?.is_correct}
										<Check class="size-5" />
									{:else if revealResult && feedback}
										<X class="size-5" />
									{/if}
								</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>

			<div class="mt-6 min-h-16" aria-live="polite">
				{#if feedback}
					<div
						class={cn(
							'flex items-center gap-3 rounded-2xl px-4 py-3 text-title-lg',
							feedback.is_correct
								? 'bg-success-light text-success'
								: 'bg-error-light text-error'
						)}
					>
						{#if feedback.is_correct}
							<Check class="size-5 shrink-0" aria-hidden="true" />
							<span>Correct — +{feedback.points_earned} points</span>
						{:else}
							<X class="size-5 shrink-0" aria-hidden="true" />
							<span>No points this round</span>
						{/if}
					</div>
					<p class="mt-3 text-center text-body-md text-on-surface-variant">
						Locked in. Waiting for your teacher…
					</p>
				{:else if roundClosed}
					<p
						class="rounded-2xl bg-surface-container-low px-4 py-3 text-center text-body-md"
					>
						Time is up. Waiting for your teacher…
					</p>
				{:else if submitError}
					<p class="rounded-2xl bg-error-light px-4 py-3 text-body-md text-error">
						{submitError}
					</p>
				{:else}
					<p class="text-center text-body-md text-on-surface-variant">
						Choose the answer you think is correct.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</section>
