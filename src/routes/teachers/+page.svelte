<!--
  /teachers — morning mixer for seminary teachers.

  Mix / Today / This week. Real grabbers a teacher can run tomorrow.
  Scripture Builder printouts stay at /teachers/printouts.
  No Facebook. No catalog dump. No fake testimonials. No Saved tab.
-->
<script lang="ts">
	import GrabberCard from '$lib/components/teachers/GrabberCard.svelte';
	import MixerTabs from '$lib/components/teachers/MixerTabs.svelte';
	import MorningBeats from '$lib/components/teachers/MorningBeats.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import {
		GRABBERS,
		MIXER_FRAMING,
		SEMINARY_YEAR_LABEL,
		THIS_WEEK,
		TODAY,
		grabberFor,
		parseMixerView
	} from '$lib/teachers/mixer';
	import { page } from '$app/state';

	let { data } = $props();

	const view = $derived(parseMixerView(page.url.searchParams.get('view')));
	const todayGrabber = grabberFor(TODAY.grabberSlug);

	const pageTitle = `Morning mixer for seminary teachers — ${SITE_NAME}`;
	const pageDescription =
		'Four beats. One morning. Original first-week grabbers and printables a seminary teacher can run tomorrow — including Scripture Builder printouts.';
	const canonical = `${SITE_URL}/teachers`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<section class="bg-surface pt-16 pb-12 md:pt-24 md:pb-16" aria-labelledby="teachers-mixer-headline">
	<div class="mx-auto max-w-6xl px-4 md:px-8">
		<p class="eyebrow">{SEMINARY_YEAR_LABEL}</p>
		<h1
			id="teachers-mixer-headline"
			class="font-serif text-display-lg tracking-tight md:text-hero-lg"
		>
			Morning mixer
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
			{MIXER_FRAMING} Pick a Grabber. Run it or print it. Teach stays in your manual — this is not
			a lesson-plan factory.
		</p>
		<div class="mt-8">
			<MixerTabs {view} />
		</div>
	</div>
</section>

{#if view === 'mix'}
	<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="mix-headline">
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<h2 id="mix-headline" class="font-serif text-display-md tracking-tight">
				Grabbers you can run
			</h2>
			<p class="mt-4 max-w-2xl text-lg text-on-surface-variant">
				Original first-week and class-unity formats. Scripture Builder printouts are one
				card, not a separate shop.
			</p>
			<ul class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2" aria-label="Grabber cards">
				{#each GRABBERS as grabber (grabber.slug)}
					<li>
						<GrabberCard {grabber} />
					</li>
				{/each}
			</ul>
			<p class="mt-10 text-body-sm text-on-surface-variant">
				Quiet link:
				<a
					href="/teachers/printouts"
					class="font-semibold text-accent underline-offset-2 hover:underline"
				>
					Scripture Builder printouts
				</a>
				{#if data.classPlayHelp}
					·
					<a
						href={`/news/${data.classPlayHelp.slug}`}
						class="font-semibold text-accent underline-offset-2 hover:underline"
					>
						{data.classPlayHelp.title}
					</a>
				{/if}
				{#if data.doctrinalMasteryTip}
					·
					<a
						href={`/news/${data.doctrinalMasteryTip.slug}`}
						class="font-semibold text-accent underline-offset-2 hover:underline"
					>
						{data.doctrinalMasteryTip.title}
					</a>
				{/if}
			</p>
		</div>
	</section>
{:else if view === 'today'}
	<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="today-headline">
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<p class="eyebrow">{TODAY.when}</p>
			<h2 id="today-headline" class="font-serif text-display-md tracking-tight">
				{TODAY.label}
			</h2>
			<p class="mt-4 max-w-2xl text-lg text-on-surface-variant">{TODAY.intro}</p>
			<div class="mt-12">
				<MorningBeats
					grabber={todayGrabber}
					teach={TODAY.teach}
					wrap={TODAY.wrap}
					invite={TODAY.invite}
				/>
			</div>
		</div>
	</section>
{:else}
	<section class="bg-surface-container-low py-16 md:py-24" aria-labelledby="week-headline">
		<div class="mx-auto max-w-6xl px-4 md:px-8">
			<h2 id="week-headline" class="font-serif text-display-md tracking-tight">
				First week, {SEMINARY_YEAR_LABEL}
			</h2>
			<p class="mt-4 max-w-2xl text-lg text-on-surface-variant">
				Five mornings. A real grabber each day. Teach is honest: not ready as a factory.
			</p>
			<ol class="mt-12 space-y-10" aria-label="This week">
				{#each THIS_WEEK as day (day.day)}
					{@const grabber = grabberFor(day.grabberSlug)}
					<li>
						<p class="eyebrow">{day.day} · {day.focus}</p>
						<div class="mt-4">
							<MorningBeats
								{grabber}
								teach={day.teach}
								wrap={day.wrap}
								invite={day.invite}
							/>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>
{/if}
