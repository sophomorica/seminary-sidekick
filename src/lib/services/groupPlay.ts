import {
	createClient,
	type PostgrestError,
	type RealtimeChannel,
	type SupabaseClient
} from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$lib/config/supabase';

export const ROOM_CODE_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXYZ23456789';
export const ROOM_CODE_LENGTH = 4;

export type GroupPlayStatus = 'lobby' | 'active' | 'ended';
export type GroupPlayMode = 'quiz' | 'scriptureBuilder';
export type GroupSbChunkDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type GroupSbPlayMode = 'roundByRound' | 'setOfN';

export type GroupSbConfig = {
	chunkDifficulty: GroupSbChunkDifficulty;
	playMode: GroupSbPlayMode;
	scriptureIds: string[];
	perScriptureTimeoutSeconds?: number;
};

export type GroupPlayQuestion = {
	index: number;
	scriptureId: string;
	scriptureReference: string;
	typeName: string;
	prompt: string;
	options: string[];
};

export type GroupPlayRoom = {
	id: string;
	code: string;
	host_id: string;
	status: GroupPlayStatus;
	scope: {
		mode?: GroupPlayMode;
		questionTimeoutSeconds?: number;
		scriptureBuilderConfig?: GroupSbConfig;
		[key: string]: unknown;
	};
	question_set: GroupPlayQuestion[] | null;
	current_question_index: number;
	question_started_at: string | null;
	player_cap: number;
	created_at: string;
	started_at: string | null;
	ended_at: string | null;
};

export type GroupPlayPlayer = {
	id: string;
	room_id: string;
	user_id: string;
	nickname: string;
	score: number;
	is_host: boolean;
	joined_at: string;
	last_seen_at: string;
};

export type GroupPlayAnswer = {
	id: string;
	room_id: string;
	player_id: string;
	question_index: number;
	selected_choice: number;
	is_correct: boolean;
	response_time_ms: number;
	points_earned: number;
	submitted_at: string;
};

export type GroupSbFinish = {
	id: string;
	room_id: string;
	player_id: string;
	scripture_index: number;
	elapsed_ms: number;
	mistake_count: number;
	completed_at: string;
};

export type JoinRoomResult = {
	room: GroupPlayRoom;
	player: GroupPlayPlayer;
};

export type SubmitAnswerResult = {
	answer: GroupPlayAnswer;
	is_correct: boolean;
	points_earned: number;
	response_time_ms: number;
};

export type TimedRoomSnapshot = {
	room: GroupPlayRoom;
	serverOffsetMs: number;
};

export type GroupPlayBroadcast = {
	event: 'question_advanced' | 'room_ended';
	payload: Record<string, unknown>;
};

export type GroupPlayWatchers = {
	onRoom?: (snapshot: TimedRoomSnapshot) => void;
	onPlayers?: (players: GroupPlayPlayer[]) => void;
	onAnswers?: (answers: GroupPlayAnswer[]) => void;
	onSbFinishes?: (finishes: GroupSbFinish[]) => void;
	onBroadcast?: (message: GroupPlayBroadcast) => void;
	onRemoved?: () => void;
	onConnectionError?: () => void;
	onConnectionReady?: () => void;
};

export type GroupPlaySubscription = {
	resync: () => Promise<void>;
	reconnect: () => Promise<void>;
	stop: () => Promise<void>;
};

const ERROR_MESSAGES: Readonly<Record<string, string>> = {
	NOT_AUTHENTICATED: 'Could not start a secure guest session. Please try again.',
	INVALID_NICKNAME: 'Nicknames must be between 2 and 14 characters.',
	ROOM_NOT_FOUND: 'Room not found. Double-check the code.',
	ROOM_ENDED: 'This room has ended.',
	ROOM_ALREADY_STARTED: 'This room already started without you.',
	ROOM_NOT_LOBBY: 'This room is not accepting players right now.',
	BANNED_FROM_ROOM: 'You cannot rejoin this room.',
	ROOM_FULL: 'This room is full.',
	NICKNAME_TAKEN: 'That nickname is already taken in this room.',
	DUPLICATE_ANSWER: 'Your answer is already locked in.',
	ANSWER_TOO_LATE: 'Time is up for this question.',
	WRONG_QUESTION: 'Your teacher has moved to the next question.',
	QUESTION_NOT_STARTED: 'This question has not started yet.',
	INVALID_QUESTION: 'This question is no longer available.',
	NOT_IN_ROOM: 'You are no longer in this room.',
	ROOM_NOT_ACTIVE: 'This room is not playing a quiz right now.'
};

