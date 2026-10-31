import type { Config } from '@sveltejs/adapter-vercel';
import { getIdea, listIdeas } from '$lib/server/teachingIdeas';
import { ideaParam, masteryHub } from '$lib/teach/ideas';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 3600 } };

export const load: PageServerLoad = async ({ url }) => {
	const all = await listIdeas();
	const courses = masteryHub(all);
	const count = courses.reduce((n, c) => n + c.games.length + c.other.length, 0);
	return { selected: await getIdea(ideaParam(url)), courses, count, loaded: all.length > 0 };
};
