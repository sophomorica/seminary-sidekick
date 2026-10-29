import { getNews } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const prerender = false;

async function catalogLink(slug: string) {
	const post = await getNews(slug);
	if (!post) return null;
	return { title: post.title, slug: post.slug, excerpt: post.excerpt };
}

export const load: PageServerLoad = async () => {
	const [classPlayHelp, doctrinalMasteryTip] = await Promise.all([
		catalogLink('class-play-five-minute-warmup'),
		catalogLink('build-it-then-type-it-cold')
	]);
	return { classPlayHelp, doctrinalMasteryTip };
};