export class GroupPlayError extends Error {
	constructor(
		message: string,
		readonly code = 'UNKNOWN'
	) {
		super(message);
		this.name = 'GroupPlayError';
	}
}

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		throw new GroupPlayError(
			'Class Play is not configured yet. Add the public Supabase environment variables.',
			'NOT_CONFIGURED'
		);
	}
	client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	return client;
}

export function normalizeRoomCode(value: string): string {
	return value
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, ROOM_CODE_LENGTH);
}

export function isValidRoomCode(value: string): boolean {
	const code = normalizeRoomCode(value);
	return (
		code.length === ROOM_CODE_LENGTH &&
		[...code].every((character) => ROOM_CODE_ALPHABET.includes(character))
	);
}

function mapError(error: unknown): GroupPlayError {
	if (error instanceof GroupPlayError) return error;

	const candidate = error as Partial<PostgrestError> | undefined;
	const detail = [candidate?.message, candidate?.details, candidate?.hint]
		.filter(Boolean)
		.join(' ');
	const code = Object.keys(ERROR_MESSAGES).find((key) => detail.includes(key));

	if (code) return new GroupPlayError(ERROR_MESSAGES[code], code);
	if (candidate?.code === '23505') {
		return new GroupPlayError(ERROR_MESSAGES.NICKNAME_TAKEN, 'NICKNAME_TAKEN');
	}
	return new GroupPlayError('Class Play could not complete that action. Check your connection.');
}

async function ensureAnonymousSession(supabase: SupabaseClient): Promise<void> {
	const {
		data: { session },
		error: sessionError
	} = await supabase.auth.getSession();
	if (sessionError) throw sessionError;
	if (session) return;

	const { error } = await supabase.auth.signInAnonymously();
	if (error) throw error;
}

export async function joinRoom(code: string, nickname: string): Promise<JoinRoomResult> {
	const normalizedCode = normalizeRoomCode(code);
	const normalizedNickname = nickname.trim();

	if (!isValidRoomCode(normalizedCode)) {
		throw new GroupPlayError('Enter the 4-character code from your teacher.', 'INVALID_CODE');
	}
	if (normalizedNickname.length < 2 || normalizedNickname.length > 14) {
		throw new GroupPlayError(ERROR_MESSAGES.INVALID_NICKNAME, 'INVALID_NICKNAME');
	}

	try {
		const supabase = getClient();
		await ensureAnonymousSession(supabase);
		const { data, error } = await supabase.rpc('join_room', {
			p_code: normalizedCode,
			p_nickname: normalizedNickname
		});
		if (error) throw error;
		if (!data || typeof data !== 'object' || !('room' in data) || !('player' in data)) {
			throw new GroupPlayError('The room returned an unexpected response. Please try again.');
		}
		const result = data as {
			room: Record<string, unknown>;
			player: GroupPlayPlayer;
		};
		return {
			room: sanitizeRoom(result.room),
			player: result.player
		};
	} catch (error) {
		throw mapError(error);
	}
}

function sanitizeRoom(raw: Record<string, unknown>): GroupPlayRoom {
	const rawQuestions = Array.isArray(raw.question_set) ? raw.question_set : null;
	const question_set = rawQuestions
		? rawQuestions.map((value) => {
				const question = value as Record<string, unknown>;
				return {
					index: Number(question.index),
					scriptureId: String(question.scriptureId ?? ''),
					scriptureReference: String(question.scriptureReference ?? ''),
					typeName: String(question.typeName ?? ''),
					prompt: String(question.prompt ?? ''),
					options: Array.isArray(question.options) ? question.options.map(String) : []
				};
			})
		: null;

	return {
		...(raw as Omit<GroupPlayRoom, 'question_set'>),
		question_set
	};
}

