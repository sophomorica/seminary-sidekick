/**
 * This-week pins for `/teachers/printouts`.
 *
 * No week / pacing map exists in this repo or in
 * sophomorica/seminary_sidekick_flutter (`lib/data` is scriptures only).
 *
 * Sources (official Church):
 * - Old Testament Seminary Teacher Manual (2026), unit “Moses 1; Abraham 3”:
 *   https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/02-moses-1-abraham-3/020-overview
 *   Moses 1:39 is introduced in the lesson “Moses 1:27–42”:
 *   https://www.churchofjesuschrist.org/study/manual/old-testament-seminary-manual-2026/02-moses-1-abraham-3/024-moses-1
 * - Come, Follow Me—For Home and Church: Old Testament 2026:
 *   https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026
 *   5–11 Jan 2026 (lesson 02) is Moses 1; Abraham 3 — bank verses Moses 1:39
 *   and Abraham 3:22–23:
 *   https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/02
 *   24–30 Aug 2026 (lesson 35) is Psalms 49–51; 61–66; 69–72; 77–78; 85–86:
 *   https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/35
 *   That reading does not include Psalm 24:3–4 (the only Psalms verse in
 *   `$lib/data/scriptures`). Do not invent a CFM match.
 *
 * ASSUMED: US released-time seminary 2026–27 begins the week of Monday
 * 24 Aug 2026 (some programs the week of 17 Aug). Opening lessons are
 * orientation / intro / Moses 1:1–26 — no DM assignment yet. Those weeks
 * pin Moses 1:39, the first OT-bank verse of the opening unit, labeled
 * “This week’s unit”.
 *
 * Calendar days use America/Denver (released-time Mountain) so Vercel UTC
 * and a Mountain teacher agree on which Monday this is. Call this from
 * `load()`, not again in the page, so SSR HTML and hydration match.
 *
 * Only slugs that resolve in `$lib/data/scriptures` are returned.
 */

import { getPrintoutVerse, loadPrintoutScripture } from './printouts';

/** Released-time seminary calendar. Not the server’s local zone. */
export const SEMINARY_TIME_ZONE = 'America/Denver';

export type ThisWeekKind = 'doctrinal-mastery' | 'unit';

export type ThisWeekPin = {
	slugs: string[];
	kind: ThisWeekKind;
	label: string;
	detail: string;
};

/** First OT doctrinal-mastery verse in the app bank (id "1"). */
export const FIRST_OT_UNIT_SLUG = 'moses-1-39';

type CfmWeek = {
	monday: string;
	sunday: string;
	slugs: string[];
};

/**
 * Official CFM OT 2026 weeks whose reading actually contains a bank verse.
 * Keep this list small and cited. Aug 24–30 2026 is intentionally absent.
 */
const CFM_OT_2026_DM_WEEKS: readonly CfmWeek[] = [
	{
		monday: '2026-01-05',
		sunday: '2026-01-11',
		slugs: ['moses-1-39', 'abraham-3-22-23']
	}
];

/** Mondays treated as seminary orientation / first week (no DM assignment). */
const SEMINARY_ORIENTATION_MONDAYS = new Set(['2026-08-17', '2026-08-24']);

function denverParts(date: Date): { year: number; month: number; day: number } {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: SEMINARY_TIME_ZONE,
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	}).formatToParts(date);
	const num = (type: Intl.DateTimeFormatPartTypes) =>
		Number(parts.find((part) => part.type === type)?.value);
	return { year: num('year'), month: num('month'), day: num('day') };
}

function mondayOf(date: Date): Date {
	const { year, month, day } = denverParts(date);
	const utc = new Date(Date.UTC(year, month - 1, day));
	const weekday = utc.getUTCDay();
	const offset = weekday === 0 ? -6 : 1 - weekday;
	utc.setUTCDate(utc.getUTCDate() + offset);
	return utc;
}

function isoDate(date: Date): string {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function bankSlugs(slugs: readonly string[]): string[] {
	return slugs.filter((slug) => getPrintoutVerse(slug) && loadPrintoutScripture(slug));
}

function unitPin(detail: string): ThisWeekPin {
	return {
		slugs: bankSlugs([FIRST_OT_UNIT_SLUG]),
		kind: 'unit',
		label: 'This week’s unit',
		detail
	};
}

export function thisWeekPin(now: Date = new Date()): ThisWeekPin {
	const monday = isoDate(mondayOf(now));

	if (SEMINARY_ORIENTATION_MONDAYS.has(monday)) {
		return unitPin('Opening OT unit. No doctrinal-mastery verse is assigned yet.');
	}

	const cfm = CFM_OT_2026_DM_WEEKS.find((week) => monday >= week.monday && monday <= week.sunday);
	if (cfm) {
		const slugs = bankSlugs(cfm.slugs);
		if (slugs.length > 0) {
			return {
				slugs,
				kind: 'doctrinal-mastery',
				label: 'This week',
				detail: 'Doctrinal mastery from this Come, Follow Me week.'
			};
		}
	}

	return unitPin(
		'No mapped doctrinal-mastery assignment this week. First OT-bank verse of the opening unit.'
	);
}

export function defaultPrintoutSlug(now: Date = new Date()): string {
	return thisWeekPin(now).slugs[0] ?? FIRST_OT_UNIT_SLUG;
}
