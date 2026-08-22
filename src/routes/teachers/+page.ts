import { loadPost } from '$lib/content/loadPosts';
import type { PageLoad } from './$types';

export const prerender = true;

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
