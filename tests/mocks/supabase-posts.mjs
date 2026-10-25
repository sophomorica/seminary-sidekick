/**
 * Mock Supabase REST (PostgREST) for the E2E dev server.
 *
 * playwright.config.ts starts this and points PUBLIC_SUPABASE_URL at it, so
 * /news, /news/[slug], RSS, sitemap and the homepage read these rows through
 * the real server code path.
 *
 * It deliberately ignores query filters and RLS: it returns drafts, future
 * schedules and future-dated published rows too, so the tests prove the
 * site's own isLive() filter keeps them off the page.
 *
 * Dates are relative to "now" so the fixtures never expire.
 */

import { createServer } from 'node:http';

export const PORT = Number(process.env.SUPABASE_MOCK_PORT ?? 54329);

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function rows() {
	const now = Date.now();
	const iso = (ms) => new Date(ms).toISOString();
	const base = {
		body_md: 'Body.',
		hero_image_url: null,
		hero_image_alt: null,
		tags: [],
		publish_at: null
	};
	return [
		{
			...base,
			slug: 'posted-from-supabase',
			title: 'Posted from Supabase',
			summary: 'A live row from the posts table.',
			body_md:
				'## A heading from markdown\n\nRead the [Scripture Builder printouts](/teachers/printouts).',
			hero_image_url: '/images/news/news-10min-review-2026-10-27.jpg',
			hero_image_alt: 'Mock hero image',
			tags: ['parents'],
			status: 'published',
			publish_at: iso(now - 2 * HOUR),
			published_at: iso(now - HOUR)
		},
		{
			...base,
			slug: 'doctrinal-mastery-a-parents-guide',
			title: "Doctrinal mastery: a parent's guide",
			summary: "A parent's guide to the 100 doctrinal mastery scriptures.",
			body_md: '## What is doctrinal mastery?\n\nThe list of 100 scripture passages.',
			tags: ['parents'],
			status: 'published',
			publish_at: iso(now - 3 * HOUR),
			published_at: iso(now - 3 * HOUR)
		},
		{
			...base,
			slug: 'supabase-draft-post',
			title: 'Supabase draft post',
			summary: 'Not ready.',
			status: 'draft',
			published_at: null
		},
		{
			...base,
			slug: 'supabase-scheduled-future-post',
			title: 'Supabase scheduled future post',
			summary: 'Goes live next week.',
			status: 'scheduled',
			publish_at: iso(now + 7 * DAY),
			published_at: null
		},
		{
			...base,
			slug: 'supabase-future-published-post',
			title: 'Supabase future published post',
			summary: 'Published flag set, but the time has not come.',
			status: 'published',
			published_at: iso(now + 7 * DAY)
		},
		{
			...base,
			slug: 'two-quiet-minutes-of-flips',
			title: 'Shadow title from Supabase',
			summary: 'Collides with a .svx slug; the .svx post must win.',
			status: 'published',
			published_at: iso(now - DAY)
		}
	];
}

createServer((req, res) => {
	if (req.method === 'GET' && req.url?.startsWith('/rest/v1/posts')) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(rows()));
		return;
	}
	if (req.url === '/health') {
		res.writeHead(200).end('ok');
		return;
	}
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ message: `mock: no route for ${req.method} ${req.url}` }));
}).listen(PORT, '127.0.0.1', () => {
	console.log(`[supabase-mock] listening on http://127.0.0.1:${PORT}`);
});
