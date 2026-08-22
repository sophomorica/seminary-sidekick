<!--
  /teachers — thin teacher-library index.

  Catalog only: advice, Class Play help, doctrinal mastery tips, tools,
  and honest "coming" slots for lesson plans and testimonials.
  No invented plans. No placeholder quotes. No user-generated swap.
-->
<script lang="ts">
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/config/site';
	import { BookOpen, Bookmark, Lightbulb, Quote, Wrench } from 'lucide-svelte';

	let { data } = $props();

	const pageTitle = `For seminary teachers — ${SITE_NAME}`;
	const pageDescription =
		'Advice, Class Play help, doctrinal mastery tips, and tools for seminary teachers. Lesson plans and testimonials live here when they are real.';
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

<section
	class="bg-surface pt-16 pb-12 md:pt-24 md:pb-16"
	aria-labelledby="teachers-library-headline"
>
	<div class="mx-auto max-w-3xl px-4 md:px-8">
		<p class="eyebrow">For seminary teachers</p>
		<h1
			id="teachers-library-headline"
			class="font-serif text-display-lg tracking-tight md:text-hero-lg"
		>
			A library that lasts.
		</h1>
		<p class="mt-6 text-lg leading-relaxed text-on-surface-variant md:text-xl">
			This is the lasting place for advice, Class Play help, doctrinal mastery tips, tools,
			and — later — lesson plans and testimonials. It is not a Facebook replacement. Useful
			things said there should end up here.
		</p>
	</div>
</section>

<section class="bg-surface-container-low py-16 md:py-24" aria-label="Teacher library catalog">
	<div class="mx-auto max-w-3xl space-y-8 px-4 md:px-8">
		<article class="card" aria-labelledby="catalog-advice">
			<div class="flex items-start gap-4">
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary"
					aria-hidden="true"
				>
					<Lightbulb class="h-6 w-6" stroke-width={1.5} />
				</span>
				<div class="min-w-0">
					<h2 id="catalog-advice" class="font-serif text-headline-lg">
						Advice / Class Play help
					</h2>
					{#if data.classPlayHelp}
						<p class="mt-3 text-body-md text-on-surface-variant">
							<a
								href={`/news/${data.classPlayHelp.slug}`}
								class="font-semibold text-accent underline-offset-2 hover:underline"
							>
								{data.classPlayHelp.title}
							</a>
							— {data.classPlayHelp.excerpt}
						</p>
					{:else}
						<p class="mt-3 text-body-md text-on-surface-variant">
							Nothing published yet.
						</p>
					{/if}
				</div>
			</div>
		</article>

		<article class="card" aria-labelledby="catalog-dm-tips">
			<div class="flex items-start gap-4">
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary"
					aria-hidden="true"
				>
					<BookOpen class="h-6 w-6" stroke-width={1.5} />
				</span>
				<div class="min-w-0">
					<h2 id="catalog-dm-tips" class="font-serif text-headline-lg">
						Doctrinal mastery teaching tips
					</h2>
					{#if data.doctrinalMasteryTip}
						<p class="mt-3 text-body-md text-on-surface-variant">
							<a
								href={`/news/${data.doctrinalMasteryTip.slug}`}
								class="font-semibold text-accent underline-offset-2 hover:underline"
							>
								{data.doctrinalMasteryTip.title}
							</a>
							— {data.doctrinalMasteryTip.excerpt}
						</p>
					{:else}
						<p class="mt-3 text-body-md text-on-surface-variant">
							Nothing published yet.
						</p>
					{/if}
				</div>
			</div>
		</article>

		<article class="card" aria-labelledby="catalog-tools">
			<div class="flex items-start gap-4">
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary"
					aria-hidden="true"
				>
					<Wrench class="h-6 w-6" stroke-width={1.5} />
				</span>
				<div class="min-w-0 flex-1">
					<h2 id="catalog-tools" class="font-serif text-headline-lg">Tools</h2>
					<ul class="mt-3 space-y-2 text-body-md text-on-surface-variant">
						<li>
							<a
								href="/for-teachers#saved-class"
								class="inline-flex items-center gap-2 font-semibold text-accent underline-offset-2 hover:underline"
							>
								<Bookmark class="h-4 w-4 shrink-0" aria-hidden="true" />
								How to save a class
							</a>
						</li>
						<li>
							<a
								href="/#how-it-works"
								class="font-semibold text-accent underline-offset-2 hover:underline"
							>
								How it works — study, build, prove, master
							</a>
						</li>
					</ul>
					<p class="mt-5 text-body-md text-on-surface-variant">Get the app.</p>
					<div class="mt-3">
						<StoreButtons variant="outlined" />
					</div>
				</div>
			</div>
		</article>

		<article class="card" aria-labelledby="catalog-lesson-plans">
			<h2 id="catalog-lesson-plans" class="font-serif text-headline-lg">Lesson plans</h2>
			<p class="mt-3 text-body-md text-on-surface-variant">
				Coming — we will not invent these. When a real plan exists, it lives here.
			</p>
		</article>

		<article class="card" aria-labelledby="catalog-testimonials">
			<div class="flex items-start gap-4">
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
					aria-hidden="true"
				>
					<Quote class="h-6 w-6" stroke-width={1.5} />
				</span>
				<div class="min-w-0">
					<h2 id="catalog-testimonials" class="font-serif text-headline-lg">
						Testimonials
					</h2>
					<p class="mt-3 text-body-md text-on-surface-variant">
						Coming — no placeholder quotes.
					</p>
				</div>
			</div>
		</article>
	</div>
</section>
