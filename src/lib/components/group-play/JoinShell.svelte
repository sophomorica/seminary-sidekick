<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Logo from '$lib/components/brand/Logo.svelte';
	import GroupPlayPhaseRouter from './GroupPlayPhaseRouter.svelte';
	import JoinForm from './JoinForm.svelte';
	import KickRemoved from './KickRemoved.svelte';
	import {
		getRoomJoinInfo,
		GroupPlayError,
		isValidRoomCode,
		joinRoom,
		resumeRoom,
		watchRoom,
		type GroupPlayAnswer,
		type GroupPlayPlayer,
		type GroupPlaySubscription,
		type GroupSbFinish,
		type JoinRoomResult,
		type RoomJoinInfo,
		type RoomJoinSeat
	} from '$lib/services/groupPlay';

	type Props = {
		initialCode?: string;
	};

	let { initialCode = '' }: Props = $props();
	const LAST_ROOM_KEY = 'seminary-sidekick:group-play-room';
	let joined = $state<JoinRoomResult | null>(null);
	let joinInfo = $state<RoomJoinInfo | null>(null);
	// Codes we've already peeked and found to be classic (no roster) — avoids
	// a second get_room_join_info round-trip at submit time.
	let peekedClassicCode = '';
	let peekInFlightCode = '';
	let players = $state<GroupPlayPlayer[]>([]);
	let answers = $state<GroupPlayAnswer[]>([]);
	let sbFinishes = $state<GroupSbFinish[]>([]);
	let sbFinishesLoaded = $state(false);
	let serverOffsetMs = $state(0);
	let busy = $state(false);
	let error = $state('');
	let removed = $state(false);
	let sessionUnavailable = $state(false);
	let connectionWarning = $state(false);
	let subscription: GroupPlaySubscription | undefined;

	function rememberRoom(result: JoinRoomResult) {
		localStorage.setItem(
			LAST_ROOM_KEY,
			JSON.stringify({ code: result.room.code, playerId: result.player.id })
		);
	}

	function clearRoomMarker() {
		localStorage.removeItem(LAST_ROOM_KEY);
	}

	function startWatching(result: JoinRoomResult) {
		subscription = watchRoom(result, {
			onRoom: (snapshot) => {
				serverOffsetMs = snapshot.serverOffsetMs;
				if (!joined) return;
				joined = { ...joined, room: snapshot.room };
				connectionWarning = false;
				// Once the room has ended, the resume marker is no longer useful —
				// results render from in-memory state, so clear it right away.
				if (snapshot.room.status === 'ended') clearRoomMarker();
			},
			onPlayers: (nextPlayers) => {
				players = nextPlayers;
				connectionWarning = false;
			},
			onAnswers: (nextAnswers) => {
				answers = nextAnswers;
			},
			onSbFinishes: (nextFinishes) => {
				sbFinishes = nextFinishes;
				sbFinishesLoaded = true;
			},
			onRemoved: () => {
				removed = true;
				clearRoomMarker();
				void subscription?.stop();
			},
			onConnectionError: () => {
				connectionWarning = true;
				scheduleReconnect();
			},
			onConnectionReady: () => {
				connectionWarning = false;
				reconnectAttempts = 0;
			}
		});
	}

	function enterRoom(result: JoinRoomResult) {
		joined = result;
		players = [result.player];
		answers = [];
		sbFinishes = [];
		sbFinishesLoaded = false;
		rememberRoom(result);
		startWatching(result);
	}

	// Peek whether a room is roster-backed as soon as a complete code exists.
	// Best-effort: on failure the submit path re-peeks (and falls back to a
	// classic join attempt with a friendly SEAT_REQUIRED message).
	async function peekCode(code: string) {
		if (!isValidRoomCode(code)) return;
		if (joinInfo?.roomCode === code || peekedClassicCode === code) return;
		if (peekInFlightCode === code) return;
		peekInFlightCode = code;
		try {
			const info = await getRoomJoinInfo(code);
			if (info.hasClass) {
				joinInfo = info;
				error = '';
			} else {
				peekedClassicCode = code;
			}
		} catch (cause) {
			// Surface definite outcomes right away; ignore transient failures.
			if (
				cause instanceof GroupPlayError &&
				(cause.code === 'ROOM_NOT_FOUND' || cause.code === 'ROOM_ENDED')
			) {
				error = cause.message;
			}
		} finally {
			if (peekInFlightCode === code) peekInFlightCode = '';
		}
	}

	function handleResetJoinInfo() {
		joinInfo = null;
		error = '';
	}

	async function handleJoin(code: string, nickname: string) {
		busy = true;
		error = '';
		connectionWarning = false;

		try {
			// A roster room needs the name picker — make sure we didn't miss it
			// (e.g. the background peek failed on a flaky connection).
			if (peekedClassicCode !== code) {
				try {
					const info = await getRoomJoinInfo(code);
					if (info.hasClass) {
						joinInfo = info;
						return;
					}
					peekedClassicCode = code;
				} catch {
					// Fall through to the classic join attempt below.
				}
			}
			const result = await joinRoom(code, nickname);
			enterRoom(result);
		} catch (cause) {
			if (cause instanceof GroupPlayError) {
				error =
					cause.code === 'SEAT_REQUIRED'
						? 'This game uses a class list, but it could not be loaded. Check your connection and try again.'
						: cause.message;
			} else {
				error = 'Could not join the room. Check your connection and try again.';
			}
		} finally {
			busy = false;
		}
	}

	async function handleSeatJoin(code: string, seat: RoomJoinSeat, claimCode: string) {
		busy = true;
		error = '';
		connectionWarning = false;

		try {
			const result = await joinRoom(code, seat.displayName, {
				seatId: seat.id,
				claimCode: claimCode || undefined
			});
			enterRoom(result);
		} catch (cause) {
			error =
				cause instanceof GroupPlayError
					? cause.message
					: 'Could not join the room. Check your connection and try again.';
			// Claim conflicts mean the roster changed under us — refresh it so
			// the picker shows current claimed states.
			if (
				cause instanceof GroupPlayError &&
				(cause.code === 'SEAT_ALREADY_CLAIMED' || cause.code === 'SEAT_NOT_FOUND')
			) {
				try {
					const info = await getRoomJoinInfo(code);
					if (info.hasClass) joinInfo = info;
				} catch {
					// Keep the stale list — the error message still explains the state.
				}
			}
		} finally {
			busy = false;
		}
	}

	function reconnectAndResync() {
		if (!joined || !subscription) return;
		connectionWarning = true;
		void subscription.reconnect();
	}

	// Debounced reconnect for channel errors so we don't loop hot when the
	// realtime connection is flapping. Backs off exponentially, capped at 30s;
	// the attempt counter resets once a channel reports ready.
	let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
	let reconnectAttempts = 0;
	function scheduleReconnect() {
		if (reconnectTimer) return;
		const delay = Math.min(2500 * 2 ** reconnectAttempts, 30000);
		reconnectTimer = setTimeout(() => {
			reconnectTimer = undefined;
			reconnectAttempts += 1;
			reconnectAndResync();
		}, delay);
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'visible') reconnectAndResync();
	}

	function handleOffline() {
		if (joined) connectionWarning = true;
	}

	onMount(() => {
		let resumeCode = isValidRoomCode(initialCode) ? initialCode : '';
		const marker = localStorage.getItem(LAST_ROOM_KEY);
		let markerCode = '';
		if (marker) {
			try {
				const parsed = JSON.parse(marker) as { code?: string };
				if (parsed.code && isValidRoomCode(parsed.code)) markerCode = parsed.code;
			} catch {
				localStorage.removeItem(LAST_ROOM_KEY);
			}
		}
		if (!resumeCode) resumeCode = markerCode;
		if (!resumeCode) return;

		busy = true;
		void resumeRoom(resumeCode)
			.then((result) => {
				if (result) {
					enterRoom(result);
				} else {
					// Stale marker — the room ended or this browser is no longer
					// part of it. Clear it so we don't re-resume forever.
					clearRoomMarker();
					if (markerCode === resumeCode) {
						sessionUnavailable = true;
					} else if (isValidRoomCode(initialCode)) {
						// Fresh /join/CODE link (QR scan): peek right away so a
						// roster room greets the student with the name picker.
						void peekCode(initialCode);
					}
				}
			})
			.catch(() => {
				connectionWarning = true;
			})
			.finally(() => {
				busy = false;
			});
	});

	onDestroy(() => {
		if (reconnectTimer) clearTimeout(reconnectTimer);
		void subscription?.stop();
	});

	function handleRejoin() {
		clearRoomMarker();
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = undefined;
		}
		void subscription?.stop();
		subscription = undefined;
		joined = null;
		joinInfo = null;
		peekedClassicCode = '';
		players = [];
		answers = [];
		sbFinishes = [];
		sbFinishesLoaded = false;
		removed = false;
		sessionUnavailable = false;
		connectionWarning = false;
		error = '';
		if (isValidRoomCode(initialCode)) void peekCode(initialCode);
	}

	// Warn before leaving mid-session (joined/playing), but not once results
	// are showing, the room has ended, or the player was removed.
	const sessionActive = $derived(
		Boolean(joined) && !removed && !sessionUnavailable && joined?.room.status !== 'ended'
	);

	function handleBeforeUnload(event: BeforeUnloadEvent) {
		event.preventDefault();
		event.returnValue = '';
	}

	$effect(() => {
		if (!sessionActive) return;
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />
<svelte:window ononline={reconnectAndResync} onoffline={handleOffline} />

<svelte:head>
	<title>Join Class Play — Seminary Sidekick</title>
	<meta
		name="description"
		content="Join a live Seminary Sidekick Class Play room with your class code."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-surface">
	<header class="px-4 py-5 md:px-8">
		<div class="mx-auto flex max-w-lg items-center justify-center">
			<Logo />
		</div>
	</header>

	<div class="mx-auto max-w-lg px-4 pt-6 pb-16 md:px-8 md:pt-10">
		{#if removed || sessionUnavailable}
			<KickRemoved unavailable={sessionUnavailable} onrejoin={handleRejoin} />
		{:else if joined}
			<GroupPlayPhaseRouter
				room={joined.room}
				{players}
				{answers}
				{sbFinishes}
				{sbFinishesLoaded}
				selfId={joined.player.id}
				{serverOffsetMs}
				{connectionWarning}
			/>
		{:else}
			<header class="mb-8 text-center">
				<p class="eyebrow">Class Play</p>
				{#if joinInfo?.hasClass}
					<h1 class="font-serif text-display-lg">Pick your name</h1>
					<p class="mt-3 text-body-lg text-on-surface-variant">
						{joinInfo.className
							? `Your teacher set up “${joinInfo.className}” — find your name to join.`
							: 'Your teacher set up a class list — find your name to join.'}
					</p>
				{:else}
					<h1 class="font-serif text-display-lg">Join your class</h1>
					<p class="mt-3 text-body-lg text-on-surface-variant">
						Enter the game code from your teacher's screen. No account needed.
					</p>
				{/if}
			</header>
			<JoinForm
				{initialCode}
				{busy}
				{error}
				{joinInfo}
				oncodecomplete={(code) => void peekCode(code)}
				onjoin={handleJoin}
				onseatjoin={handleSeatJoin}
				onreset={handleResetJoinInfo}
			/>
		{/if}
	</div>
</div>
