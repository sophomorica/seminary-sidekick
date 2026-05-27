<!--
  <Seo> — TASK-B-060

  One-stop SEO + Open Graph + Twitter + JSON-LD for every page.
  Replaces hand-rolled <svelte:head> blocks. See Seo.README.md for usage.

  Behavior summary:
    - title         -> <title>, og:title, twitter:title
    - description   -> meta description, og:description, twitter:description
    - canonical     -> path (e.g. "/premium") resolved against SITE_URL
                       -> <link rel="canonical"> + og:url
    - ogImage       -> path resolved against SITE_URL -> og:image + twitter:image
                       Falls back to DEFAULT_OG_IMAGE when omitted.
    - type          -> og:type. Defaults to "website".
    - article       -> when provided, emits article:published_time,
                       article:author, and article:tag entries.
    - jsonLd        -> single object or array of JSON-LD payloads, each
                       rendered as a <script type="application/ld+json">.

  This is a head-only component. It renders nothing in the body.
-->
<script lang="ts">
	import {
		SITE_NAME,
		SITE_URL,
		DEFAULT_OG_IMAGE
	} from '$lib/config/site';
	import type { JsonLd } from '$lib/utils/jsonLd';

	type OgType = 'website' | 'article' | 'profile' | 'book' | 'video.other';

	type ArticleMeta = {
		publishedTime?: string | Date;
		modifiedTime?: string | Date;
		author?: string;
		tags?: string[];
	};

	let {
		title,
		description,
		canonical,
		ogImage,
		type = 'website' as OgType,
		article = undefined,
		jsonLd = undefined,
		noindex = false
	}: {
		title: string;
		description: string;
		canonical: string;
		ogImage?: string;
		type?: OgType;
		article?: ArticleMeta;
		jsonLd?: JsonLd | JsonLd[];
		noindex?: boolean;
	} = $props();

	/** Resolve any path (or already-absolute URL) against SITE_URL. */
	function absolute(pathOrUrl: string): string {
		if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
		const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
		return `${SITE_URL}${path}`;
	}

	function asIso(value: string | Date | undefined): string | undefined {
		if (!value) return undefined;
		return value instanceof Date ? value.toISOString() : value;
	}

	const canonicalUrl = $derived(absolute(canonical));
	const ogImageUrl = $derived(absolute(ogImage ?? DEFAULT_OG_IMAGE));
	const articlePublished = $derived(asIso(article?.publishedTime));
	const articleModified = $derived(asIso(article?.modifiedTime));

	/** Normalize jsonLd to an array for easy iteration. */
	const jsonLdList = $derived(
		jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImageUrl} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />

	<!-- Article-specific OG tags -->
	{#if article && articlePublished}
		<meta property="article:published_time" content={articlePublished} />
	{/if}
	{#if article && articleModified}
		<meta property="article:modified_time" content={articleModified} />
	{/if}
	{#if article?.author}
		<meta property="article:author" content={article.author} />
	{/if}
	{#if article?.tags}
		{#each article.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- JSON-LD structured data -->
	{#each jsonLdList as payload, i (i)}
		{@html `<script type="application/ld+json">${JSON.stringify(payload)}<\/script>`}
	{/each}
</svelte:head>
