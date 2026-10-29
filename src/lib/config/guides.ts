/**
 * Evergreen guide pages whose content lives in Supabase `public.posts` rows.
 * Code owns the route and SEO; the row owns the words (hub LANE_OVERLAP:
 * content publishes from data, never via PR).
 */
export const DOCTRINAL_MASTERY_GUIDE = {
	path: '/doctrinal-mastery',
	slug: 'doctrinal-mastery',
	seoTitle: 'Doctrinal Mastery for Parents: How to Help at Home | Seminary Sidekick'
} as const;

/** The parent guide keeps its original URL. Later guides live under /guides. */
export function guidePath(slug: string): string {
	if (slug === DOCTRINAL_MASTERY_GUIDE.slug) return DOCTRINAL_MASTERY_GUIDE.path;
	return `/guides/${slug}`;
}
