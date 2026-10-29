-- News and guides publish from one table.
-- A row is public when status = 'published' and publish_at <= now().
-- No cron job flips status. The read itself is the schedule.
--
-- Fresh databases create the final table. Databases that already ran
-- 20261024120000_posts.sql are reshaped in place, including the two
-- published rows (the parent guide and the 27 October review).
-- Do not apply this file from a pull request. Run it in the SQL editor
-- before the matching site deploy.

create table if not exists public.posts (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	kind text not null default 'news' check (kind in ('news', 'guide')),
	title text not null check (length(title) > 0),
	description text not null check (length(description) > 0),
	body_md text not null default '',
	image_url text,
	publish_at timestamptz not null,
	status text not null default 'draft' check (status in ('draft', 'published')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

do $$
begin
	if exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'posts' and column_name = 'summary'
	) then
		alter table public.posts rename column summary to description;
	end if;

	if exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'posts' and column_name = 'hero_image_url'
	) then
		alter table public.posts rename column hero_image_url to image_url;
	end if;
end $$;

alter table public.posts add column if not exists kind text;
update public.posts set kind = 'news' where kind is null;
alter table public.posts alter column kind set default 'news';
alter table public.posts alter column kind set not null;

alter table public.posts drop constraint if exists posts_kind_check;
alter table public.posts add constraint posts_kind_check check (kind in ('news', 'guide'));

do $$
begin
	if exists (
		select 1 from information_schema.columns
		where table_schema = 'public' and table_name = 'posts' and column_name = 'published_at'
	) then
		update public.posts
		set publish_at = coalesce(publish_at, published_at, created_at)
		where publish_at is null;
	end if;
end $$;

alter table public.posts alter column publish_at set not null;

update public.posts set status = 'published' where status = 'scheduled';

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts drop constraint if exists posts_scheduled_needs_publish_at;
alter table public.posts drop constraint if exists posts_published_needs_published_at;
alter table public.posts add constraint posts_status_check check (status in ('draft', 'published'));

update public.posts
set kind = 'guide', slug = 'doctrinal-mastery'
where slug in ('doctrinal-mastery-a-parents-guide', 'doctrinal-mastery');

alter table public.posts drop column if exists tags;
alter table public.posts drop column if exists hero_image_alt;
alter table public.posts drop column if exists published_at;

comment on table public.posts is
	'Site news and guides. Anon can select a row only when status is published and publish_at has passed.';

create index if not exists posts_visible_idx
	on public.posts (kind, publish_at desc)
	where status = 'published';

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

do $$
begin
	if not exists (select 1 from pg_roles where rolname = 'anon') then
		create role anon nologin;
	end if;
	if not exists (select 1 from pg_roles where rolname = 'authenticated') then
		create role authenticated nologin;
	end if;
end $$;

alter table public.posts enable row level security;
alter table public.posts force row level security;

drop policy if exists "Live posts are readable" on public.posts;
drop policy if exists posts_select_published on public.posts;
create policy posts_select_published
	on public.posts
	for select
	to anon, authenticated
	using (status = 'published' and publish_at <= now());

revoke all on table public.posts from anon, authenticated;
grant select on table public.posts to anon, authenticated;

do $$
begin
	if exists (select 1 from pg_namespace where nspname = 'cron') then
		perform cron.unschedule('publish-scheduled-posts');
	end if;
exception
	when others then
		null;
end $$;

drop function if exists public.publish_due_posts();

do $$
begin
	if exists (select 1 from pg_namespace where nspname = 'storage') then
		insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
		values (
			'post-images',
			'post-images',
			true,
			5242880,
			array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
		)
		on conflict (id) do update
		set public = excluded.public,
			file_size_limit = excluded.file_size_limit,
			allowed_mime_types = excluded.allowed_mime_types;

		drop policy if exists post_images_public_read on storage.objects;
		create policy post_images_public_read
			on storage.objects
			for select
			to anon, authenticated
			using (bucket_id = 'post-images');
	end if;
end $$;