async function fetchSanitizedRoom(
	supabase: SupabaseClient,
	column: 'id' | 'code',
	value: string
): Promise<TimedRoomSnapshot | null> {
	const {
		data: { session },
		error: sessionError
	} = await supabase.auth.getSession();
	if (sessionError) throw sessionError;
	if (!session) return null;

	const requestStartedAt = Date.now();
	const query = new URLSearchParams({
		select: '*',
		[column]: `eq.${value}`
	});
	const response = await fetch(`${SUPABASE_URL}/rest/v1/rooms_player_view?${query}`, {
		headers: {
			Accept: 'application/json',
			apikey: SUPABASE_ANON_KEY,
			Authorization: `Bearer ${session.access_token}`
		}
	});
	const requestEndedAt = Date.now();

	if (!response.ok) {
		const detail = await response.text();
		throw new GroupPlayError(
			detail || 'Could not refresh the Class Play room.',
			'ROOM_REFRESH_FAILED'
		);
	}

	const rows = (await response.json()) as Array<Record<string, unknown>>;
	const rawRoom = rows[0];
	if (!rawRoom) return null;

	const serverDate = response.headers.get('date');
	const serverNowMs = serverDate ? Date.parse(serverDate) : Number.NaN;
	const requestMidpoint = requestStartedAt + (requestEndedAt - requestStartedAt) / 2;

	return {
		room: sanitizeRoom(rawRoom),
		serverOffsetMs: Number.isFinite(serverNowMs) ? serverNowMs - requestMidpoint : 0
	};
}

export function getRoomSanitized(roomId: string): Promise<TimedRoomSnapshot | null> {
	return fetchSanitizedRoom(getClient(), 'id', roomId);
}

export async function resumeRoom(code: string): Promise<JoinRoomResult | null> {
	const supabase = getClient();
	const normalizedCode = normalizeRoomCode(code);
	if (!isValidRoomCode(normalizedCode)) return null;

	const snapshot = await fetchSanitizedRoom(supabase, 'code', normalizedCode);
	if (!snapshot) return null;

	const {
		data: { session },
		error: sessionError
	} = await supabase.auth.getSession();
	if (sessionError) throw sessionError;
	if (!session) return null;

	const { data, error } = await supabase
		.from('players')
		.select('*')
		.eq('room_id', snapshot.room.id)
		.eq('user_id', session.user.id)
		.maybeSingle();
	if (error) throw error;
	if (!data) return null;

	return {
		room: snapshot.room,
		player: data as GroupPlayPlayer
	};
}

export async function submitAnswer(
	roomId: string,
	questionIndex: number,
	choiceIndex: number
): Promise<SubmitAnswerResult> {
	try {
		const { data, error } = await getClient().rpc('submit_answer', {
			p_room_id: roomId,
			p_question_index: questionIndex,
			p_choice_index: choiceIndex
		});
		if (error) throw error;
		return data as SubmitAnswerResult;
	} catch (error) {
		throw mapError(error);
	}
}

export async function submitSbFinish(
	roomId: string,
	playerId: string,
	scriptureIndex: number,
	elapsedMs: number,
	mistakeCount: number
): Promise<GroupSbFinish> {
	try {
		const { data, error } = await getClient()
			.from('group_sb_finishes')
			.insert({
				room_id: roomId,
				player_id: playerId,
				scripture_index: scriptureIndex,
				elapsed_ms: elapsedMs,
				mistake_count: mistakeCount
			})
			.select()
			.single();
		if (error) {
			if (error.code === '23505') {
				throw new GroupPlayError(
					'This scripture finish was already recorded.',
					'DUPLICATE_FINISH'
				);
			}
			throw error;
		}
		return data as GroupSbFinish;
	} catch (error) {
		throw mapError(error);
	}
}

async function fetchPlayers(supabase: SupabaseClient, roomId: string): Promise<GroupPlayPlayer[]> {
	const { data, error } = await supabase
		.from('players')
		.select('*')
		.eq('room_id', roomId)
		.order('joined_at');
	if (error) throw error;
	return (data ?? []) as GroupPlayPlayer[];
}

async function fetchAnswers(supabase: SupabaseClient, roomId: string): Promise<GroupPlayAnswer[]> {
	const { data, error } = await supabase
		.from('answers')
		.select('*')
		.eq('room_id', roomId)
		.order('submitted_at');
	if (error) throw error;
	return (data ?? []) as GroupPlayAnswer[];
}

async function fetchSbFinishes(supabase: SupabaseClient, roomId: string): Promise<GroupSbFinish[]> {
	const { data, error } = await supabase
		.from('group_sb_finishes')
		.select('*')
		.eq('room_id', roomId)
		.order('completed_at');
	if (error) throw error;
	return (data ?? []) as GroupSbFinish[];
}

