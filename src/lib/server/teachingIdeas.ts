/**
 * Server-only access to public.teaching_ideas for the /teach pages.
 * Uses the anon key; RLS + a column grant limit it to display fields.
 * Only ideas with a full write-up are listed. Cached per server instance for 10 minutes.
 */

import { marked } from 'marked';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$lib/config/supabase';
import { fetchIdeas, toIdea, type IdeaWriteup, type TeachingIdea } from '$lib/teach/ideas';

const CACHE_MS = 10 * 60_000;
let cache: { at: number; ideas: TeachingIdea[]; bySlug: Map<string, IdeaWriteup> } | null = null;

async function load() {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache;
	const full = await fetchIdeas({ url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY });
	const next = {
		at: Date.now(),
		ideas: full.map(toIdea),
		bySlug: new Map(full.map((i) => [i.slug, i]))
	};
	if (full.length) cache = next;
	return next;
}

export async function listIdeas(): Promise<TeachingIdea[]> {
	return (await load()).ideas;
}

export type IdeaDetail = TeachingIdea & { html: string };

/** Full write-up rendered to HTML (our own trusted markdown), or null. */
export async function getIdea(slug: string): Promise<IdeaDetail | null> {
	if (!slug) return null;
	const idea = (await load()).bySlug.get(slug);
	if (!idea) return null;
	const { bodyMd, ...rest } = idea;
	return { ...rest, html: marked.parse(bodyMd, { async: false }) };
}
