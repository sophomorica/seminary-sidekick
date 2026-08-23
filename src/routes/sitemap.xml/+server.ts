import { loadPosts } from '$lib/content/loadPosts';
import { SITE_URL } from '$lib/config/site';

/**
 * Sitemap 0.9 — auto-generated from the route list + news posts.
 *
 * Access at: /sitemap.xml
 * Referenced from: static/robots.txt
 *
 * Static routes are listed here explicitly so the sitemap doesn't have to
 * crawl the filesystem at request time. Add or remove a public route?
 * Update STATIC_ROUTES below. News posts come from loadPosts() so they
 * stay in sync with src/content/news/*.svx without a second source of truth.
 */

type SitemapEntry = {
	loc: string;
	lastmod: string; // ISO date (YYYY-MM-DD)
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority: string; // 0.0–1.0
};

// Build time — same value for every static route so lastmod is stable per deploy.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES: ReadonlyArray<Omit<SitemapEntry, 'loc'> & { path: string }> = [
	{ path: '/', changefreq: 'weekly', priority: '1.0', lastmod: BUILD_DATE },
	{ path: '/apps', changefreq: 'monthly', priority: '0.8', lastmod: BUILD_DATE },
	{
		path: '/apps/scripture-mastery',
		changefreq: 'monthly',
		priority: '0.8',
		lastmod: BUILD_DATE
	},
	{ path: '/quick-quiz', changefreq: 'monthly', priority: '0.9', lastmod: BUILD_DATE },
	{ path: '/scripture-match', changefreq: 'monthly', priority: '0.9', lastmod: BUILD_DATE },
	{ path: '/premium', changefreq: 'monthly', priority: '0.9', lastmod: BUILD_DATE },
	{ path: '/for-teachers', changefreq: 'monthly', priority: '0.8', lastmod: BUILD_DATE },
	{ path: '/teachers', changefreq: 'weekly', priority: '0.8', lastmod: BUILD_DATE },
	{ path: '/news', changefreq: 'weekly', priority: '0.7', lastmod: BUILD_DATE },
	{ path: '/about', changefreq: 'yearly', priority: '0.5', lastmod: BUILD_DATE },
	{ path: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: BUILD_DATE },
	{ path: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: BUILD_DATE },
	{ path: '/contact', changefreq: 'yearly', priority: '0.4', lastmod: BUILD_DATE }
];

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function renderEntry(entry: SitemapEntry): string {
	return `\t<url>
\t\t<loc>${escapeXml(entry.loc)}</loc>
\t\t<lastmod>${entry.lastmod}</lastmod>
\t\t<changefreq>${entry.changefreq}</changefreq>
\t\t<priority>${entry.priority}</priority>
\t</url>`;
}

export const prerender = true;

export function GET() {
	const entries: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
		loc: `${SITE_URL}${route.path}`,
		lastmod: route.lastmod,
		changefreq: route.changefreq,
		priority: route.priority
	}));

	// Append every published news post.
	for (const post of loadPosts()) {
		entries.push({
			loc: `${SITE_URL}/news/${post.slug}`,
			lastmod: post.date,
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderEntry).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
}
