import type { Config } from '@sveltejs/adapter-vercel';
import { listPublishedPosts } from '$lib/server/posts';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '$lib/config/site';

/**
 * RSS 2.0 feed for the news blog.
 * Generated at request time from listPublishedPosts() (.svx + live Supabase posts).
 * Valid, standards-friendly XML (with Atom self-link for good feed readers).
 *
 * Access at: /news/rss.xml
 * Empty feed (no items) is perfectly valid when there are no posts.
 */

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatPubDate(dateStr: string): string {
	// Use local noon UTC to keep dates stable regardless of server TZ
	const d = new Date(`${dateStr}T12:00:00Z`);
	return d.toUTCString();
}

export const prerender = false;
export const config: Config = { isr: { expiration: 300 } };

export async function GET() {
	const posts = await listPublishedPosts();

	const lastBuild = posts.length > 0 ? formatPubDate(posts[0].date) : new Date().toUTCString();

	let itemsXml = '';
	for (const post of posts) {
		const pub = formatPubDate(post.date);
		const link = `${SITE_URL}/news/${post.slug}`;
		const categories = post.tags
			.map((tag) => `<category>${escapeXml(tag)}</category>`)
			.join('');

		itemsXml += `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${link}</link>
			<description>${escapeXml(post.excerpt)}</description>
			<pubDate>${pub}</pubDate>
			<guid isPermaLink="true">${link}</guid>
			<author>${escapeXml(post.author)} &lt;${CONTACT_EMAIL}&gt;</author>
			${categories}
		</item>`;
	}

	const channelTitle = `${escapeXml(SITE_NAME)} — News &amp; Devotionals`;
	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${channelTitle}</title>
		<link>${SITE_URL}/news</link>
		<description>Release notes, devotionals, teacher tips, and behind-the-scenes updates from the Seminary Sidekick team.</description>
		<language>en-us</language>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		<atom:link href="${SITE_URL}/news/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
	</channel>
</rss>`.trim();

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
}
