/**
 * Teaching ideas: types, book list, and the anon-key fetch.
 * Pure module so tests can import it with a mocked fetch; pages go through
 * $lib/server/teachingIdeas.ts.
 */

import { createClient } from '@supabase/supabase-js';

export type Course = 'general' | 'OT' | 'NT' | 'BoM' | 'D&C';

/** The only columns anon may read (see the migration's column grant). */
export type TeachingIdea = {
	course: Course;
	book: string;
	category: string;
	title: string;
	summary: string;
	slug: string;
	imageUrl: string | null;
	imageAlt: string | null;
};

/** A teaching idea with its full how-to (markdown). */
export type IdeaWriteup = TeachingIdea & { bodyMd: string };

export const COLUMNS = 'course,book,category,title,summary,slug,body_md,image_url,image_alt';

export const COURSE_LABELS: Record<Course, string> = {
	general: 'Any year',
	OT: 'Old Testament',
	NT: 'New Testament',
	BoM: 'Book of Mormon',
	'D&C': 'Doctrine and Covenants'
};

export const CATEGORY_LABELS: Record<string, string> = {
	lesson_plan: 'Lesson idea',
	doctrinal_mastery: 'Doctrinal mastery',
	teaching_method: 'Teaching method',
	life_prep: 'Life prep',
	game: 'Game',
	classroom_management: 'Classroom management',
	activity: 'Activity',
	printable: 'Printable',
	questions: 'Questions',
	object_lesson: 'Object lesson',
	icebreaker: 'Icebreaker',
	handout: 'Handout',
	slides: 'Slides',
	other: 'Other'
};

export type Book = { slug: string; name: string; course: Exclude<Course, 'general'> };

const books = (course: Book['course'], names: string[]): Book[] =>
	names.map((name) => ({ name, course, slug: bookSlug(name) }));

export function bookSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/&/g, '-and-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** Books with a page. A book with few or no ideas still gets an honest page. */
export const BOOKS: Book[] = [
	...books('OT', [
		'Moses',
		'Abraham',
		'Genesis',
		'Exodus',
		'Numbers',
		'Deuteronomy',
		'Joshua',
		'Ruth',
		'2 Samuel',
		'Esther',
		'Job',
		'Psalms',
		'Isaiah',
		'Jeremiah'
	]),
	...books('NT', [
		'Matthew',
		'Luke',
		'John',
		'Corinthians',
		'Thessalonians',
		'Hebrews',
		'Revelation'
	]),
	...books('BoM', [
		'1 Nephi',
		'2 Nephi',
		'Enos',
		'Mosiah',
		'Helaman',
		'3 Nephi',
		'Mormon',
		'Ether',
		'Moroni'
	]),
	...books('D&C', ['D&C'])
];

export function findBook(slug: string): Book | undefined {
	return BOOKS.find((b) => b.slug === slug);
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);

/**
 * Keep only the display fields, whatever the server sends. Ideas without a
 * write-up (or a valid slug) return null: the site never shows a dead-end card.
 * Images are only kept with alt text and a root-relative or https URL.
 */
export function toWriteup(row: Record<string, unknown>): IdeaWriteup | null {
	const slug = str(row.slug);
	const bodyMd = str(row.body_md);
	if (!slug || !SLUG.test(slug) || !bodyMd) return null;
	const url = str(row.image_url);
	const alt = str(row.image_alt);
	const imageOk = !!url && !!alt && (url.startsWith('https://') || /^\/(?!\/)/.test(url));
	return {
		course: row.course as Course,
		book: String(row.book ?? ''),
		category: String(row.category ?? ''),
		title: String(row.title ?? ''),
		summary: String(row.summary ?? ''),
		slug,
		imageUrl: imageOk ? url : null,
		imageAlt: imageOk ? alt : null,
		bodyMd
	};
}

/** Card fields only (drops the body so list pages stay small). */
export function toIdea(w: IdeaWriteup): TeachingIdea {
	const { course, book, category, title, summary, slug, imageUrl, imageAlt } = w;
	return { course, book, category, title, summary, slug, imageUrl, imageAlt };
}

