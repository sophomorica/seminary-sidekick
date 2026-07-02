<script lang="ts">
	import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '$lib/config/site';

	const pageTitle = `About — ${SITE_NAME}`;
	const pageDescription =
		'The story behind Seminary Sidekick — built by Patrick because seminary scripture mastery deserved a tool that felt focused, reverent, and joyful to come back to.';
	const canonical = `${SITE_URL}/about`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-12">
		<p class="eyebrow">About</p>
		<h1 class="font-serif text-display-lg md:text-hero-lg">
			Built for seminary, by someone who cares.
		</h1>
		<p class="mt-4 text-body-lg text-on-surface-variant">
			One developer, one design system, one stubborn belief that scripture mastery should feel
			like the best hour of the day.
		</p>
	</header>

	<!-- Optional editorial portrait — .txt placeholder until owner provides the real image. -->
	<figure class="mb-12">
		<img
			src="/images/about/patrick.png"
			alt="Patrick, the developer of Seminary Sidekick, at his desk with a leather scriptures volume and a laptop open to the app."
			class="w-full rounded-[2rem] shadow-editorial"
			loading="lazy"
		/>
		<figcaption class="mt-3 text-body-sm text-on-surface-variant">
			<!-- TODO(owner): replace with a real caption once you pick the photo. -->
			Patrick — developer, designer, and former seminary student.
		</figcaption>
	</figure>

	<!-- Mission -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">The mission</h2>
	<!-- TODO(owner): refine voice -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Seminary Sidekick exists to make the 100 doctrinal mastery scriptures stick — not as a
		chore, but as a focused, reverent, satisfying daily habit. The doctrinal mastery program is
		a real gift from the Church Educational System, and the scriptures inside it are some of the
		most important verses a teenager will ever carry with them. They deserve a study tool that
		respects that weight while still being genuinely fun to open.
	</p>
	<!-- TODO(owner): refine voice -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The path is simple on purpose: <em>Study</em>, <em>Build</em>, <em>Prove</em>,
		<em>Master</em>. Every feature in the app earns its place against that loop. If a thing
		doesn't help a student move from "I sort of remember this" to "I can produce this from
		memory," it doesn't ship.
	</p>

	<!-- The story -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">The story</h2>
	<!-- TODO(owner): refine voice -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		I started building Seminary Sidekick because every scripture mastery tool I could find felt
		either like flashcards in a trench coat or a worksheet pretending to be an app. None of them
		captured what the experience is actually supposed to feel like — quiet, focused, a little
		bit sacred, and (this is the part most tools miss) genuinely satisfying. I wanted something
		my own seminary self would have opened on the bus without being told to.
	</p>
	<!-- TODO(owner): refine voice -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		So I built the Flutter app first — design, code, scripture data, animations, every confetti
		particle. It's a real labor of love. The Scripture Builder is the heart of it: progressively
		harder tiers that ask you to actually produce the words, not just recognize them. When you
		nail the Master tier three times in a row, the app calls that mastered, and you've earned
		it.
	</p>
	<!-- TODO(owner): refine voice -->
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		This website is the front door. It's where students hear about the app, teachers vet it,
		parents ask the right questions, and — soon — a whole suite of Sidekick tools live under one
		roof. I'm building it the same way I built the app: slowly, deliberately, and with the
		conviction that small details add up to something that feels like a real place rather than a
		landing page.
	</p>

	<!-- What's next -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">What's next</h2>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Scripture Mastery is the first Seminary Sidekick app, not the last. The roadmap includes a
		journal app, a teacher resource library packed with lesson helps and object lessons, and a
		teacher community designed to do for seminary teachers what the Facebook group structurally
		can't — searchable, permanent, organized by curriculum week, and tied directly to the tools
		students already use.
	</p>
	<p class="mb-6 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		The goal is for Seminary Sidekick to become the default — the app every teacher recommends
		and every student installs. The way we get there is by earning it one feature at a time.
	</p>

	<!-- Contact -->
	<h2 class="mt-10 mb-4 font-serif text-headline-md text-on-surface">Get in touch</h2>
	<p class="mb-10 font-serif text-[1.125rem] leading-[1.75] text-on-surface">
		Questions, ideas, classroom requests, or just want to say hi? Email me directly at <a
			href={`mailto:${CONTACT_EMAIL}`}
			class="focus-ring text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
			>{CONTACT_EMAIL}</a
		>.
	</p>
</article>
