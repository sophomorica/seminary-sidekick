import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '$lib/config/site';
import { contentCache } from '$lib/server/contentCache';
import { listNews } from '$lib/server/posts';

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatPubDate(dateStr: string): string {
	const d = new Date(`${dateStr}T12:00:00Z`);
	return d.toUTCString();
}

export const prerender = false;

export async function GET({
	setHeaders
}: {
	setHeaders: (headers: Record<string, string>) => void;
}) {
	setHeaders(contentCache);
	const posts = await listNews();
	const lastBuild = posts.length > 0 ? formatPubDate(posts[0].date) : new Date().toUTCString();

	let itemsXml = '';
	for (const post of posts) {
		const pub = formatPubDate(post.date);
		const link = `${SITE_URL}/news/${post.slug}`;
		itemsXml += `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${link}</link>
			<description>${escapeXml(post.excerpt)}</description>
			<pubDate>${pub}</pubDate>
			<guid isPermaLink="true">${link}</guid>
			<author>Patrick &lt;${CONTACT_EMAIL}&gt;</author>
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
			...contentCache
		}
	});
}
