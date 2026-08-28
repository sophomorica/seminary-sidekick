/**
 * Teacher morning mixer — first-week grabbers and honest beats.
 *
 * Original copy only. No Facebook, no private catalog rows, no Church/TPT
 * files, no invented testimonials. Scripture Builder printouts stay at
 * `/teachers/printouts`. Teach is not a lesson-plan factory.
 */

export const SEMINARY_YEAR_LABEL = 'Old Testament 2026–27';
export const MIXER_FRAMING = 'Four beats. One morning.';

export type MixerView = 'mix' | 'today' | 'week';

export type GrabberIcon = 'printer' | 'tent' | 'compass' | 'users' | 'chair' | 'beats';

export type Grabber = {
	slug: string;
	title: string;
	kicker: string;
	summary: string;
	time: string;
	materials: string;
	howTo: readonly string[];
	/** Path a teacher opens to run or print this grabber. */
	href: string;
	actionLabel: string;
	printHref?: string;
	printLabel?: string;
	/** Why this format still works in NT / BoM / D&C years. */
	transferable: string;
	icon: GrabberIcon;
	/** True when the card points at an existing tool, not a /grabbers route. */
	external?: boolean;
};

export type MorningBeat = {
	ready: boolean;
	title: string;
	body: string;
	href?: string;
	actionLabel?: string;
};

export type MorningPlan = {
	label: string;
	when: string;
	intro: string;
	grabberSlug: string;
	teach: MorningBeat;
	wrap: MorningBeat;
	invite: MorningBeat;
};

export type WeekDay = {
	day: string;
	focus: string;
	grabberSlug: string;
	teach: MorningBeat;
	wrap: MorningBeat;
	invite: MorningBeat;
};

export const MIXER_VIEWS: ReadonlyArray<{
	id: MixerView;
	label: string;
	href: string;
}> = [
	{ id: 'mix', label: 'Mix', href: '/teachers' },
	{ id: 'today', label: 'Today', href: '/teachers?view=today' },
	{ id: 'week', label: 'This week', href: '/teachers?view=week' }
];

export function parseMixerView(value: string | null): MixerView {
	if (value === 'today' || value === 'week') return value;
	return 'mix';
}

