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
};

export const COLUMNS = 'course,book,category,title,summary';

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

/** Keep only the display fields, whatever the server sends. */
export function toIdea(row: Record<string, unknown>): TeachingIdea {
	return {
		course: row.course as Course,
		book: String(row.book ?? ''),
		category: String(row.category ?? ''),
		title: String(row.title ?? ''),
		summary: String(row.summary ?? '')
	};
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

export type FetchIdeasOptions = {
	url: string;
	anonKey: string;
	fetch?: typeof globalThis.fetch;
	timeoutMs?: number;
};

/** Never throws: unconfigured, unreachable or erroring Supabase returns []. */
export async function fetchIdeas({
	url,
	anonKey,
	fetch = globalThis.fetch,
	timeoutMs = 2500
}: FetchIdeasOptions): Promise<TeachingIdea[]> {
	if (!url || !anonKey) return [];
	try {
		const client = createClient(url, anonKey, {
			auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
			global: { fetch }
		});
		const { data, error } = await client
			.from('teaching_ideas')
			.select(COLUMNS)
			.order('title')
			.abortSignal(AbortSignal.timeout(timeoutMs));
		if (error) {
			console.warn('[teachingIdeas] query failed:', error.message);
			return [];
		}
		return ((data ?? []) as Record<string, unknown>[]).map(toIdea);
	} catch (err) {
		console.warn('[teachingIdeas] unreachable:', (err as Error).message);
		return [];
	}
}
