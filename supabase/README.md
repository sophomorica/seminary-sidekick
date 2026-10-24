# Supabase — news posts

News posts publish from the `public.posts` table. Code ships in PRs; posts do not.

## Apply (once)

1. Run `migrations/20261024120000_posts.sql` in the Supabase SQL editor (or `supabase db push`).
   It creates `public.posts`, read-only RLS for anon, `public.publish_due_posts()`, and a
   pg_cron job `publish-scheduled-posts` every 5 minutes.
2. Run `seed/20261024_posts_seed.sql` to schedule the parent guide and the 10-minute home
   review for 2026-10-27 (former PRs #33 and #34).
3. Make sure Vercel has `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` (already used
   by `/join`). The site never uses the service role key.

If `create extension pg_cron` fails, enable **pg_cron** under Database → Extensions and
re-run the last block of the migration. Fallback without pg_cron: a scheduled Edge Function
that calls `select public.publish_due_posts();` every 5 minutes.

## Write a post

Insert a row with `status = 'scheduled'` and `publish_at`, or `status = 'draft'` while
writing. `body_md` is Markdown. `hero_image_url` is an absolute URL or a site path such as
`/images/news/...` (Supabase Storage public URLs work too); set `hero_image_alt` with it.

Check a schedule:

```sql
select slug, status, publish_at, published_at from public.posts order by coalesce(publish_at, created_at) desc;
select * from cron.job_run_details order by start_time desc limit 5;
```

## How the site reads it

`src/lib/server/posts.ts` merges live rows with `src/content/news/*.svx` (a `.svx` post wins
a slug collision). `/news`, `/news/[slug]`, RSS and the sitemap render per request with Vercel
ISR (5 minutes); the homepage strip is SSR. Rows are cached per instance for 60 seconds. If
Supabase is unreachable the site shows the `.svx` posts only. A scheduled post goes live at
most ~11 minutes after `publish_at` (cron tick + cache + ISR).
