# Conventions — Seminary Sidekick Site

Moved verbatim from the original CLAUDE.md.

## Conventions

### Naming

| Type | Convention | Example |
|---|---|---|
| Routes | SvelteKit's `+page.svelte` / `+layout.svelte` | `routes/premium/+page.svelte` |
| Components | `PascalCase.svelte` | `Hero.svelte`, `QuickQuiz.svelte` |
| Component folders (multi-file) | `kebab-case/` | `components/demos/quick-quiz/` |
| TypeScript / JS files | `camelCase.ts` | `loadPosts.ts`, `formatDate.ts` |
| Config files | `kebab-case.ts` in `src/lib/config/` | `store.ts`, `nav.ts` |
| Content files | `kebab-case-slug.svx` | `seminary-sidekick-is-live.svx` |
| Tailwind classes | semantic tokens only | `bg-primary`, not `bg-[#94492C]` |

### Svelte 5 conventions

- Use runes for component state: `$state`, `$derived`, `$effect`, `$props`.
- Use `$props()` for component props, with TypeScript types:
  ```svelte
  <script lang="ts">
    let { title, kicker = undefined }: { title: string; kicker?: string } = $props();
  </script>
  ```
- Use snippets (`{#snippet}`) over slots for new code.
- Server load functions live in `+page.ts` (universal) or `+page.server.ts` (server-only).

### Styling

- **All styling via Tailwind utility classes** in markup.
- **No `<style>` blocks** in components except for animations that can't be done with utility classes, or for highly specialized cases. Justify in a comment when used.
- Global utilities go in `src/app.css` under `@layer components`.
- **Never hardcode hex colors.** Always use the Tailwind tokens defined in `tailwind.config.js`. See `THEME.md` for the full system.
- **Never use `shadow-lg`/`shadow-xl`/etc.** Use `shadow-editorial` or `shadow-floating`.
- **Default radius for cards is `rounded-[2rem]` (32px).** Buttons are `rounded-full`.

### Content (MDX / mdsvex)

Posts live in `src/content/news/[slug].svx` with frontmatter:

```yaml
---
title: "Seminary Sidekick is live in the App Store"
slug: "seminary-sidekick-is-live"
date: 2026-05-28
excerpt: "After months of building, Seminary Sidekick is now available to download."
tags: ["release", "announcement"]
cover: "/images/news/launch-cover.png"
author: "Patrick"
---
```

A shared frontmatter schema lives in `src/lib/content/schema.ts` and is used by the resource library later — so add fields conservatively.

### Scripture data — source of truth lives in the Flutter app

> **The 100 doctrinal-mastery scriptures are owned by the Flutter app, not this repo.**

The canonical scripture corpus lives at
`/Users/muse/Desktop/active/seminary_sidekick/lib/data/scriptures_data.dart`
in the Flutter app project. `src/lib/data/doctrinalMastery.json` in this
repo is a **generated port** of that Dart source. Two sources of truth
would diverge — the Flutter app wins.

Rules:

- **Never hand-edit `src/lib/data/doctrinalMastery.json`.** If a scripture needs to change, edit the Dart source in the Flutter app, then re-run the port script to regenerate the JSON.
- **Never derive scripture data from the legacy webpage repo's git history** (`passages.json`, `doctrinalMastery.json` from the deleted React app). That data is incomplete — most `fullPassage` fields were `"TODO"`. The Flutter source is authoritative and complete.
- **Demos and pages should import from `$lib/data/scriptures`** (the helpers module), not from the JSON directly. `getScripture()`, `getScripturesByBook()`, `pickRandomScriptures()`, etc. live there. This keeps the data shape encapsulated.
- **Schema mirrors the Flutter `Scripture` model:** `id`, `book` (one of `oldTestament`/`newTestament`/`bookOfMormon`/`doctrineAndCovenants`), `volume`, `reference`, `name`, `keyPhrase`, `fullText`. Computed Flutter fields (`words`, `wordCount`) are not serialized — derive client-side: `s.fullText.split(/\s+/)`.

Regeneration instructions and the port-script reference live in
`src/lib/data/README.md`.

### Image and audio assets — placeholder convention

Mirrors the Flutter app's convention. **Never generate real image or audio files.**

- When an image is needed, create a `.txt` file at the intended final path with a detailed description: composition, style, colors, mood, dimensions, references.
- Filename matches the intended final file but with `.txt` extension. Example: `static/images/hero/phone-mockup.txt` for a file that will become `phone-mockup.png`.
- The owner generates or sources the real asset and replaces the `.txt`.
- Code references the intended final path (which initially 404s).
- Same rule for any audio (demo SFX): describe the sound, suggest 2–3 sourcing options (freesound.org search terms, Pixabay audio, etc.), specify duration and format.

### Configuration as code

Anything that might change at launch or per-environment goes through a config file, not scattered in components:

- `src/lib/config/store.ts` — `IOS_URL`, `ANDROID_URL`, `ANDROID_AVAILABLE: boolean`.
- `src/lib/config/site.ts` — site name, tagline, contact email, social URLs.
- `src/lib/config/nav.ts` — nav and footer link arrays.

Every CTA reads from these. Launch-day updates are one-file changes.

### Accessibility

See `THEME.md` for the full list. Non-negotiables:

- Contrast meets WCAG AA.
- Every interactive element has a visible focus ring.
- 44×44px minimum hit target on mobile.
- Every page has one `<h1>`, headings descend.
- `prefers-reduced-motion` is respected.
- Every `<img>` has alt text.
- Skip link is first focusable on every page.

### SEO

Every page exports SEO metadata via a `<svelte:head>` block or a shared `<Seo>` component:

```svelte
<Seo
  title="Seminary Sidekick — Master the 100 Doctrinal Mastery scriptures"
  description="..."
  ogImage="/og/home.png"
  canonical="/"
/>
```

JSON-LD structured data (`SoftwareApplication` on home, `Article` on posts) is added via the same component.
