-- Seed: the two content PRs that used to ship as code.
--   PR #33 "feat(doctrinal-mastery): add the parent guide"  → doctrinal-mastery-a-parents-guide
--   PR #34 "feat(news): add the 27 October home review"     → a-10-minute-weekly-scripture-review-you-can-do-at-home
--
-- Run after 20261024120000_posts.sql, in the Supabase SQL editor (service role).
-- Upserts on slug, so it is safe to re-run; re-running resets status to 'scheduled'
-- only for rows that are not yet published.
--
-- Both rows are scheduled for Tuesday 2026-10-27 (America/Denver, MDT = UTC-6).
-- The parent guide goes first because the home review links to it.
-- pg_cron flips each row to 'published' within 5 minutes of publish_at.
--
-- hero_image_url points at the image committed in static/images/news/,
-- served from the site origin.

insert into public.posts
	(slug, title, summary, body_md, hero_image_url, hero_image_alt, tags, status, publish_at)
values
(
	'doctrinal-mastery-a-parents-guide',
	'Doctrinal mastery: a parent''s guide',
	'A parent''s guide to the 100 doctrinal mastery scriptures: what they are, how they''re split across the four books, and a 10-minute weekly routine to practice at home.',
	$md$
If your teen is in seminary, you've probably heard "doctrinal mastery." Here's what it means in plain terms, and a simple way to help at home without turning it into a chore.

## What is doctrinal mastery?

Doctrinal mastery is the list of 100 scripture passages seminary students learn over four years. It's split across the four books of scripture:

- Old Testament: 24
- New Testament: 24
- Book of Mormon: 24
- Doctrine and Covenants: 28

Students learn the reference, the key words, and eventually the passage itself.

## Why memorizing is hard (and what helps)

Recognizing a verse isn't the same as knowing it. Most people can pick the right answer from four choices long before they could say it from memory. What helps is short, regular practice that gets a little harder each time: read it, rebuild it, then say or type it without help.

## A 10-minute weekly routine for home

1. **Pick one passage** for the week. Let your teen choose.
2. **Read it aloud together** once, early in the week.
3. **Rebuild it** mid-week: write the words on scraps of paper, shuffle them, and put them back in order.
4. **Prove it** at the end of the week: say or write it with only the first letter of each word as a hint, then with no hints.
5. **Review last week's passage** for one minute before starting the next.

## Where Seminary Sidekick fits

Seminary Sidekick follows the same steps, Study → Build → Prove → Master:

- **Study:** read the passage and hear it aloud.
- **Build:** drag word tiles back into order.
- **Prove:** type it with first-letter hints, then with no prompts.
- **Master:** daily review keeps it fresh.

All 100 passages are in the app from day one. It's free to start, needs no account, and works offline. Flashcards are included for quick recognition practice.

Get it on the [App Store](https://apps.apple.com/us/app/seminary-sidekick/id6780003239) or [Google Play](https://play.google.com/store/apps/details?id=com.seminarysidekick.app).

## Questions parents ask

**Do we need an account?** No. You can start without one.

**Does it cost anything?** The app is free to start. Premium is optional ($4.99/month or $34.99/year).

**Does it work without internet?** Yes.

*Seminary Sidekick is an independent app made by Narrow Road Studios LLC. It is not made, sponsored, or endorsed by any church.*
$md$,
	null,
	null,
	array['parents', 'doctrinal-mastery'],
	'scheduled',
	'2026-10-27 05:00:00-06'
),
(
	'a-10-minute-weekly-scripture-review-you-can-do-at-home',
	'A 10-minute weekly scripture review you can do at home',
	'Most of us can recognize a verse long before we can say it.',
	$md$
Most of us can recognize a verse long before we can say it. That's normal. Recognition comes first, recall comes later, and recall only comes with practice.

Here's a routine that takes about 10 minutes a week:

- **Early in the week:** pick one doctrinal mastery passage and read it aloud together.
- **Mid-week:** rebuild it. Write the words on scraps of paper, shuffle them, and put them back in order.
- **End of the week:** say or write it with first-letter hints, then without any.
- **Before the next one:** one minute reviewing last week's passage.

That's the same Study → Build → Prove → Master path Seminary Sidekick uses. If you'd rather use a phone than paper scraps, all 100 passages are in the app, free to start with no account.

More for parents: [Doctrinal mastery: a parent's guide](/news/doctrinal-mastery-a-parents-guide)

*Seminary Sidekick is an independent app and isn't made or endorsed by any church.*
$md$,
	'/images/news/news-10min-review-2026-10-27.jpg',
	'A phone showing word tiles being arranged into a sentence, next to a closed book, a pencil and a checklist card.',
	array[]::text[],
	'scheduled',
	'2026-10-27 06:00:00-06'
)
on conflict (slug) do update set
	title = excluded.title,
	summary = excluded.summary,
	body_md = excluded.body_md,
	hero_image_url = excluded.hero_image_url,
	hero_image_alt = excluded.hero_image_alt,
	tags = excluded.tags,
	publish_at = excluded.publish_at,
	status = case when public.posts.status = 'published' then public.posts.status else excluded.status end;
