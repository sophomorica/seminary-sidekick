# `<Seo>` component

One-stop SEO + Open Graph + Twitter + JSON-LD for every page. Replaces hand-rolled `<svelte:head>` blocks.

## Basic usage

```svelte
<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
  title="Seminary Sidekick AI — Premium"
  description="Personal AI study companion for the 100 doctrinal mastery scriptures."
  canonical="/premium"
  ogImage="/og/premium.png"
/>
```

`title`, `description`, and `canonical` are required. `ogImage` falls back to `DEFAULT_OG_IMAGE` from `$lib/config/site`.

## Blog post (article)

```svelte
<Seo
  title={`${post.title} — Seminary Sidekick`}
  description={post.excerpt}
  canonical={`/news/${post.slug}`}
  ogImage={post.cover}
  type="article"
  article={{ publishedTime: post.date, author: post.author, tags: post.tags }}
  jsonLd={article({
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.date,
    author: post.author,
    url: `/news/${post.slug}`
  })}
/>
```

## JSON-LD structured data

Helpers live in `$lib/utils/jsonLd`. Pass a single object or an array:

```svelte
<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { softwareApplication, webSite } from '$lib/utils/jsonLd';
</script>

<Seo
  title="Seminary Sidekick — Master the 100 doctrinal mastery scriptures"
  description="..."
  canonical="/"
  jsonLd={[softwareApplication(), webSite()]}
/>
```

Available helpers: `softwareApplication()`, `article({...})`, `organization()`, `webSite()`.

## Notes

- `canonical` is a path (`/premium`), not a full URL. The component prepends `SITE_URL`.
- `ogImage` works the same way — pass `/og/foo.png`, get `https://seminarysidekick.com/og/foo.png`.
- `noindex` flag emits `<meta name="robots" content="noindex, nofollow">` for previews / staging.
- `type` defaults to `"website"`. Use `"article"` for blog posts.