export function watchRoom(
	joined: JoinRoomResult,
	watchers: GroupPlayWatchers
): GroupPlaySubscription {
	const supabase = getClient();
	let channels: RealtimeChannel[] = [];
	let stopped = false;
	let generation = 0;

	const reportConnectionError = () => {
		if (!stopped) watchers.onConnectionError?.();
	};

	const refreshRoom = async () => {
		try {
			const snapshot = await getRoomSanitized(joined.room.id);
			if (stopped) return;
			if (!snapshot) {
				watchers.onRemoved?.();
				return;
			}
			watchers.onRoom?.(snapshot);
		} catch {
			reportConnectionError();
		}
	};

	const refreshPlayers = async () => {
		try {
			const players = await fetchPlayers(supabase, joined.room.id);
			if (stopped) return;
			if (!players.some((player) => player.id === joined.player.id)) {
				watchers.onRemoved?.();
				return;
			}
			watchers.onPlayers?.(players);
		} catch {
			reportConnectionError();
		}
	};

	const refreshAnswers = async () => {
		try {
			const answers = await fetchAnswers(supabase, joined.room.id);
			if (!stopped) watchers.onAnswers?.(answers);
		} catch {
			reportConnectionError();
		}
	};

	const refreshSbFinishes = async () => {
		try {
			const finishes = await fetchSbFinishes(supabase, joined.room.id);
			if (!stopped) watchers.onSbFinishes?.(finishes);
		} catch {
			reportConnectionError();
		}
	};

	const resync = async () => {
		await Promise.all([refreshRoom(), refreshPlayers(), refreshAnswers(), refreshSbFinishes()]);
	};

	const reconnect = async () => {
		const currentGeneration = ++generation;
		const oldChannels = channels;
		channels = [];
		await Promise.all(oldChannels.map((channel) => supabase.removeChannel(channel)));
		if (stopped || currentGeneration !== generation) return;

		const subscribe = (channel: RealtimeChannel) => {
			channel.subscribe((status) => {
				if (stopped || currentGeneration !== generation) return;
				if (status === 'SUBSCRIBED') watchers.onConnectionReady?.();
				if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') reportConnectionError();
			});
			channels.push(channel);
		};

		// Note: there is intentionally no postgres_changes subscription on the
		// `rooms` base table. Under strict RLS players can only read
		// `rooms_player_view`, and views cannot be added to realtime
		// publications, so such a subscription would never fire. Room state
		// updates arrive via the 3s `refreshRoom` poll plus the
		// `question_advanced` / `room_ended` broadcasts below by design.

		subscribe(
			supabase.channel(`web:players:${joined.room.id}:${currentGeneration}`).on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'players',
					filter: `room_id=eq.${joined.room.id}`
				},
				(payload) => {
					const removedId = (payload.old as Partial<GroupPlayPlayer>).id;
					if (payload.eventType === 'DELETE' && removedId === joined.player.id) {
						watchers.onRemoved?.();
						return;
					}
					void refreshPlayers();
				}
			)
		);

		subscribe(
			supabase.channel(`web:answers:${joined.room.id}:${currentGeneration}`).on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'answers',
					filter: `room_id=eq.${joined.room.id}`
				},
				() => void refreshAnswers()
			)
		);

		subscribe(
			supabase.channel(`web:sb-finishes:${joined.room.id}:${currentGeneration}`).on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'group_sb_finishes',
					filter: `room_id=eq.${joined.room.id}`
				},
				() => void refreshSbFinishes()
			)
		);

		const broadcastChannel = supabase.channel(`room:${joined.room.code}`);
		for (const event of ['question_advanced', 'room_ended'] as const) {
			broadcastChannel.on('broadcast', { event }, ({ payload }) => {
				if (stopped || currentGeneration !== generation) return;
				void (event === 'room_ended' ? resync() : refreshRoom());
				watchers.onBroadcast?.({ event, payload });
			});
		}
		subscribe(broadcastChannel);

		await resync();
	};

	void reconnect();
	const roomPoll = globalThis.setInterval(() => {
		if (!stopped) void refreshRoom();
	}, 3000);

	return {
		resync,
		reconnect,
		stop: async () => {
			stopped = true;
			generation++;
			globalThis.clearInterval(roomPoll);
			const currentChannels = channels;
			channels = [];
			await Promise.all(currentChannels.map((channel) => supabase.removeChannel(channel)));
		}
	};
}
