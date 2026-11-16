import { error } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { getIdea } from '$lib/server/teachingIdeas';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 3600 } };

export const load: PageServerLoad = async ({ params }) => {
	const idea = await getIdea(params.slug);
	if (!idea) error(404, 'No write-up for that idea yet.');
	return { idea };
};
