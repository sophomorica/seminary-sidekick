<script lang="ts">
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { SITE_URL } from '$lib/config/site';

	const pageTitle = 'Doctrinal Mastery for Parents: How to Help at Home | Seminary Sidekick';
	const pageDescription =
		"A parent's guide to the 100 doctrinal mastery scriptures: what they are, how they're split across the four books, and a 10-minute weekly routine to practice at home.";
	const canonical = `${SITE_URL}/doctrinal-mastery`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<article class="section mx-auto max-w-2xl px-4 md:px-8">
	<header class="mb-8">
		<h1 class="font-serif text-display-lg tracking-tight md:text-hero-lg">
			Doctrinal mastery: a parent's guide
		</h1>
	</header>

	<div class="post-body">
		<p>
			If your teen is in seminary, you've probably heard "doctrinal mastery." Here's what it
			means in plain terms, and a simple way to help at home without turning it into a chore.
		</p>

		<h2>What is doctrinal mastery?</h2>
		<p>
			Doctrinal mastery is the list of 100 scripture passages seminary students learn over
			four years. It's split across the four books of scripture:
		</p>
		<ul class="list-disc">
			<li>Old Testament: 24</li>
			<li>New Testament: 24</li>
			<li>Book of Mormon: 24</li>
			<li>Doctrine and Covenants: 28</li>
		</ul>
		<p>Students learn the reference, the key words, and eventually the passage itself.</p>

		<h2>Why memorizing is hard (and what helps)</h2>
		<p>
			Recognizing a verse isn't the same as knowing it. Most people can pick the right answer
			from four choices long before they could say it from memory. What helps is short,
			regular practice that gets a little harder each time: read it, rebuild it, then say or
			type it without help.
		</p>

		<h2>A 10-minute weekly routine for home</h2>
		<ol class="list-decimal">
			<li><strong>Pick one passage</strong> for the week. Let your teen choose.</li>
			<li><strong>Read it aloud together</strong> once, early in the week.</li>
			<li>
				<strong>Rebuild it</strong> mid-week: write the words on scraps of paper, shuffle them,
				and put them back in order.
			</li>
			<li>
				<strong>Prove it</strong> at the end of the week: say or write it with only the first
				letter of each word as a hint, then with no hints.
			</li>
			<li>
				<strong>Review last week's passage</strong> for one minute before starting the next.
			</li>
		</ol>

		<h2>Where Seminary Sidekick fits</h2>
		<p>Seminary Sidekick follows the same steps, Study → Build → Prove → Master:</p>
		<ul class="list-disc">
			<li><strong>Study:</strong> read the passage and hear it aloud.</li>
			<li><strong>Build:</strong> drag word tiles back into order.</li>
			<li><strong>Prove:</strong> type it with first-letter hints, then with no prompts.</li>
			<li><strong>Master:</strong> daily review keeps it fresh.</li>
		</ul>
		<p>
			All 100 passages are in the app from day one. It's free to start, needs no account, and
			works offline. Flashcards are included for quick recognition practice.
		</p>
	</div>

	<StoreButtons class="my-10" />

	<div class="post-body">
		<h2>Questions parents ask</h2>
		<p><strong>Do we need an account?</strong> No. You can start without one.</p>
		<p>
			<strong>Does it cost anything?</strong> The app is free to start. Premium is optional ($4.99/month
			or $34.99/year).
		</p>
		<p><strong>Does it work without internet?</strong> Yes.</p>
		<p>
			<em>
				Seminary Sidekick is an independent app made by Narrow Road Studios LLC. It is not
				made, sponsored, or endorsed by any church.
			</em>
		</p>
	</div>
</article>