/** `?idea=` value, or '' if it isn't a valid slug. */
export function ideaParam(url: URL): string {
	const v = url.searchParams.get('idea') ?? '';
	return SLUG.test(v) && v.length <= 120 ? v : '';
}

/** `book` is a book slug from BOOKS (e.g. `genesis`, `d-and-c`). */
export type IdeaFilter = { course?: string; book?: string; category?: string; q?: string };

export function filterIdeas(ideas: TeachingIdea[], f: IdeaFilter): TeachingIdea[] {
	const q = f.q?.trim().toLowerCase();
	return ideas.filter(
		(i) =>
			(!f.course || i.course === f.course) &&
			(!f.book || (i.book !== 'general' && bookSlug(i.book) === f.book)) &&
			(!f.category || i.category === f.category) &&
			(!q || `${i.title} ${i.summary} ${i.book}`.toLowerCase().includes(q))
	);
}

export function ideasForBook(ideas: TeachingIdea[], book: Book): TeachingIdea[] {
	return ideas.filter((i) => i.course === book.course && i.book === book.name);
}

export type CategoryGroup = { category: string; label: string; ideas: TeachingIdea[] };

/** Group ideas by category in CATEGORY_LABELS order; unknown categories go last. */
export function groupByCategory(ideas: TeachingIdea[]): CategoryGroup[] {
	const order = Object.keys(CATEGORY_LABELS);
	const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : order.length);
	const groups = new Map<string, TeachingIdea[]>();
	for (const idea of ideas)
		groups.set(idea.category, [...(groups.get(idea.category) ?? []), idea]);
	return [...groups.entries()]
		.sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
		.map(([category, list]) => ({
			category,
			label: CATEGORY_LABELS[category] ?? category,
			ideas: list
		}));
}

/** Rhyme ideas stay off the mastery hub for now (Patrick, Stamp ask c4a34cd7). */
const RHYME = /\brhym/i;
const GAME_OR_MEMORY =
	/\b(game|games|memor\w*|race|relay|bingo|quiz|review|flash ?cards?|puzzle|match|challenge)\b/i;

export type MasteryCourse = {
	course: Course;
	label: string;
	games: TeachingIdea[];
	other: TeachingIdea[];
};

/**
 * Doctrinal mastery ideas grouped by year, each split into games and
 * memory helps first, then everything else. Years with no ideas are left out.
 */
export function masteryHub(ideas: TeachingIdea[]): MasteryCourse[] {
	const dm = ideas.filter(
		(i) => i.category === 'doctrinal_mastery' && !RHYME.test(`${i.title} ${i.summary}`)
	);
	const order: Course[] = ['OT', 'NT', 'BoM', 'D&C', 'general'];
	return order
		.map((course) => {
			const list = dm.filter((i) => i.course === course);
			const isGame = (i: TeachingIdea) => GAME_OR_MEMORY.test(`${i.title} ${i.summary}`);
			return {
				course,
				label: COURSE_LABELS[course],
				games: list.filter(isGame),
				other: list.filter((i) => !isGame(i))
			};
		})
		.filter((c) => c.games.length + c.other.length > 0);
}

export type FetchIdeasOptions = {
	url: string;
	anonKey: string;
	fetch?: typeof globalThis.fetch;
	timeoutMs?: number;
};

/** Never throws: unconfigured, unreachable or erroring Supabase returns []. Only ideas with a write-up. */
export async function fetchIdeas({
	url,
	anonKey,
	fetch = globalThis.fetch,
	timeoutMs = 2500
}: FetchIdeasOptions): Promise<IdeaWriteup[]> {
	if (!url || !anonKey) return [];
	try {
		const client = createClient(url, anonKey, {
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
			global: { fetch }
		});
		const { data, error } = await client
			.from('teaching_ideas')
			.select(COLUMNS)
			.not('body_md', 'is', null)
			.order('title')
			.abortSignal(AbortSignal.timeout(timeoutMs));
		if (error) {
			console.warn('[teachingIdeas] query failed:', error.message);
			return [];
		}
		return ((data ?? []) as Record<string, unknown>[])
			.map(toWriteup)
			.filter((i): i is IdeaWriteup => i !== null);
	} catch (err) {
		console.warn('[teachingIdeas] unreachable:', (err as Error).message);
		return [];
	}
}