export const GRABBERS: readonly Grabber[] = [
	{
		slug: 'scripture-builder-printouts',
		title: 'Scripture Builder printouts',
		kicker: 'Grabber · print',
		summary:
			'Cut-out phrase tiles or first-letter hints for any doctrinal-mastery verse. Same Beginner, Intermediate, and Advanced chunks as the app.',
		time: '8–12 minutes',
		materials: 'Printer, US Letter paper, scissors for Beginner and Intermediate.',
		howTo: [
			'Open the printout library and pick tomorrow’s verse.',
			'Print Beginner or Intermediate tiles, or Advanced first-letter hints.',
			'Cut the dashed tiles. Mix them on the board — they are not in order.',
			'Students rebuild the verse, then read it aloud once together.'
		],
		href: '/teachers/printouts',
		actionLabel: 'Open printouts',
		transferable:
			'Any of the 100 doctrinal-mastery verses. Swap the reference when the year turns to New Testament, Book of Mormon, or Doctrine and Covenants.',
		icon: 'printer',
		external: true
	},
	{
		slug: 'name-tents',
		title: 'Name tents',
		kicker: 'First week · printable',
		summary:
			'A folded desk card: name facing the room, a hope and an “ask me about” line facing you. You learn the class while you walk, without a share circle that eats the hour.',
		time: '6–8 minutes',
		materials: 'Printed tents, pens. Four tents fit on one US Letter page.',
		howTo: [
			'Print one page per four students. Cut the dashed cards.',
			'Students fold on the middle line so the name faces the room.',
			'They write a first name large, then one hope for the year and one “ask me about” on the inside.',
			'Walk the aisles and read the inside lines. Call on two or three hopes, not every student.'
		],
		href: '/teachers/grabbers/name-tents',
		actionLabel: 'Open this grabber',
		printHref: '/teachers/grabbers/name-tents/print',
		printLabel: 'Print tents',
		transferable:
			'The three lines never mention a book of scripture. Use the same sheet in any seminary year.',
		icon: 'tent'
	},
	{
		slug: 'corner-compass',
		title: 'Corner compass',
		kicker: 'Class unity · printable',
		summary:
			'Four walls, four ways of learning: talk it out, write it down, try it, listen first. Students find their wall, meet two people, and tell you how to teach them.',
		time: '7–10 minutes',
		materials: 'Four printed signs, or the same four words on the board.',
		howTo: [
			'Tape one sign in each corner, or write the four postures on the board.',
			'Read the four once. Students walk to the wall that is most true today.',
			'Ninety seconds: learn two names in that corner.',
			'Ask one student from each wall, “What should I do differently for people who learn like you?” Write the four answers where you can see them next week.'
		],
		href: '/teachers/grabbers/corner-compass',
		actionLabel: 'Open this grabber',
		printHref: '/teachers/grabbers/corner-compass/print',
		printLabel: 'Print signs',
		transferable:
			'Learning postures, not Old Testament trivia. The same four walls work in any year.',
		icon: 'compass'
	},
	{
		slug: 'partner-echo',
		title: 'Partner echo',
		kicker: 'Get to know you · play',
		summary:
			'Ninety seconds with a partner. Then you only introduce them — never yourself. Someone in the room has to be able to say each name.',
		time: '8 minutes',
		materials: 'None. Optional prompt cards if you want them on paper.',
		howTo: [
			'Pair students. Odd number: you are the extra partner.',
			'Ninety seconds. Each person answers three prompts: name, who helped you get here, one question about this year’s book.',
			'Go around. Each student introduces their partner in one sentence. No one introduces themselves.',
			'If a name is missed, the partner tries again. That is the whole point.'
		],
		href: '/teachers/grabbers/partner-echo',
		actionLabel: 'Open this grabber',
		printHref: '/teachers/grabbers/partner-echo/print',
		printLabel: 'Print prompts',
		transferable:
			'Swap only the third prompt: Old Testament, New Testament, Book of Mormon, or Doctrine and Covenants. The echo stays the same.',
		icon: 'users'
	},
	{
		slug: 'welcome-seat',
		title: 'Welcome seat',
		kicker: 'Invite · printable',
		summary:
			'Someone is not in the room yet. Each student writes two lines for that empty chair. You keep the stack. When they arrive, the welcome is already written.',
		time: '5 minutes',
		materials: 'Printed note cards or scrap paper and pens.',
		howTo: [
			'Name the empty chairs honestly: late enrolls, a friend who is deciding, someone who was sick.',
			'Each student writes two lines to a classmate who is not here yet. Sign a first name only.',
			'Collect the cards. Do not read them aloud today.',
			'When that student walks in — this week or next month — hand them one card. That is the invite.'
		],
		href: '/teachers/grabbers/welcome-seat',
		actionLabel: 'Open this grabber',
		printHref: '/teachers/grabbers/welcome-seat/print',
		printLabel: 'Print notes',
		transferable:
			'First week is the spike, but the stack works any time a seat is empty. No year-specific content.',
		icon: 'chair'
	},
	{
		slug: 'four-beats-pass',
		title: 'Four beats pass',
		kicker: 'Class unity · printable',
		summary:
			'The morning shape as four cards: Grabber, Teach, Wrap, Invite. Groups of four each own one beat and write how it should feel this year.',
		time: '8–10 minutes',
		materials: 'One printed set of four cards per group, pens.',
		howTo: [
			'Print one set per four students. Hand each person one beat.',
			'Say the framing once: four beats, one morning. No lecture after that.',
			'Each student writes one sentence: “This beat should feel like ______ this year.”',
			'Read the four sentences. Keep the cards on the board for the rest of the week.'
		],
		href: '/teachers/grabbers/four-beats-pass',
		actionLabel: 'Open this grabber',
		printHref: '/teachers/grabbers/four-beats-pass/print',
		printLabel: 'Print cards',
		transferable:
			'The four beats are the mixer, not an Old Testament unit. Reuse the same cards every year.',
		icon: 'beats'
	}
];

const GRABBER_BY_SLUG = new Map(GRABBERS.map((grabber) => [grabber.slug, grabber]));

export function getGrabber(slug: string): Grabber | null {
	return GRABBER_BY_SLUG.get(slug) ?? null;
}

/** Grabbers that have their own `/teachers/grabbers/[slug]` page. */
export const GRABBER_ROUTES: readonly Grabber[] = GRABBERS.filter((grabber) => !grabber.external);

export const PRINTABLE_GRABBERS: readonly Grabber[] = GRABBER_ROUTES.filter(
	(grabber) => grabber.printHref
);

export function isGrabberPrintPath(pathname: string): boolean {
	return /^\/teachers\/grabbers\/[^/]+\/print\/?$/.test(pathname);
}

