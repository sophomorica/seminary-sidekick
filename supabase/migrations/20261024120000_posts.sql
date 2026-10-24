-- News posts table + scheduled publish.
--
-- Content posts live here instead of shipping as .svx files in PRs.
-- The site reads rows server-side with the anon key; RLS limits anon to
-- rows that are published and whose published_at has passed. Writes go
-- through the Supabase dashboard / SQL editor (service role), never the site.
--
-- Scheduling: set status = 'scheduled' and publish_at. pg_cron runs
-- public.publish_due_posts() every 5 minutes, which flips due rows to
-- 'published' with published_at = now().

create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique
		check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	title text not null check (length(title) > 0),
	summary text not null check (length(summary) > 0),
	body_md text not null default '',
	hero_image_url text,
	hero_image_alt text,
	tags text[] not null default '{}',
	status text not null default 'draft'
		check (status in ('draft', 'scheduled', 'published')),
	publish_at timestamptz,
	published_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint posts_scheduled_needs_publish_at
		check (status <> 'scheduled' or publish_at is not null),
	constraint posts_published_needs_published_at
		check (status <> 'published' or published_at is not null)
);

comment on table public.posts is
	'News posts for seminarysidekick.com/news. Anon sees only published rows with published_at <= now().';

create index if not exists posts_live_idx
	on public.posts (published_at desc)
	where status = 'published';

create index if not exists posts_due_idx
	on public.posts (publish_at)
	where status = 'scheduled';

-- updated_at bookkeeping
create or replace function public.posts_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	new.updated_at := now();
	return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
	before update on public.posts
	for each row execute function public.posts_set_updated_at();

-- RLS: read-only, live rows only. No insert/update/delete policies exist,
-- so anon and authenticated cannot write even if a grant slips in.
alter table public.posts enable row level security;

drop policy if exists "Live posts are readable" on public.posts;
create policy "Live posts are readable"
	on public.posts
	for select
	to anon, authenticated
	using (status = 'published' and published_at <= now());

revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;

-- Scheduled publish
create or replace function public.publish_due_posts()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
	n integer;
begin
	update public.posts
	set status = 'published',
		published_at = now()
	where status = 'scheduled'
		and publish_at <= now();
	get diagnostics n = row_count;
	return n;
end;
$$;

revoke all on function public.publish_due_posts() from public, anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;

-- cron.schedule with a job name replaces an existing job of the same name,
-- so re-running this migration is safe.
select cron.schedule(
	'publish-scheduled-posts',
	'*/5 * * * *',
	$$ select public.publish_due_posts(); $$
);
