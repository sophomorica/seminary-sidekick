import type { Config } from '@sveltejs/adapter-vercel';
import { getIdea, listIdeas } from '$lib/server/teachingIdeas';
import {
	BOOKS,
	CATEGORY_LABELS,
	COURSE_LABELS,
	filterIdeas,
	findBook,
	ideaParam,
	ideasForBook
} from '$lib/teach/ideas';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = {
	isr: { expiration: 3600, allowQuery: ['course', 'book', 'category', 'q', 'page', 'idea'] }
};

const PAGE_SIZE = 24;

export const load: PageServerLoad = async ({ url }) => {
	const all = await listIdeas();
	const course = url.searchParams.get('course') ?? '';
	const book = findBook(url.searchParams.get('book') ?? '');
	const category = url.searchParams.get('category') ?? '';
	const q = (url.searchParams.get('q') ?? '').slice(0, 100);
	const filter = {
		course: course in COURSE_LABELS ? course : '',
		book: book?.slug ?? '',
		category: category in CATEGORY_LABELS ? category : '',
		q
	};
	const matches = filterIdeas(all, filter);
	const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
	const page = Math.min(pages, Math.max(1, Number(url.searchParams.get('page')) || 1));

	return {
		selected: await getIdea(ideaParam(url)),
		filter,
		total: all.length,
		matchCount: matches.length,
		page,
		pages,
		ideas: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		books: BOOKS.map((b) => ({ ...b, count: ideasForBook(all, b).length }))
	};
};
