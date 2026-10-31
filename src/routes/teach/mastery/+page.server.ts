import type { Config } from '@sveltejs/adapter-vercel';
import { listIdeas } from '$lib/server/teachingIdeas';
import { masteryHub } from '$lib/teach/ideas';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const config: Config = { isr: { expiration: 3600 } };

export const load: PageServerLoad = async () => {
	const all = await listIdeas();
	const courses = masteryHub(all);
	const count = courses.reduce((n, c) => n + c.games.length + c.other.length, 0);
	return { courses, count, loaded: all.length > 0 };
};
