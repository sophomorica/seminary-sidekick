-- Teaching ideas for /teach and /teach/[book].
--
-- Private catalog: rows are original one-paragraph summaries, loaded by
-- scripts/seed-teaching-ideas.mjs from a CSV that never enters git.
-- The site reads them server-side with the anon key. Anon can select only
-- the five display columns; id and source_ref are not granted, so they can
-- never reach the site or a direct REST call with the anon key.
-- Writes go through the SQL editor / service role only.
-- Approved as a backend exception by Patrick 2026-10-30 (Stamp ask c4a34cd7).

create table if not exists public.teaching_ideas (
	id bigint generated always as identity primary key,
	source_ref text not null unique,
	course text not null check (course in ('general', 'OT', 'NT', 'BoM', 'D&C')),
	book text not null check (length(book) > 0),
	category text not null check (length(category) > 0),
	title text not null check (length(title) > 0),
	summary text not null check (length(summary) > 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.teaching_ideas is
	'Original teaching-idea summaries for seminarysidekick.com/teach. Anon reads display columns only.';
comment on column public.teaching_ideas.source_ref is
	'Private catalog key. Never granted to anon/authenticated.';

create index if not exists teaching_ideas_book_idx on public.teaching_ideas (course, book);

alter table public.teaching_ideas enable row level security;

drop policy if exists "Teaching ideas are readable" on public.teaching_ideas;
create policy "Teaching ideas are readable"
	on public.teaching_ideas
	for select
	to anon, authenticated
	using (true);

-- Column-level grant: only what the pages show. No insert/update/delete.
revoke all on public.teaching_ideas from anon, authenticated;
grant select (course, book, category, title, summary)
	on public.teaching_ideas to anon, authenticated;
