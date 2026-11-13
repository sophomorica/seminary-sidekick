/** Same page, with `?idea=<slug>` set (or removed when slug is ''). Keeps other filters. */
export function withIdea(url: URL, slug: string): string {
	const next = new URL(url);
	if (slug) next.searchParams.set('idea', slug);
	else next.searchParams.delete('idea');
	const qs = next.searchParams.toString();
	return `${next.pathname}${qs ? `?${qs}` : ''}`;
}
