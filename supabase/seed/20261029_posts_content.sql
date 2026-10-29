-- Published news, the parent guide, and the 27 October review.
-- Safe to run twice. Re-running does not resurrect a row you have moved back to draft.
-- Apply supabase/migrations/20261029160000_posts_content_model.sql first.
-- The review is published with publish_at at 08:00 America/New_York on 2026-10-27,
-- so a request before that instant does not show it. The guide is an hour earlier
-- the same morning, because the review links to it.
-- image_url for the review is the site path of the file in static/images/news/.
-- The post-images bucket (public read, no anon write) is the production home for
-- that file: object key news-10min-review-2026-10-27.jpg.

insert into public.posts (slug, kind, title, description, body_md, image_url, publish_at, status)
values
	(
		$post$1-0-8-ios-and-android$post$,
		$post$news$post$,
		$post$1.0.8 is live on iPhone and Android$post$,
		$post$Group Scripture Builder host setup, volume facets, and a quieter Delete All.$post$,
		$post$1.0.8 is out on the [App Store](https://apps.apple.com/us/app/seminary-sidekick/id6780003239) and [Google Play](https://play.google.com/store/apps/details?id=com.seminarysidekick.app).

Group Scripture Builder host setup is one scripture (no set-size / play-mode chips). The host picker facets by volume (OT / NT / BoM / D&C). Delete All / New conversation no longer lets an in-flight Sidekick chat reply rewrite wiped history.

Get the app free to start.$post$,
		null,
		timestamptz $post$2026-08-22 12:00:00-04$post$,
		'published'
	),
	(
		$post$build-it-then-type-it-cold$post$,
		$post$news$post$,
		$post$Build it once. Then type it cold.$post$,
		$post$Scripture Builder is the pass that makes a verse stay.$post$,
		$post$Study is first contact. Build is where you understand it — reconstruct the verse from tiles. Then Prove: type it with hints, then type it cold.

That last pass lasts past Friday’s quiz.

Open any of the 100 doctrinal mastery scriptures. Pick one verse. Build it today. Type it cold tomorrow. Daily review keeps it sealed in.

Teachers can assign that two-day pass without writing a new lesson.$post$,
		null,
		timestamptz $post$2026-08-22 12:00:00-04$post$,
		'published'
	),
	(
		$post$class-play-five-minute-warmup$post$,
		$post$news$post$,
		$post$Five minutes before the quiz$post$,
		$post$One Class Play Quick Quiz as a warmup. Students join with a code or QR.$post$,
		$post$Teachers do not need a new curriculum.

Before a doctrinal mastery check, host one casual Quick Quiz. Project the board. Students join from their phones with the four-letter code or a QR scan. That is the whole setup.

Free hosts get one game a week (up to 35 students). Premium unlocks rooms of 50 and unlimited games. Students always join free.

Save the class once — first names as seats — and they pick their name next period. No accounts. No retyping the roll.

Keep it reverent. The verse sticking is the point.$post$,
		null,
		timestamptz $post$2026-08-22 12:00:00-04$post$,
		'published'
	),
	(
		$post$class-play-steadier-on-iphone-1-0-11$post$,
		$post$news$post$,
		$post$Class Play is steadier on iPhone in 1.0.11$post$,
		$post$Class Play is steadier on iPhone in Seminary Sidekick 1.0.11 — host double-Start no longer resets the quiz. Android is still on 1.0.10.$post$,
		$post$Class Play is steadier on iPhone in Seminary Sidekick 1.0.11.

If the host taps Start twice, the quiz no longer resets. Canceling a purchase no longer crashes the app. Delete All keeps Eternal progress when a wipe only partly succeeds.

Class Play is still a short seminary warmup: students join with a four-letter code or QR, then Quick Quiz or a Scripture Builder race. The rest of the path is Study, Build, Prove, Master. Flashcards stay free practice in Practice — recognition, not mastery-gating.

1.0.11 is live on the App Store. Android is still on 1.0.10 until Play catches up — same free tools there today, including Flashcards and Class Play.

Free to start. Premium is $4.99 a month or $34.99 a year. No ads.

[Get the app](https://seminarysidekick.com) · [App Store](https://apps.apple.com/us/app/seminary-sidekick/id6780003239) · [Google Play](https://play.google.com/store/apps/details?id=com.seminarysidekick.app)$post$,
		null,
		timestamptz $post$2026-09-21 12:00:00-04$post$,
		'published'
	),
	(
		$post$class-play-warmup-not-homework$post$,
		$post$news$post$,
		$post$A warmup, not extra homework$post$,
		$post$Class Play is a short seminary warmup. Students join with a code or QR. The rest of the app is still Study, Build, Prove, Master.$post$,
		$post$Seminary Sidekick is a free-to-start app for mastering all 100 doctrinal mastery scriptures on iPhone and Android, on the [App Store](https://apps.apple.com/us/app/seminary-sidekick/id6780003239) and [Google Play](https://play.google.com/store/apps/details?id=com.seminarysidekick.app).

In the first weeks of seminary, the useful move is a short Class Play warmup: students join with a four-letter code or a QR scan, then run Quick Quiz or a Scripture Builder race.

The rest of the app is still Study, Build, Prove, Master. Open a verse, hear it, rebuild it, then type it cold. Class Play does not replace that path. It puts the same scriptures on one board for a few minutes at the start of class.

Free to start. Premium is $4.99 a month or $34.99 a year. No ads. Students always join Class Play free.

[https://seminarysidekick.com](https://seminarysidekick.com)$post$,
		null,
		timestamptz $post$2026-08-24 12:00:00-04$post$,
		'published'
	),
	(
		$post$digital-convenient-analog-helps-you-map$post$,
		$post$news$post$,
		$post$Digital is convenient. Analog helps you map.$post$,
		$post$Seminary Sidekick is an excellent digital tool — and the goal is still to get you into the real scriptures.$post$,
		$post$It’s a little ironic writing this digitally when this post is all about analog.

Digital is convenient. It’s easy. But it doesn’t always help your brain *map* the material. I’m a fan of multiple modalities — tactile, physical, audio, digital. All of it is good.

I noticed that while preparing for a talk. I was looking for a scripture and ended up in the Bible Dictionary just perusing. There’s a big quotation section — and my mind started mapping to it. I could *see* how verses related to other verses. That visual map helped me find what I needed for the talk. It was interesting for me to experience the verses and related verses in such a way. It was as if the physical, tangible scriptures in my hands were engaging with me in a way.

Seminary Sidekick is a tool — a very excellent one. Study, Build, Prove, Master on your phone is excellent. My hope is that the tool can combine with the analog: open the physical scriptures, sit with the verses, engage. All of the tools helping us to seek Him and learn of Him.

If you're curious, I was looking for scriptures on marriage and the very first quotation pair is Gen 1:27 and Matt 19:4. This is where Jesus is directly quoting Genesis to teach about marriage. Super interesting. The discovery was somewhat magical.

Printouts are one bridge ([Scripture Builder printouts](/teachers/printouts)). More to come.$post$,
		null,
		timestamptz $post$2026-09-07 12:00:00-04$post$,
		'published'
	),
	(
		$post$dont-stop-at-the-tiles$post$,
		$post$news$post$,
		$post$Don’t stop at the tiles$post$,
		$post$Tiles can feel like winning. Prove is where it sticks.$post$,
		$post$Scripture Builder tiles can feel like winning. You puzzle the phrases and they click into place. The verse looks right, and it is tempting to leave it at that.

You have done real work putting the verse together. Now it is time to **Prove** — that is where it can stick.

Go up one level to the verse with first-letter hints. Get that down a few times. Then type it cold — no prompts, no tiles. That is the moment you know you know it.

Stick with the same verse until you can produce the words without the board. This takes you one step closer to mastery, and it lets the doctrine come back when you need it.$post$,
		null,
		timestamptz $post$2026-09-04 12:00:00-04$post$,
		'published'
	),
	(
		$post$flashcards-for-key-phrases$post$,
		$post$news$post$,
		$post$Flashcards for doctrinal mastery key phrases$post$,
		$post$Flashcards are live in Seminary Sidekick 1.0.10 — flip the reference, check the key words. Free practice on iPhone and Android.$post$,
		$post$Flashcards for doctrinal mastery key phrases are live in Seminary Sidekick 1.0.10 on iPhone and Android.

Open Practice, tap Flashcards. The front is the reference; the back is the key words. Tap to flip. Learning mode uses Done / Again (swipe up peeks the full verse). Quiz mode uses Got it / Missed, with a Missed deck you can replay. Scope by All Standard Works or one volume (OT, NT, BoM, D&C).

Flashcards are free practice. They help recognition; they do not gate mastery. The mastery path is still Study, Build, Prove, Master through Scripture Builder. Class Play stays a short live warmup with a code or QR.

Free to start. Premium is $4.99 a month or $34.99 a year. No ads.

[Get the app](https://seminarysidekick.com) · [App Store](https://apps.apple.com/us/app/seminary-sidekick/id6780003239) · [Google Play](https://play.google.com/store/apps/details?id=com.seminarysidekick.app)$post$,
		null,
		timestamptz $post$2026-09-14 12:00:00-04$post$,
		'published'
	),
	(
		$post$i-used-to-cut-these-by-hand$post$,
		$post$news$post$,
		$post$I used to cut these by hand$post$,
		$post$Print a doctrinal mastery verse, cut the chunks, and race to put it back together — all 100 scriptures, free.$post$,
		$post$I'm really excited. I've been working hard on an analog version of Scripture Builder for doctrinal mastery — and right now you can find it here:

[Open Scripture Builder printouts](/teachers/printouts)

What I used to do with my class is manually type these out, format them so I could cut them out, then cut them all into piles for different groups. Each group got their own pile of words. I'd have them assemble the verse as fast as they could — and see who did it the fastest, and obviously the most correct.

This is sort of a cheat code. You can go find the scripture and print it out.

I'm also figuring out how to make the cutting part easier. Cutting is still tedious — but hey, we do a lot for our kids. There are ways to get them pre-cut, but that needs license agreements and permissions from the Church, and I'm currently working on that. We'll see how it goes.

In the meantime, try it out. You can select any of the 100 doctrinal mastery scriptures and it'll build you the printables — save as PDF or print directly. You still have to cut them out, but you can have your students do that to keep them awake while they prep the game.

If I were going to use these long-term, I'd probably print them on cardstock. Either way, I'm super excited. I hope it brings a lot of fun and joy into memorizing scriptures.$post$,
		null,
		timestamptz $post$2026-09-05 12:00:00-04$post$,
		'published'
	),
	(
		$post$mixed-tiles-for-the-board$post$,
		$post$news$post$,
		$post$Mixed tiles for the board$post$,
		$post$Scripture Builder printouts are live. All 100 doctrinal mastery verses from the app, three levels.$post$,
		$post$Scripture Builder printouts are live. All 100 doctrinal mastery verses from the app, three levels.

Beginner and Intermediate are compact mixed cut-out tiles. Same chunks as the app.

Advanced matches Advanced in the app: first-letter hints for each word, so students rebuild the verse without seeing the full text or cutouts.

Pick a verse, then use the browser Print dialog (Save as PDF, US Letter).

[https://seminarysidekick.com/teachers/printouts](/teachers/printouts)$post$,
		null,
		timestamptz $post$2026-09-01 12:00:00-04$post$,
		'published'
	),
	(
		$post$one-verse-a-day-beats-cramming$post$,
		$post$news$post$,
		$post$One verse a day beats cramming$post$,
		$post$The point of mastery is to let the doctrine soak into the heart so it is integrated.$post$,
		$post$The point of mastery has never been about cramming the information to "get the answer" on test day. The point has always been to let the doctrine soak into the heart so it is integrated.

To do that with Seminary Sidekick:

**Study** — open the app and read first. Sit with the passage. Open your physical scriptures to the passage and highlight it carefully. This primes the pump for the next part.

**Scripture Builder** — reconstruct the verse with the tiles like you are putting together a puzzle. No need to race. You want to engage and see where the phrases fit.

**Prove next.** Type it with first-letter hints. Then type it cold, no prompts. This is what helps seal it for when you need it.

At the end, read it again from your physical scriptures to lock it in place and memory.

This strategy helps create a wrestling relationship with the verse which helps you remember and master it longer. Do it again for your next verse, and so on.$post$,
		null,
		timestamptz $post$2026-08-28 12:00:00-04$post$,
		'published'
	),
	(
		$post$say-the-key-phrase-cold$post$,
		$post$news$post$,
		$post$Say the key phrase cold.$post$,
		$post$Read it in Study. Then look away and say the key phrase out loud until it is cold.$post$,
		$post$Doctrinal mastery often hangs on the **key phrase**. A common stuck point is knowing the reference — or recognizing the tiles — and then going blank when you need the words.

Start in **Study**. Read the verse. Sit with it for a minute. Then close the phone, or look away, and say the key phrase out loud. Keep going until you can say it cold, without peeking. The key phrase is the handle — once it is yours, the rest of the verse has something to hold onto.

Only then open Scripture Builder and move to **Prove**. The tiles come easier when the phrase is already yours. You are not trying to win the board. You are letting the words settle so they are ready when a question, or a quiet moment, asks for them.

The free app walks Study → Build → Prove → Master. Today, pick one verse. Read it. Look away. Say the key phrase until it is cold.$post$,
		null,
		timestamptz $post$2026-09-08 12:00:00-04$post$,
		'published'
	),
	(
		$post$two-quiet-minutes-of-flips$post$,
		$post$news$post$,
		$post$Two quiet minutes of flips$post$,
		$post$Open Practice, tap Flashcards. Two quiet minutes at the desk, then Class Play as the live warmup.$post$,
		$post$Flashcards are already in the app. Use them at the desk before Class Play starts.

Open Practice, tap Flashcards. The front is the reference. The back is the key words. Give the class two quiet minutes of flips. Each student works a small set. Or run a brief call-and-response. You say the reference. They say the key phrase.

Then host Class Play. That stays the short live warmup. Students join with a code or QR.

Flashcards help recognition. They do not replace Study, Build, Prove, Master through Scripture Builder. Those two minutes mean the reference and the key phrase are already in mind when Class Play starts.

Keep it reverent. The verse sticking is the point.$post$,
		null,
		timestamptz $post$2026-09-15 12:00:00-04$post$,
		'published'
	),
	(
		$post$doctrinal-mastery$post$,
		$post$guide$post$,
		$post$Doctrinal mastery: a parent's guide$post$,
		$post$A parent's guide to the 100 doctrinal mastery scriptures: what they are, how they're split across the four books, and a 10-minute weekly routine to practice at home.$post$,
		$post$If your teen is in seminary, you've probably heard "doctrinal mastery." Here's what it means in plain terms, and a simple way to help at home without turning it into a chore.

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

*Seminary Sidekick is an independent app made by Narrow Road Studios LLC. It is not made, sponsored, or endorsed by any church.*$post$,
		null,
		timestamptz $post$2026-10-27 07:00:00-04$post$,
		'published'
	),
	(
		$post$a-10-minute-weekly-scripture-review-you-can-do-at-home$post$,
		$post$news$post$,
		$post$A 10-minute weekly scripture review you can do at home$post$,
		$post$Most of us can recognize a verse long before we can say it.$post$,
		$post$<img src="/images/news/news-10min-review-2026-10-27.jpg" alt="A phone showing word tiles being arranged into a sentence, next to a closed book, a pencil and a checklist card." />

Most of us can recognize a verse long before we can say it. That's normal. Recognition comes first, recall comes later, and recall only comes with practice.

Here's a routine that takes about 10 minutes a week:

- **Early in the week:** pick one doctrinal mastery passage and read it aloud together.
- **Mid-week:** rebuild it. Write the words on scraps of paper, shuffle them, and put them back in order.
- **End of the week:** say or write it with first-letter hints, then without any.
- **Before the next one:** one minute reviewing last week's passage.

That's the same Study → Build → Prove → Master path Seminary Sidekick uses. If you'd rather use a phone than paper scraps, all 100 passages are in the app, free to start with no account.

More for parents: [Doctrinal mastery: a parent's guide](/doctrinal-mastery)

*Seminary Sidekick is an independent app and isn't made or endorsed by any church.*$post$,
		$post$/images/news/news-10min-review-2026-10-27.jpg$post$,
		timestamptz $post$2026-10-27 08:00:00-04$post$,
		'published'
	)
on conflict (slug) do update set
	kind = excluded.kind,
	title = excluded.title,
	description = excluded.description,
	body_md = excluded.body_md,
	image_url = excluded.image_url,
	publish_at = excluded.publish_at,
	status = case
		when public.posts.status = 'draft' then public.posts.status
		else excluded.status
	end;
