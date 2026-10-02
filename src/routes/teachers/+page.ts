import { loadPost } from '$lib/content/loadPosts';
import type { PageLoad } from './$types';

/** Request-time so a shared `?view=today` or `?view=week` link renders that tab, not Mix. */
export const prerender = false;

function catalogLink(slug: string) {
	const post = loadPost(slug);
	if (!post) return null;
	return { title: post.title, slug: post.slug, excerpt: post.excerpt };
}

export const load: PageLoad = () => {
	return {
		classPlayHelp: catalogLink('class-play-five-minute-warmup'),
		doctrinalMasteryTip: catalogLink('build-it-then-type-it-cold')
	};
};
