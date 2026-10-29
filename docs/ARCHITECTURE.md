# Architecture — Seminary Sidekick Site

Moved verbatim from the original CLAUDE.md.

## Tech Stack

| Choice                                          | Why                                                                                     |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| **SvelteKit** (latest)                          | Scales from static marketing to authenticated forum without a framework change.         |
| **Svelte 5**                                    | Runes (`$state`, `$derived`, `$effect`) for component state. New code uses runes.       |
| **TypeScript**                                  | Type safety, especially valuable for the content schema and store config.               |
| **Tailwind CSS**                                | Utility-first styling. All design tokens live in `tailwind.config.js`.                  |
| **shadcn-svelte**                               | Component primitives. We copy components into `src/lib/components/ui/` and own them.    |
| **public.posts**                                | News and guides. Markdown in the row, rendered at request time. No `.svx` files.        |
| **Vercel**                                      | Hosting. `adapter-vercel` for v1; can swap to `adapter-static` if we want fully static. |
| **Plausible** _(or PostHog — pending decision)_ | Analytics.                                                                              |

**Reserved for Tier 2/3** (don't add now):

- **Supabase auth** for a general account system
- **Resend** — transactional + digest email
- **Pagefind** — search

Two Supabase exceptions, both narrow:

- Class Play web join (`/join`): anonymous auth, `join_room`, and Realtime. The Flutter app owns that contract.
- Site content: `public.posts` plus the public `post-images` bucket. Reads use the anon key. Writes stay in the SQL editor.

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
│   │   ├── content/               # Post types and the visibility SQL
│   │   ├── config/
│   │   │   ├── store.ts           # iOS/Android URLs + feature flags
│   │   │   ├── site.ts            # Site name, tagline, social URLs, contact email
│   │   │   └── nav.ts             # Nav and footer link arrays
│   │   ├── data/
│   │   │   ├── doctrinalMastery.json   # Ported from old repo
│   │   │   └── passages.json           # Ported from old repo
│   │   ├── utils/                 # Pure helpers
│   │   └── server/                # (later) Server-only modules
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
│       ├── doctrinal-mastery/                # parent guide, fixed URL
│       ├── guides/[slug]/                    # later guides, no new route file
│       ├── news/
│       │   ├── +page.svelte                  # blog index
│       │   ├── [slug]/+page.svelte           # blog post
│       │   └── [slug]/+page.server.ts        # one news row from public.posts
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

## Key Files Reference

| File                                 | Purpose                                                                                                                                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLAUDE.md`                          | This file — single agent entry point.                                                                                                                                                                                                            |
| `THEME.md`                           | Visual design system. All colors, fonts, motion, components.                                                                                                                                                                                     |
| `TODO.md`                            | Task board for parallel agents (`TASK-XXX` items).                                                                                                                                                                                               |
| `NEW_SITE_PLAN.md`                   | Strategic plan — the 4-tier roadmap and full architectural rationale.                                                                                                                                                                            |
| `tailwind.config.js`                 | Design tokens. Mirrors THEME.md. Edit only via TASK-002 or with explicit coordination.                                                                                                                                                           |
| `src/app.css`                        | Tailwind directives, global CSS variables, focus utility, scripture blockquote styles.                                                                                                                                                           |
| `src/lib/config/store.ts`            | iOS/Android URLs and feature flags. Launch-day swap is one file.                                                                                                                                                                                 |
| `src/lib/config/site.ts`             | Site metadata, tagline, contact, socials.                                                                                                                                                                                                        |
| `src/lib/data/doctrinalMastery.json` | The 100 doctrinal mastery scriptures — generated port of the Flutter app's `scriptures_data.dart`. Never hand-edit. (`passages.json` is stale legacy data — 101 entries incl. verses not in the corpus — and is unused by code; safe to delete.) |
