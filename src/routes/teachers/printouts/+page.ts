import { FIRST_OT_UNIT_SLUG, thisWeekPin } from '$lib/scripture-builder/thisWeek';
import type { PageLoad } from './$types';

/** Request-time so the this-week pin is not frozen at the last build. */
export const prerender = false;

export const load: PageLoad = () => {
	const thisWeek = thisWeekPin();
	return {
		thisWeek,
		defaultSlug: thisWeek.slugs[0] ?? FIRST_OT_UNIT_SLUG
	};
};
