/**
 * Evergreen guide pages whose content lives in Supabase `public.posts` rows.
 * Code owns the route and SEO; the row owns the words (hub LANE_OVERLAP:
 * content publishes from data, never via PR).
 */
export const DOCTRINAL_MASTERY_GUIDE = {
	path: '/doctrinal-mastery',
	slug: 'doctrinal-mastery-a-parents-guide',
	seoTitle: 'Doctrinal Mastery for Parents: How to Help at Home | Seminary Sidekick'
} as const;
