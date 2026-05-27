# CLAUDE.md — Seminary Sidekick Site

> **Single entry point for AI agents.** Read this file before touching any code.
> For visual design, read `THEME.md` next.
> For the work board, read `TODO.md` and claim a task.
> For the full strategic context, read `NEW_SITE_PLAN.md`.

---

## What This Project Is

The web home of Seminary Sidekick. Today: a marketing site that drives App Store and Play Store installs of the Flutter app. Tomorrow: the home of the Seminary Sidekick Suite — multiple apps, a teacher resource library, a teacher community, and shared identity across every Sidekick app.

The ambition is to make Seminary Sidekick **the defacto seminary app** — the one every teacher recommends and every student installs. This site is the brand's front door, and eventually its center of gravity.

**Current scope (Tier 1):** marketing site + 2 playable demos + news/blog + premium AI page + for-teachers page. No accounts, no backend. See the 4-tier roadmap in `NEW_SITE_PLAN.md`.

---

## Tech Stack

| Choice | Why |
|---|---|
| **SvelteKit** (latest) | Scales from static marketing to authenticated forum without a framework change. |
| **Svelte 5** | Runes (`$state`, `$derived`, `$effect`) for component state. New code uses runes. |
| **TypeScript** | Type safety, especially valuable for the content schema and store config. |
| **Tailwind CSS** | Utility-first styling. All design tokens live in `tailwind.config.js`. |
| **shadcn-svelte** | Component primitives. We copy components into `src/lib/components/ui/` and own them. |
| **mdsvex** | `.svx` files = Markdown + Svelte components. Blog posts, devotionals, lesson plans. |
| **Vercel** | Hosting. `adapter-vercel` for v1; can swap to `adapter-static` if we want fully static. |
| **Plausible** *(or PostHog — pending decision)* | Analytics. |

