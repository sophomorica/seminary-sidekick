/**
 * Root load function.
 *
 * Currently a passthrough — runs on every route. Will gain auth-state
 * loading in Tier 3 when Supabase Auth ships.
 *
 * Prerender is set per-route on the static stubs. We don't enable it
 * globally because `/news/[slug]` is dynamic and needs entry discovery
 * (handled in TASK-006).
 */

export const trailingSlash = 'never';
