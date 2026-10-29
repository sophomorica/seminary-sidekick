/**
 * Request-time visibility. RLS on public.posts uses the same predicate
 * with now() instead of the bound timestamp.
 */
export const VISIBLE_POSTS_SQL = `
select slug, kind, title, description, body_md, image_url, publish_at
from public.posts
where kind = $1
	and status = 'published'
	and publish_at <= $2
order by publish_at desc, slug asc
`;
