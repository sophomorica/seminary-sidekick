# Supabase — news and guides

Posts and guides publish from `public.posts`. A row is on the site when `status` is `published` and `publish_at` is in the past. Nothing in the site flips that status. Set `publish_at` and the next request after the cache window shows the page.

The cache ceiling is 15 minutes (`s-maxage=900`) on `/news`, a post, a guide, RSS, the sitemap, and the homepage strip.

## Apply

Do this in the Supabase SQL editor for project `feqxdylouvoulhqwsffp`. Do not apply it from CI.

1. `migrations/20261024120000_posts.sql` if it has not been applied yet.
2. `migrations/20261029160000_posts_content_model.sql`. This reshapes the table, turns the parent guide into `kind = 'guide'` at slug `doctrinal-mastery`, drops the cron publisher, and creates the public-read `post-images` bucket. Anon can select visible rows and cannot write.
3. `seed/20261029_posts_content.sql`. This upserts the thirteen published news posts, the parent guide, and the 27 October review. The review's `publish_at` is 08:00 America/New_York on 2026-10-27. The guide is 07:00 the same morning.

Upload `static/images/news/news-10min-review-2026-10-27.jpg` to the `post-images` bucket when you want the production image served from storage. The seed stores the site path `/images/news/news-10min-review-2026-10-27.jpg`, which the deployed site serves from `static/`.

Vercel already has `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` for `/join`. The site uses those to read posts. It does not use a service role key and it does not read `DATABASE_URL`.

## Local and tests

`POSTS_LOCAL=1` loads the migration and the seed into PGLite. Playwright sets that, plus `POSTS_E2E_FIXTURES=1` for a live row, a draft, and two future rows. Those fixtures are not in the seed file.