**Reserved for Tier 2/3** (don't add now):
- **Supabase** — auth + Postgres database
- **Supabase Storage** — file assets for resource library
- **Resend** — transactional + digest email
- **Pagefind** — search

---

## Project Structure

```
seminary-sidekick-site/
├── src/
│   ├── app.css                    # Tailwind directives + CSS variables + global utilities
│   ├── app.html                   # HTML shell
│   ├── hooks.server.ts            # (later) SvelteKit hooks for auth, etc.
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn-svelte primitives (Button, Card, Dialog…)
│   │   │   ├── layout/            # AppNav, AppFooter, SkipLink
│   │   │   ├── sections/          # Homepage sections: Hero, HowItWorks, PremiumPeek…
│   │   │   ├── demos/             # QuickQuiz, ScriptureMatch — own subfolder each
│   │   │   └── brand/             # Logo, PhoneMockup, StoreButtons
│   │   ├── content/               # MDX content collection logic
│   │   ├── config/
│   │   │   ├── store.ts           # iOS/Android URLs + feature flags
│   │   │   ├── site.ts            # Site name, tagline, social URLs, contact email
│   │   │   └── nav.ts             # Nav and footer link arrays
│   │   ├── data/
│   │   │   ├── doctrinalMastery.json   # Ported from old repo
│   │   │   └── passages.json           # Ported from old repo
│   │   ├── utils/                 # Pure helpers
│   │   └── server/                # (later) Server-only modules
│   ├── content/
│   │   └── news/                  # .svx blog posts (frontmatter + markdown + Svelte)
│   └── routes/
│       ├── +layout.svelte         # Root layout — nav, footer, page transitions
│       ├── +layout.ts             # Root load function
│       ├── +error.svelte          # 4xx/5xx page
│       ├── +page.svelte           # /  — homepage composition shell
│       ├── apps/
│       │   ├── +page.svelte                  # /apps — suite overview
│       │   └── scripture-mastery/+page.svelte # /apps/scripture-mastery
│       ├── quick-quiz/+page.svelte           # standalone demo
│       ├── scripture-match/+page.svelte      # standalone demo
│       ├── premium/+page.svelte              # premium AI deep dive
│       ├── for-teachers/+page.svelte         # teachers pitch
│       ├── news/
│       │   ├── +page.svelte                  # blog index
│       │   ├── [slug]/+page.svelte           # blog post
│       │   └── [slug]/+page.ts               # load post from src/content/news
│       ├── about/+page.svelte
│       ├── privacy/+page.svelte
│       ├── terms/+page.svelte
│       ├── contact/+page.svelte
│       └── sitemap.xml/+server.ts            # auto-generated sitemap
├── static/
│   ├── images/                    # All image assets (start with .txt placeholders)
│   ├── og/                        # Open Graph default images
│   └── favicon.ico
├── tailwind.config.js             # All design tokens — read THEME.md before editing
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md                      # this file
├── THEME.md                       # design system
├── TODO.md                        # task board
├── NEW_SITE_PLAN.md               # strategic plan
└── README.md
```

---

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

---

## Agent Coordination

This project is built to run many agents in parallel. The same claim/complete pattern from the Flutter app applies.

### Quick start

```
1. Read this file (CLAUDE.md)      → Understand the project
2. Read THEME.md                   → Understand the visual system
3. Read TODO.md                    → Find an open task
4. Claim the task                  → Write your agent ID into TODO.md, commit
5. Do the work                     → Follow conventions, only touch files in `files_to_touch`
6. Mark task done                  → Update TODO.md, commit
```

### Claiming a task

1. Pull latest, then read `TODO.md` fresh (never rely on cached state).
2. Find a task with `status: open`.
3. Check `depends_on` — don't start blocked work.
4. Check `files_to_touch` — verify no other in-progress task overlaps.
5. Edit `TODO.md`: set `status: in_progress`, `claimed_by: [your-id]`, `started: [ISO timestamp]`.
6. **Commit the claim before writing code:** `git add TODO.md && git commit -m "claim TASK-XXX: [description]"`.
7. Push.

If two agents claim the same task, the second push fails with a non-fast-forward. Pull, see it's taken, pick another task.

### Completing a task

1. Finish the code changes.
2. Verify acceptance criteria locally (run `pnpm dev`, run `pnpm check`, run any tests).
3. Edit `TODO.md`: set `status: done`, add `completed` timestamp, check acceptance criteria, add notes.
4. Commit everything: `git add -A && git commit -m "complete TASK-XXX: [what was done]"`.
5. Push.

### Blocked or abandoned

- **Blocked:** set `status: blocked`, add `blocked_by` note, commit, move on.
- **Abandoned:** set `status: open`, clear `claimed_by`, add notes explaining why, commit.

### File ownership

Two agents should never edit the same file concurrently. **The TODO.md `files_to_touch` field is the contract.** Before claiming a task, scan the other in-progress tasks and verify no overlap.

**Shared files (extra caution):**
- `tailwind.config.js`
- `src/app.css`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/lib/config/*.ts`
- `package.json`
- `CLAUDE.md`, `THEME.md`, `TODO.md`

If you need to change one of these for your task, claim it explicitly in `files_to_touch` and finish quickly.

### Commit format

```
[verb] TASK-XXX: [concise description]
```

Verbs: `claim`, `complete`, `fix`, `add`, `update`, `refactor`, `block`.

### Parallel-safe component pattern

Homepage sections live in `src/lib/components/sections/` as standalone files (one per section). The homepage `+page.svelte` is a thin composition shell that imports each section. This lets multiple agents work on different sections without touching the same file.

```svelte
<!-- src/routes/+page.svelte (one agent owns this composition) -->
<script lang="ts">
  import Hero from '$lib/components/sections/Hero.svelte';
  import HowItWorks from '$lib/components/sections/HowItWorks.svelte';
  import QuickQuizDemo from '$lib/components/demos/quick-quiz/QuickQuizDemo.svelte';
  import PremiumPeek from '$lib/components/sections/PremiumPeek.svelte';
  import ForTeachersStrip from '$lib/components/sections/ForTeachersStrip.svelte';
  import NewsPreview from '$lib/components/sections/NewsPreview.svelte';
  import FinalCTA from '$lib/components/sections/FinalCTA.svelte';
</script>

<Hero />
<HowItWorks />
<QuickQuizDemo />
<PremiumPeek />
<ForTeachersStrip />
<NewsPreview />
<FinalCTA />
```

Each `<X />` component is built by a different agent in parallel and lands independently.

---

## Build, Run, Test

```bash
# Install deps
pnpm install

# Dev server
pnpm dev

# Type check + lint
pnpm check
pnpm lint

# Tests
pnpm test            # unit tests (Vitest)
pnpm test:e2e        # end-to-end tests (Playwright)

# Production build
pnpm build
pnpm preview
```

CI must pass `pnpm check` (no TS errors), `pnpm lint`, and `pnpm test`. Lighthouse target: 95+ on all four scores on the homepage.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file — single agent entry point. |
| `THEME.md` | Visual design system. All colors, fonts, motion, components. |
| `TODO.md` | Task board for parallel agents (`TASK-XXX` items). |
| `NEW_SITE_PLAN.md` | Strategic plan — the 4-tier roadmap and full architectural rationale. |
| `tailwind.config.js` | Design tokens. Mirrors THEME.md. Edit only via TASK-002 or with explicit coordination. |
| `src/app.css` | Tailwind directives, global CSS variables, focus utility, scripture blockquote styles. |
| `src/lib/config/store.ts` | iOS/Android URLs and feature flags. Launch-day swap is one file. |
| `src/lib/config/site.ts` | Site metadata, tagline, contact, socials. |
| `src/lib/data/passages.json` | The 100 doctrinal mastery scriptures. Ported from the old repo. |

---

## What This Project Is NOT

- ❌ Not a competitor to the Flutter app. The app is the product. The site sells it.
- ❌ Not a place to reimplement the full scripture mastery experience. Demos are bite-sized tasters.
- ❌ Not a Facebook integration. We don't bridge — we build something better.
- ❌ Not over-engineered. No backend in Tier 1. No accounts. No database. Add complexity only when a tier requires it.
- ❌ Not generic. Every detail — typography, color, motion, copy — should feel unmistakably Seminary Sidekick.

---

## Open Strategic Questions

Tracked in `NEW_SITE_PLAN.md` under "Open Questions for You." Agents working on Tier-1 tasks shouldn't block on these — the build proceeds with sensible defaults that can be swapped in via the config files.
