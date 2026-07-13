import { getScripture } from '$lib/data/scriptures';
import type { Scripture } from '$lib/data/types';
import type { GroupPlayPlayer, GroupSbConfig, GroupSbFinish } from '$lib/services/groupPlay';

export const DNF_MISTAKE_COUNT = -1;
export const INTERMEDIATE_DISTRACTOR_COUNT = 3;

export type RaceChunk = {
	id: string;
	text: string;
	isDistractor: boolean;
};

export type ScriptureBuilderSetup =
	| { config: GroupSbConfig; scriptures: Scripture[]; error: null }
	| { config: null; scriptures: []; error: string };

export type RankedSbPlayer = {
	player: GroupPlayPlayer;
	score: string;
	detail: string;
};

export function parseScriptureBuilderSetup(scope: Record<string, unknown>): ScriptureBuilderSetup {
	const raw = scope.scriptureBuilderConfig;
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return setupError('This race is missing its Scripture Builder configuration.');
	}

	const value = raw as Record<string, unknown>;
	const chunkDifficulty = value.chunkDifficulty === 'intermediate' ? 'intermediate' : 'beginner';
	const playMode = value.playMode === 'setOfN' ? 'setOfN' : 'roundByRound';
	const scriptureIds = Array.isArray(value.scriptureIds)
		? value.scriptureIds.filter((id): id is string => typeof id === 'string')
		: [];
	const timeout = value.perScriptureTimeoutSeconds;

	if (scriptureIds.length === 0) {
		return setupError('This race does not include any scriptures.');
	}
	if (timeout !== undefined && (!Number.isInteger(timeout) || (timeout as number) <= 0)) {
		return setupError('This race has an invalid scripture timer.');
	}

	const missingIds = scriptureIds.filter((id) => getScripture(id) === null);
	if (missingIds.length > 0) {
		return setupError(
			`This race includes scripture ${missingIds.join(', ')}, which is not available on the web. Ask the host to end the game and choose another set.`
		);
	}

	const scriptures = scriptureIds.map((id) => getScripture(id) as Scripture);
	return {
		config: {
			chunkDifficulty,
			playMode,
			scriptureIds,
			...(typeof timeout === 'number' ? { perScriptureTimeoutSeconds: timeout } : {})
		},
		scriptures,
		error: null
	};
}

function setupError(error: string): ScriptureBuilderSetup {
	return { config: null, scriptures: [], error };
}

export function scriptureWords(scripture: Scripture): string[] {
	return scripture.fullText
		.replace(/^\d+\s*/gm, '')
		.replaceAll('¶', '')
		.split(/\s+/)
		.filter(Boolean);
}

export function buildRaceChunks(
	scripture: Scripture,
	difficulty: GroupSbConfig['chunkDifficulty'],
	distractorPool: Scripture[],
	random: () => number = Math.random
): { targets: RaceChunk[]; pool: RaceChunk[] } {
	const chunkSize = difficulty === 'beginner' ? 3 : 2;
	const words = scriptureWords(scripture);
	const targets: RaceChunk[] = [];

	for (let start = 0; start < words.length; start += chunkSize) {
		targets.push({
			id: `target-${start}`,
			text: words.slice(start, start + chunkSize).join(' '),
			isDistractor: false
		});
	}

	const pool = [...targets];
	if (difficulty === 'intermediate' && distractorPool.length > 0) {
		const others = shuffled(distractorPool, random);
		for (const other of others) {
			if (pool.length - targets.length >= INTERMEDIATE_DISTRACTOR_COUNT) break;
			const otherWords = scriptureWords(other);
			if (otherWords.length < chunkSize) continue;
			const upperBound = Math.max(1, otherWords.length - chunkSize);
			const start = Math.floor(random() * upperBound);
			pool.push({
				id: `distractor-${other.id}-${start}`,
				text: otherWords.slice(start, start + chunkSize).join(' '),
				isDistractor: true
			});
		}
	}

	return { targets, pool: shuffled(pool, random) };
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
	const result = [...values];
	for (let index = result.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(random() * (index + 1));
		[result[index], result[swapIndex]] = [result[swapIndex], result[index]];
	}
	return result;
}

export function rankScriptureBuilderPlayers(
	players: GroupPlayPlayer[],
	config: GroupSbConfig,
	finishes: GroupSbFinish[]
): RankedSbPlayer[] {
	const racers = players.filter((player) => !player.is_host);
	if (config.playMode === 'roundByRound') {
		return rankRoundByRound(racers, config.scriptureIds.length, finishes);
	}
	return rankSetOfN(racers, config.scriptureIds.length, finishes);
}

