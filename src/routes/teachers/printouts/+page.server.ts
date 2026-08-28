import { FIRST_OT_UNIT_SLUG, thisWeekPin } from '$lib/scripture-builder/thisWeek';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const thisWeek = thisWeekPin();
	return {
		thisWeek,
		defaultSlug: thisWeek.slugs[0] ?? FIRST_OT_UNIT_SLUG
	};
};
