/**
 * Server-only access to public.teaching_ideas for /teach and /teach/[book].
 * Uses the anon key; RLS + a column grant limit it to display fields.
 * Cached per server instance for 10 minutes.
 */

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$lib/config/supabase';
import { fetchIdeas, type TeachingIdea } from '$lib/teach/ideas';

const CACHE_MS = 10 * 60_000;
let cache: { at: number; ideas: TeachingIdea[] } | null = null;

export async function listIdeas(): Promise<TeachingIdea[]> {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.ideas;
	const ideas = await fetchIdeas({ url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY });
	if (ideas.length) cache = { at: Date.now(), ideas };
	return ideas;
}
