/** Shared CDN ceiling. A scheduled post is at most 15 minutes late. */
export const contentCache = {
	'cache-control': 'public, max-age=0, s-maxage=900'
} as const;
