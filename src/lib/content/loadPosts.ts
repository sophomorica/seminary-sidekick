/**
 * Post loader — reads every .svx file in src/content/news/ at build time
 * via Vite's import.meta.glob, validates frontmatter, returns typed posts.
 *
 * Used by:
 *  - src/routes/news/+page.ts          (index listing)
 *  - src/routes/news/[slug]/+page.ts   (single-post route + prerender entries)
 *  - src/lib/components/sections/NewsPreview.svelte (homepage strip — TASK-B-014)
 */

import type { Component } from 'svelte';
import { newsPostSchema, type NewsPostFrontmatter } from './schema';

export type LoadedPost = NewsPostFrontmatter & {
	/** The Svelte component (default export from mdsvex) — render with `<svelte:component this={post.component} />` */
	component: Component;
	/** Original file path, useful for debugging. */
	path: string;
};

// Eagerly import all .svx files so we can validate at startup.
// Vite handles this at build time — no runtime FS access needed.
const modules = import.meta.glob<{ default: Component; metadata: unknown }>(
	'/src/content/news/*.svx',
	{ eager: true }
);

let cached: LoadedPost[] | null = null;

/**
 * Returns all valid published posts, sorted by date desc.
 * Posts marked `draft: true` are excluded.
 * Invalid frontmatter is logged and skipped (won't break the build).
 */
export function loadPosts(): LoadedPost[] {
	if (cached) return cached;

	const posts: LoadedPost[] = [];

	for (const [path, mod] of Object.entries(modules)) {
		const parsed = newsPostSchema.safeParse(mod.metadata);
		if (!parsed.success) {
			console.warn(`[loadPosts] Invalid frontmatter in ${path}:`, parsed.error.flatten());
			continue;
		}
		if (parsed.data.draft) continue;
		posts.push({ ...parsed.data, component: mod.default, path });
	}

	cached = posts.sort((a, b) => b.date.localeCompare(a.date));
	return cached;
}

/** Returns a single post by slug, or null if not found. */
export function loadPost(slug: string): LoadedPost | null {
	return loadPosts().find((p) => p.slug === slug) ?? null;
}

/** Slugs for SvelteKit prerender entries(). */
export function listSlugs(): string[] {
	return loadPosts().map((p) => p.slug);
}