const TEACH_NOT_READY =
	'Teach is not a lesson-plan factory on this site. Open your seminary manual and teach the passage you already planned. We will not invent a full plan or paste Come, Follow Me.';

export const TODAY: MorningPlan = {
	label: 'First morning',
	when: 'Week 1, day 1 · Old Testament 2026–27',
	intro: 'Get the room talking. Then you teach. The grabber is ready; the lesson plan is yours.',
	grabberSlug: 'name-tents',
	teach: {
		ready: false,
		title: 'You teach from your manual',
		body: `${TEACH_NOT_READY} If you are on Moses 1, name tents sit next to “who you are.” If you are still on orientation, they sit next to “why we are here.”`
	},
	wrap: {
		ready: true,
		title: 'One word for the year',
		body: 'Go around once. First name plus one word you hope this class feels like. Keep it to a minute or two.'
	},
	invite: {
		ready: true,
		title: 'Bring scriptures tomorrow',
		body: 'Ask them to sit with someone they do not know yet. No packet. No extra homework.'
	}
};

export const THIS_WEEK: readonly WeekDay[] = [
	{
		day: 'Monday',
		focus: 'Learn names',
		grabberSlug: 'name-tents',
		teach: {
			ready: false,
			title: 'Orientation or Moses 1 — you choose',
			body: TEACH_NOT_READY
		},
		wrap: {
			ready: true,
			title: 'One word for the year',
			body: 'Name plus one word. Write four of the words on the board and leave them up.'
		},
		invite: {
			ready: true,
			title: 'Bring scriptures Tuesday',
			body: 'Sit with someone new. Name tents stay on the desks all week.'
		}
	},
	{
		day: 'Tuesday',
		focus: 'Hear another name',
		grabberSlug: 'partner-echo',
		teach: {
			ready: false,
			title: 'Moses 1, if that is where you are',
			body: `${TEACH_NOT_READY} If you reach Moses 1:39 this week, the third prompt (“one question about the Old Testament”) is enough of a bridge. Do not stretch the grabber into a fake lesson.`
		},
		wrap: {
			ready: true,
			title: 'Repeat two names',
			body: 'Ask two students to introduce their partner again. That is the wrap.'
		},
		invite: {
			ready: true,
			title: 'Say one name at home',
			body: 'Tell someone at home one classmate’s name and one hope you heard.'
		}
	},
	{
		day: 'Wednesday',
		focus: 'How this class learns',
		grabberSlug: 'corner-compass',
		teach: {
			ready: false,
			title: 'You teach the passage you planned',
			body: TEACH_NOT_READY
		},
		wrap: {
			ready: true,
			title: 'Four answers on the board',
			body: 'Keep the four “teach me this way” lines visible. Use one of them tomorrow on purpose.'
		},
		invite: {
			ready: true,
			title: 'Try a different wall',
			body: 'Tomorrow, sit nearer someone who chose a different corner.'
		}
	},
	{
		day: 'Thursday',
		focus: 'A verse in their hands',
		grabberSlug: 'scripture-builder-printouts',
		teach: {
			ready: false,
			title: 'Moses 1:39 when you get there',
			body: `${TEACH_NOT_READY} The printout library includes Moses 1:39 because it is in the app bank — not because we wrote a Thursday lesson around it. Pick the verse you are actually teaching.`
		},
		wrap: {
			ready: true,
			title: 'Read it once, together',
			body: 'After the tiles or hints, read the verse aloud once. No quiz. No scoreboard.'
		},
		invite: {
			ready: true,
			title: 'Keep one phrase',
			body: 'Send them out with one phrase from the verse, not a worksheet.'
		}
	},
	{
		day: 'Friday',
		focus: 'The empty chair',
		grabberSlug: 'welcome-seat',
		teach: {
			ready: false,
			title: 'You close the week from your manual',
			body: `${TEACH_NOT_READY} If you have four extra minutes, run Four beats pass after the notes so the class can name the morning shape.`
		},
		wrap: {
			ready: true,
			title: 'Four beats pass, if you have time',
			body: 'Grabber / Teach / Wrap / Invite — one sentence each. Optional. The welcome notes already did the invite.'
		},
		invite: {
			ready: true,
			title: 'Keep the stack',
			body: 'Do not read the notes today. Hand one to the next student who walks in late.'
		}
	}
];

export function grabberFor(slug: string): Grabber {
	const grabber = getGrabber(slug);
	if (!grabber) {
		throw new Error(`Unknown mixer grabber: ${slug}`);
	}
	return grabber;
}
