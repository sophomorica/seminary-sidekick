-- Full write-ups for teaching ideas (Patrick, Stamp ask c4a34cd7: "full page preview").
--
-- Adds a URL slug, an original how-to in markdown, and an optional illustration.
-- The site lists only ideas that have a write-up; one-line summaries without one
-- stay hidden. Content is written in our own words and loaded by
-- scripts/seed-teaching-writeups.mjs from a private file that never enters git.
-- Do not apply to production until Patrick approves.

alter table public.teaching_ideas
	add column if not exists slug text,
	add column if not exists body_md text,
	add column if not exists image_url text,
	add column if not exists image_alt text;

alter table public.teaching_ideas
	drop constraint if exists teaching_ideas_slug_format,
	add constraint teaching_ideas_slug_format check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	drop constraint if exists teaching_ideas_writeup_needs_slug,
	add constraint teaching_ideas_writeup_needs_slug check (body_md is null or slug is not null),
	drop constraint if exists teaching_ideas_image_needs_alt,
	add constraint teaching_ideas_image_needs_alt check (image_url is null or length(image_alt) > 0);

create unique index if not exists teaching_ideas_slug_key on public.teaching_ideas (slug);

comment on column public.teaching_ideas.body_md is
	'Original how-to in markdown: what it is, scripture/doctrine, prep time, materials, steps, discussion questions, tip.';

grant select (slug, body_md, image_url, image_alt)
	on public.teaching_ideas to anon, authenticated;