function rankRoundByRound(
	racers: GroupPlayPlayer[],
	totalScriptures: number,
	finishes: GroupSbFinish[]
): RankedSbPlayer[] {
	const wins = new Map(racers.map((player) => [player.id, 0]));
	const totalMs = new Map(racers.map((player) => [player.id, 0]));
	const finished = new Map(racers.map((player) => [player.id, 0]));
	const racerIds = new Set(racers.map((player) => player.id));

	for (let index = 0; index < totalScriptures; index++) {
		const round = finishes
			.filter(
				(finish) =>
					finish.scripture_index === index &&
					finish.mistake_count !== DNF_MISTAKE_COUNT &&
					racerIds.has(finish.player_id)
			)
			.toSorted((a, b) => Date.parse(a.completed_at) - Date.parse(b.completed_at));
		const winner = round[0];
		if (winner) wins.set(winner.player_id, (wins.get(winner.player_id) ?? 0) + 1);
	}

	for (const finish of finishes) {
		if (!racerIds.has(finish.player_id) || finish.mistake_count === DNF_MISTAKE_COUNT) continue;
		totalMs.set(finish.player_id, (totalMs.get(finish.player_id) ?? 0) + finish.elapsed_ms);
		finished.set(finish.player_id, (finished.get(finish.player_id) ?? 0) + 1);
	}

	return [...racers]
		.sort((a, b) => {
			const winDifference = (wins.get(b.id) ?? 0) - (wins.get(a.id) ?? 0);
			return winDifference || (totalMs.get(a.id) ?? 0) - (totalMs.get(b.id) ?? 0);
		})
		.map((player) => {
			const winCount = wins.get(player.id) ?? 0;
			const finishCount = finished.get(player.id) ?? 0;
			const seconds = formatSeconds(totalMs.get(player.id) ?? 0);
			return {
				player,
				score: `${winCount}w`,
				detail:
					finishCount === 0
						? 'No finishes'
						: `${finishCount}/${totalScriptures} finished · ${seconds} total`
			};
		});
}

function rankSetOfN(
	racers: GroupPlayPlayer[],
	totalScriptures: number,
	finishes: GroupSbFinish[]
): RankedSbPlayer[] {
	const totalMs = new Map(racers.map((player) => [player.id, 0]));
	const mistakes = new Map(racers.map((player) => [player.id, 0]));
	const cleanFinishes = new Map(racers.map((player) => [player.id, 0]));
	const hasDnf = new Map(racers.map((player) => [player.id, false]));
	const racerIds = new Set(racers.map((player) => player.id));

	for (const finish of finishes) {
		if (!racerIds.has(finish.player_id)) continue;
		if (finish.mistake_count === DNF_MISTAKE_COUNT) {
			hasDnf.set(finish.player_id, true);
			continue;
		}
		totalMs.set(finish.player_id, (totalMs.get(finish.player_id) ?? 0) + finish.elapsed_ms);
		mistakes.set(
			finish.player_id,
			(mistakes.get(finish.player_id) ?? 0) + finish.mistake_count
		);
		cleanFinishes.set(finish.player_id, (cleanFinishes.get(finish.player_id) ?? 0) + 1);
	}

	const isDone = (playerId: string) =>
		(cleanFinishes.get(playerId) ?? 0) >= totalScriptures && !(hasDnf.get(playerId) ?? false);

	return [...racers]
		.sort((a, b) => {
			const aDone = isDone(a.id);
			const bDone = isDone(b.id);
			if (aDone !== bDone) return aDone ? -1 : 1;
			if (aDone) {
				return (
					(totalMs.get(a.id) ?? 0) - (totalMs.get(b.id) ?? 0) ||
					(mistakes.get(a.id) ?? 0) - (mistakes.get(b.id) ?? 0)
				);
			}
			return (
				(cleanFinishes.get(b.id) ?? 0) - (cleanFinishes.get(a.id) ?? 0) ||
				(totalMs.get(a.id) ?? 0) - (totalMs.get(b.id) ?? 0)
			);
		})
		.map((player) => {
			const finishCount = cleanFinishes.get(player.id) ?? 0;
			const dnf = hasDnf.get(player.id) ?? false;
			return {
				player,
				score: formatSeconds(totalMs.get(player.id) ?? 0),
				detail: `${finishCount}/${totalScriptures} finished · ${
					dnf ? 'DNF' : `${mistakes.get(player.id) ?? 0} mistakes`
				}`
			};
		});
}

export function formatSeconds(milliseconds: number): string {
	return `${(milliseconds / 1000).toFixed(1)}s`;
}
