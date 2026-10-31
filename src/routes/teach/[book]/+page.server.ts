import { error } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { listIdeas } from '$lib/server/teachingIdeas';
import { findBook, groupByCategory, ideasForBook } from '$lib/teach/ideas';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 3600 } };

export const load: PageServerLoad = async ({ params }) => {
	const book = findBook(params.book);
	if (!book) error(404, 'No page for that book yet.');
	const all = await listIdeas();
	const forBook = ideasForBook(all, book);
	const yearWide = all
		.filter((i) => i.course === book.course && i.book === 'general')
		.slice(0, 6);
	return {
		book,
		ideas: forBook,
		groups: groupByCategory(forBook),
		yearWide,
		loaded: all.length > 0
	};
};
