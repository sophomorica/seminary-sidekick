# Seminary Sidekick — New Marketing Site Plan

_Drafted: 2026-05-27. Owner: Patrick._
_Status: proposal for review. Nothing built yet._

---

## TL;DR

Archive the current React + FastAPI + Postgres webpage. Build a new site whose immediate job is to **explain the app, prove it's fun in 30 seconds, and push the visitor to the App Store** — but architect it so the same codebase grows into the Seminary Sidekick Suite: a multi-app portfolio, the best teacher resource library on the internet, a community that's better than the Facebook teacher group could ever be, and shared identity across every future Sidekick app. The goal is bigger than a webpage. It's to make Seminary Sidekick **the defacto seminary app** — the one every teacher recommends and every student installs. No backend on day one. The stack and structure leave the door open for everything that comes next.

---

## Long-Term Vision: The Seminary Sidekick Suite

The website's purpose is bigger than "marketing for the scripture mastery app." Over the next 12+ months it should grow into the home base for an entire suite — Scripture Mastery today, a Journal app next, future apps after that, plus a teacher resource hub and a community layer. Planning that out now changes a few architectural calls we'd otherwise make for a one-shot marketing site.

### The 4-tier roadmap

**Tier 1 — Today: marketing + first app (months 0–3)**
Single static-feeling site. Hero, how-it-works, two playable demos, premium AI peek, **Class Play teaser + teacher waitlist**, for-teachers strip, news/blog. CTA is "Get the app." No accounts. This is what Phase 0–7 in the build plan below covers.

Class Play — the live, classroom-wide, Kahoot-style multiplayer mode — is the viral mechanic of the whole product, even though it ships in a later Flutter app update. The marketing site already leads with it and captures teacher waitlist signups so the feature has momentum on launch day. Submissions land in Formspree (or whichever no-code endpoint is configured in `src/lib/config/site.ts`).

**Tier 2 — Suite portfolio + teacher resource library (months 3–9)**
- Home page reframes as "The Seminary Sidekick Suite" with app cards.
- Each app gets its own product page at `/apps/[slug]` — Scripture Mastery, Journal, whatever ships next.
- `/teach` (or `/resources`) becomes a real searchable library — lesson outlines, object lessons, weekly curriculum-aware helps, printable handouts. All MDX + tagged assets.
- "Submit a tip" form for teachers; you (or a small invited group) curate before publishing. This is the on-ramp to community without taking on open-forum moderation cost yet.
- Still mostly static. No backend yet (the form goes to email or a simple no-code endpoint like Formspree).

**Explicit product exception — Class Play web join:** `/join` and `/join/[code]` may use
Supabase anonymous auth, the server-authoritative `join_room` RPC, and Realtime so students
can join a teacher-hosted room from a browser. This narrow participant flow does not add
general site accounts or expand the Tier-2 resource/community backend scope.

**Tier 3 — Teacher community + accounts (months 6–12)**
- Real auth (Supabase Auth) for teachers. Verified-teacher flag for trust.
- Open posting, threaded replies, reactions, categories, moderation tools.
- Comments on lesson resources.
- Weekly digest email of new posts.
- This is where we **beat the Facebook teacher group**, not migrate from it. The goal isn't to bridge — it's to build something so much better that teachers leave Facebook on their own. Better organization, permanent searchable archive, no algorithm hiding posts, linkable from lesson plans, integrated with the resource library and the apps themselves.

**Tier 4 — Suite integration + classroom mode (months 12+)**
- Shared identity across all Sidekick apps. Sign in once on the web, your account works in every app.
- Student accounts (opt-in, with parental/teacher considerations for under-13s).
- Cross-app progress and journaling — your scripture mastery progress shows up linked to your journal entries.
- Classroom mode: a teacher creates a "class" and (opt-in) sees their students' mastery progress, can send group challenges, can run the multiplayer feature from TASK-048 as a live in-class activity.
- Optional API for the apps to read/write to the shared identity layer.

### What this means for v1

- **Stack pick gets harder.** Astro is optimal for Tier 1 alone. Once Tier 3 lands you need real server-side rendering, auth, server actions, and database queries — territory where Next.js is at home and Astro is workable but less idiomatic. See "Tech Stack" below for the trade-off.
- **Site structure is "suite-shaped" from day one,** even with one app live. Routes like `/apps/scripture-mastery` (not just `/`) make adding the second app a 0-day refactor.
- **Content frontmatter is unified.** Blog posts, devotionals, lesson plans, and teacher resources all share a base schema (title, slug, date, tags, audience, body) with optional extras per type. Switching from blog to resource library is metadata, not migration.
- **Identity provider pick is reserved now.** We don't add auth, but we agree on which one we *would* add (likely Clerk or Supabase Auth). That keeps later integration cheap.
- **Domain and subdomain plan is set now.** Apex `seminarysidekick.com` for marketing + suite home. Subdomain reserved like `community.seminarysidekick.com` or path `/community` — depends on stack pick. (See below.)

### Beating the Facebook teacher group — staged approach

We're not migrating. We're building the thing Facebook structurally can't be. Open forums fail without seed content and culture, so we layer in carefully:

1. **Tier 2: curated library + tip submission.** Teachers submit a helpful idea, you (or a few trusted teachers) review and publish. Builds seed content and the benchmark for "this is what good looks like." This phase alone is more valuable than the FB group — searchable, permanent, organized by curriculum week.
2. **Tier 3a: comments on resources.** Authenticated teachers can comment on a published resource. Lower-stakes than open posting; tethered to existing content, easier to moderate.
3. **Tier 3b: open posting with categories.** Once there's critical mass and a clear culture, open the floodgates. Categories from day one: "Weekly Lesson Helps," "Object Lessons," "Engaging Hard-to-Reach Students," "App Feedback," "Off-Topic."
4. **Tier 3c: moderation tooling.** Report button, soft-delete, teacher mods (volunteer leaders), an admin dashboard for you.
5. **Pull, don't push.** Teachers will switch when the value is obvious — when they can find last week's idea instantly, when they can link a lesson plan to a resource, when the AI app integrates with their classroom. We don't ask them to leave Facebook. We make Facebook look like the worse option.

What Facebook structurally can't do that we will:
- Search across years of content
- Categorize by curriculum week, doctrine, age group
- Link directly from a lesson plan to a resource
- Integrate with the apps (a teacher's recommended resource becomes a quick-start tile in the student's app)
- Permanent. No algorithm. No "this post is no longer available."
- Verified teachers — you know you're getting advice from real seminary teachers, not bots

Moderation reality: 50+ active teachers will generate ~5–10 hours/week of moderation. Budget for it or recruit teacher mods early.

---

## Goals & Non-Goals

**Goals**
- Convert visitors into app installs.
- Communicate, in under 10 seconds, what Seminary Sidekick *is* and who it's for.
- Let visitors taste the app via 1–2 playable in-browser demos.
- Showcase the premium Seminary Sidekick AI without exposing a live Grok call.
- Be a long-term home for news, devotionals, and future apps you ship.
- Look and feel like the Flutter app — same warm rust / sage / blue palette, same Merriweather + Inter typography, same calm-but-playful tone.

**Non-goals**
- No user accounts or auth on the site.
- No persistent progress tracking on the web — that lives in the app.
- No replication of the full mastery loop. Demos are sample bites, not the app itself.
- No backend service, no database. The current FastAPI repo gets archived.
- No PWA / "install as app" attempt. The native Flutter app *is* the app.

---

## Audience (in order of priority)

1. **Seminary students** (~14–18). They'll mostly arrive on phones, often shared with friends. Hero and demos must look great on mobile and feel snappy.
2. **Parents and seminary teachers / leaders**. They want to vet the app before recommending it. They need a "for teachers" section and trust signals (privacy, what the AI does, what it costs).
3. **Friends and missionaries** — people who got recommended the app and are checking it out. They need the App Store link in two clicks max.

---

## Tech Stack

**Chosen: SvelteKit + Svelte 5 + Tailwind.** Familiarity with Svelte trumps a lot of other variables for a solo dev, and SvelteKit hits every requirement the long-term vision asks of the stack: static-first marketing, server endpoints for auth and forum APIs, form actions, MDX-equivalent content, and an easy on-ramp to Supabase. Bundle sizes are meaningfully smaller than React-based alternatives, which actually narrows the marketing-performance gap that would have favored a static-only pick like Astro.

### Why SvelteKit works for all 4 tiers

- **Tier 1 (marketing):** SvelteKit with `adapter-static` produces a fully static build with Lighthouse scores competitive with Astro. Svelte's compile-step model means no virtual DOM overhead at runtime.
- **Tier 2 (resource library + suite portfolio):** Just more static pages and MDX content. Same adapter, same deploy.
- **Tier 3 (community + accounts):** Switch the adapter to `adapter-vercel` (or `adapter-node`), add `+server.ts` endpoints for forum APIs, hook up Supabase Auth via SvelteKit hooks. No framework migration.
- **Tier 4 (classroom mode + cross-app identity):** Same SvelteKit app, more routes under `/classroom`, additional Supabase tables, real-time via Supabase subscriptions if we want live progress updates.

### Full stack

| Choice | Why |
|---|---|
| **SvelteKit (latest)** | Scales from static marketing to authenticated forum to classroom dashboards without a framework change. Form actions and load functions are an elegant primitive. |
| **Svelte 5** | Runes (`$state`, `$derived`, `$effect`) are the future. If you've been working in Svelte 4, the transition is small and worth it for a greenfield project. (Open question below — let me know if you'd rather stay on Svelte 4.) |
| **Tailwind CSS** | Matches the Flutter app's design tokens (rust, sage, blue, gold, premium gold) without Bootstrap baggage. First-class SvelteKit support. |
| **shadcn-svelte** | The familiar "copy-the-component-into-your-project" workflow, all Tailwind, fully owned. Built on top of Bits UI + Melt UI under the hood, so we get the accessible behaviors of Melt with the higher-level DX of shadcn. We'll override defaults heavily to match the Sacred Editorial design system (see THEME.md). |
| **mdsvex** | Markdown + Svelte components for `.svx` files. Blog posts, devotionals, lesson plans, teacher resources — all unified under one content schema. |
| **Svelte built-in motion** (`svelte/transition`, `svelte/motion`, `svelte/animate`) | Covers everything we'd have used Framer Motion for, with zero extra bundle. |
| **Plausible** (now) → optional **PostHog** (later) | Plausible for simple privacy-friendly analytics today. Switch or augment with PostHog when we need event funnels and feature flags. |
| **Vercel** | First-class SvelteKit support via `adapter-vercel`. Free tier handles this comfortably; instant deploys, preview URLs per PR, edge functions when we need them. |
| **Resend** | Transactional email and (later) digest emails. Used for launch waitlist form in v1. |

### Reserved for Tier 2/3 (not built now, decided now)

| Future need | Pick | Why reserved now |
|---|---|---|
| **Auth provider** | **Supabase Auth** | Bundled with the database pick, native SvelteKit support via `@supabase/ssr`, handles email + magic link + OAuth, custom user metadata for "verified teacher" flags. One integration to manage instead of two. Runner-up: **Clerk** (`@clerk/sveltekit` works but is less first-class than Clerk on Next.js). Avoid: **Lucia** — the maintainer announced sunset, not future-proof. |
| **Database** | **Supabase (Postgres)** | Free tier, native SvelteKit integration, row-level security for multi-tenant data when classrooms ship, and you've already lived with Postgres in the old stack. |
| **Forum tech** | Roll our own with SvelteKit endpoints + Supabase | A hosted forum (Discourse, Circle) would work but locks us out of integrating with the apps. Owning the data is worth the build cost when the time comes. |
| **File assets for resources** | **Supabase Storage** or **Cloudflare R2** | Lesson plan PDFs, slide decks, downloadables. |
| **Search** (resource library) | **Pagefind** (build-time) for v1, **Meilisearch** or **Typesense** when content grows | Pagefind is free and works on static content; we graduate when we need typeahead and faceted search. |

### Domain + subdomain plan

- **`seminarysidekick.com`** — apex, marketing + suite home + blog + resource library.
- **`community.seminarysidekick.com`** — reserved. If we ship community in the same Next.js app, this is just a route group `/community/*`. If we ever peel it off, the DNS is already mapped right.
- **`apps.seminarysidekick.com`** — reserved for a future "all the apps" portfolio page or app launcher. Could also just be `/apps`.
- **`teach.seminarysidekick.com`** — reserved for the teacher hub if we want a separate identity. Otherwise `/teach`.

---

## Visual System

Pulled directly from `lib/theme/app_theme.dart` so the site and the app feel like one product.

**Colors**
- Primary: warm rust `#D9805F` — main CTAs, headings, "Get the app" buttons
- Secondary: sage `#618C84` — secondary actions, alternating sections
- Accent: calm blue `#5B8ABF` — links, highlight strokes
- Gold `#F2C14E` — star/achievement accents in demos
- Premium gold `#D4A843` + light tint `#F5E6B8` — premium AI section only
- Dark text `#2A2A2A`, off-white background `#FAF7F2`, surface `#FFFFFF`

**Typography**
- Headings: Merriweather (Google Fonts), weight 700/900
- Body and UI: Inter (Google Fonts), weight 400/500/600
- Long-form blog body: Merriweather 400 for readability, 18px base

**Motion language**
- Slow, warm easing (cubic-bezier(0.22, 1, 0.36, 1)).
- Tile/card hover lift = 4px translateY + soft shadow expansion.
- Hero phone mockup floats subtly (~6px Y, 8s loop).
- "Confetti" moment when a demo round is perfect — same vibe as in-app celebrations.
- No carousel auto-rotation. No surprise modals.

**Tone**
- Reverent but fun. Same voice the app uses on the home screen.
- Talk to seminary students directly. Parents/teachers get a dedicated section, not patronizing copy in the main flow.

---

## Site Map

Structured "suite-shaped" from day one so Tier 2/3 additions are drop-in, not refactors. Routes shown as `[Tier N]` exist in the plan but ship later.

```
/                          Home — suite framing, hero for the flagship app, how it works, demos, premium peek, for teachers, CTA
/apps                      [Tier 2] Suite overview — all apps as cards
/apps/scripture-mastery    Product page for the Flutter app (the only app live in Tier 1)
/apps/[future-slug]        [Tier 2+] Future Sidekick apps — each gets its own page

/quick-quiz                Standalone playable demo (also embedded on /)
/scripture-match           Standalone playable demo (also embedded on /)

/premium                   Seminary Sidekick AI deep-dive (journal prompts, goals, chat)
/for-teachers              Classroom / group-use pitch (Tier 1: static page)
/teach                     [Tier 2] Teacher resource library — searchable, filterable, downloadable assets
/teach/[slug]              [Tier 2] Individual resource (MDX + downloads)
/teach/submit              [Tier 2] "Submit a tip" form for teachers (curated, not open)

/community                 [Tier 3] Forum index — categories, latest threads
/community/[category]      [Tier 3] Category listing
/community/[category]/[id] [Tier 3] Thread + replies

/classroom                 [Tier 4] Teacher classroom dashboard (auth required)

/news                      Blog index — devotionals, release notes, future-app teasers
/news/[slug]               Individual post (MDX)

/about                     Who's building this and why
/privacy                   Privacy policy
/terms                     Terms of use
/contact                   Email + simple form
/sign-in                   [Tier 3] Auth (Clerk)
```

Footer everywhere: socials, App Store / Play Store buttons, privacy, terms, contact, "© Seminary Sidekick."

---

## Homepage, Section by Section

### 1. Nav bar
- Logo (left), nav links (How it works · Premium · For teachers · News), App Store + Play Store buttons (right, primary CTA color).
- Mobile: hamburger; CTAs always visible at top.

### 2. Hero
- Headline: **"Master all 100 doctrinal mastery scriptures."**
- Sub: "A focused, fun, reverent way to study, build, prove, and master."
- Small kicker above the headline: **"The Seminary Sidekick Suite — App 1 of more to come."** (Plants the suite framing without overpromising. Removable if you'd rather lead with the single app for Tier 1.)
- Floating phone mockup showing the app's scripture detail screen, with a subtle parallax/float loop.
- Two CTAs: primary "Get on App Store" + secondary "Try a Quick Quiz →" (scrolls to demo).
- Optional badge: "Built for seminary students. Free to start."

### 3. How it works — the mastery loop
- Four illustrated steps mirroring the app: **Study → Build → Prove → Master.**
- Each step gets a card with: icon, one-line description, a tiny inline animation (e.g., the Scripture Builder chunks snapping into place).
- This is the most under-told story on the current site. It needs to be the second thing every visitor sees.

### 4. Try it: Quick Quiz demo (React island)
- 5 questions, picked from a fixed sample set (~15 doctrinal mastery passages in `public/data/passages.json` — we already have this data).
- Same look as the app's Quick Quiz screen.
- At the end: a celebration moment + "Want the other 95 scriptures, mastery tracking, and the AI Sidekick? Get the app." with the store buttons.
- No login. No score persistence. Pure taste-test.

### 5. Try it: Scripture Match demo (React island)
- One round, ~8 pairs, drag-and-drop or tap-to-select.
- Ends with the same store-CTA card.

### 5b. Class Play — live, class-wide multiplayer (Coming soon)
- Sits right after the two solo demos so the pivot lands: "you just played alone — now imagine your whole class on the same board, live."
- Eyebrow "Coming soon · Class Play", headline "Like Kahoot, for scripture mastery.", one-line sub.
- Visual: stylised live-leaderboard mockup (faux class code, active question card, 3-4 plausible first names with scores).
- Primary CTA: inline teacher waitlist form (`<WaitlistForm placement="homepage" />`). Submissions go to Formspree (or whichever endpoint is configured in `src/lib/config/site.ts` — log-only fallback if unconfigured).
- Secondary CTA: outlined "Read more →" linking to `/for-teachers#class-play` where the feature gets a full pitch.
- The viral mechanic of the whole product. Ships in a later Flutter update; the site advertises it now so it has momentum on launch day.

### 6. Premium peek — Seminary Sidekick AI
- Two-up: a screenshot of the chat / journal prompt and a short bullet list of what the AI does (daily prompt, goal suggestion, reflection questions, smart connections).
- "Learn more about Premium →" link to `/premium`.
- Visual treatment uses premium gold gradient so it reads as distinct.

### 7. For teachers and parents
- Three-sentence pitch: "Seminary Sidekick fits in a 5-minute class warmup or a personal study habit at home."
- Trust signals: no ads, age-appropriate, AI is curated for doctrinal mastery (not open chat), privacy-first.
- Soft tease for what's coming: "Soon: a resource library and a community to swap lesson ideas with other teachers."
- "For teachers →" link to `/for-teachers`.

### 8. What's new (latest from /news)
- Three most recent posts. Title, date, 1-line excerpt.
- "All posts →" link.

### 9. Final CTA
- Big band, primary color, "Start with the first scripture. Get the app." + store buttons.

### 10. Footer
- Socials, store buttons, links, copyright.

---

## Interactive Demos — Design Notes

The demos are the single biggest reason this isn't just an HTML page. Keep them honest to the app:

- Use the **exact** styling, fonts, and haptic-feeling micro-animations from the Flutter app (we can't do real haptics on web, but visual+sound substitutes work).
- Use the same scripture data (`public/data/passages.json` from the old repo — port it forward).
- Cap the demo so the user finishes a round in 30–60 seconds. Long enough to feel the loop, short enough that they actually click "Get the app" before getting bored.
- **No "play again" loop.** After one round, the only path forward is the store CTA. This is intentional — we're a tasting menu, not a buffet.

What we do *not* port from the old site:
- Auth, Redux store, profile page, messaging page, dashboard, journal/affirmation page, FastAPI backend, GraphQL schema, PostgreSQL tables.

What we keep (verbatim or near-verbatim):
- `public/data/doctrinalMastery.json` and `public/data/passages.json` — the scripture dataset.
- Logo, favicon, manifest (we'll redesign manifest for the new domain).
- A handful of the temple background images if any are still on-brand. (Probably we redesign visuals anyway.)

---

## Premium / Sidekick AI Page (`/premium`)

A deeper sell, but still static:

- Hero strip with the premium gold gradient and a one-liner: "Your AI study companion."
- "What you get" — daily prompt, journal with dynamic prompts, suggested goals + timeline, reflection questions, scripture connections, chat with Sidekick.
- Sample screenshots (real ones, lifted from the app — pre-launch we can record these from the simulator).
- Sample outputs as cards: a daily prompt, a reflection question, a suggested goal. Static copy, hand-curated to be representative.
- Pricing if you have it set: monthly / annual via RevenueCat. If pricing is still in flux, "Free trial inside the app."
- CTA: "Try Premium in the app."

We do **not** expose a live Grok call on the website. Reasons: API cost, abuse risk, no auth to throttle, and it would undercut the premium subscription. Static curated examples are honest and cheap.

---

## For Teachers (`/for-teachers`)

A short page aimed at seminary teachers and leaders:
- "Why we built this" — 2 paragraphs, your own voice.
- "How a class can use it" — 5-minute warmup, individual practice, group competition (this hooks into the future multiplayer feature, TASK-048).
- "What about AI safety?" — explain the curated nature of Sidekick (doctrinal-mastery-scoped, not open chat), age-appropriateness, no data sold.
- "Get in touch" — email link for leaders who want to organize their class.

This page doesn't need to be fancy. It just needs to exist so when a teacher Googles or a parent asks, they have a real answer.

---

## News / Blog (`/news`)

- MDX-driven. Posts live at `src/content/news/*.mdx` with frontmatter (title, date, slug, excerpt, optional cover image).
- Categories or tags: "Devotional", "App update", "Behind the scenes", "Future apps", "Teacher tips."
- RSS feed auto-generated by Astro.
- Each post gets Open Graph image generation (Astro can do this at build time).
- No comments. (Comments would require auth and moderation; not worth the cost.)

This is also where you announce **future apps**. When you ship app #2, the first audience is the people already on this site.

---

## App-Store-Ready CTAs

Given you're ~1 day from being in the store, I'd build the site assuming **launch happens before the site does**. That means:
- Real Apple App Store badge with a placeholder URL we swap on launch day.
- Real Google Play badge if you're shipping there at the same time, otherwise a "Coming soon to Android" pill.
- Optional waitlist form (email capture via Resend) for the Android case, so Android-curious visitors don't bounce.
- One single source of truth for the store URLs — a `src/config/store.ts` exporting `IOS_URL`, `ANDROID_URL`, and `ANDROID_AVAILABLE: boolean`. Every CTA reads from this. Launch-day update is one file.

---

## SEO + Social

- Per-page `<title>`, `<meta name="description">`, Open Graph tags, Twitter card tags.
- JSON-LD structured data: `SoftwareApplication` schema on home, `Article` schema on blog posts, `Organization` on about.
- Auto-generated sitemap.xml and robots.txt.
- Open Graph images per page (built at build time using Astro's image API + a template).
- Target keywords: "doctrinal mastery app", "seminary scripture memorization", "LDS seminary scripture mastery", "scripture mastery games", etc. We'll write the first post around one of these.

---

## Analytics + Funnel

What we want to learn:
- Where do install conversions come from? (Hero CTA vs end-of-demo CTA vs footer.)
- Do the demos help conversion? (Compare visitors who played vs didn't.)
- Which posts pull traffic? (To shape future content.)

Setup:
- Plausible for basic privacy-friendly pageviews. Or PostHog if we want events and a funnel view.
- Custom events on: `hero_cta_clicked`, `demo_started`, `demo_completed`, `demo_cta_clicked`, `footer_cta_clicked`, `news_post_opened`.
- Apple App Store and Google Play UTM-tagged links so we can see web → store dropoff.

---

## Repo + Hosting Plan

**Option A — new repo** (cleanest):
- Create `seminary-sidekick-site` as a fresh repo.
- Archive the current `seminary-sidekick` repo: add a deprecation note to README, push, leave it on GitHub for history.
- Wire `seminary-sidekick-site` to Vercel/Netlify with the production domain.

**Option B — same repo, new branch + reset**:
- Cut a `legacy` branch from `main`, push it (keeps history visible).
- On `main`, delete everything except `public/data/*.json` and start the Astro project.
- Slightly messier history, but only one repo to manage.

I'd recommend **A**. The legacy code carries a Dockerfile, a FastAPI backend, and Postgres setup that we never want to see again.

---

## Phased Build Plan

With parallel agents the build collapses to two big phases plus polish. See `TODO.md` for the task-by-task breakdown.

**Phase A — Foundation** (~2–4 hours, must run serial, one agent)
- Scaffold SvelteKit + TypeScript + Tailwind + shadcn-svelte.
- Port the Sacred Editorial design tokens from `THEME.md` into `tailwind.config.js` and `src/app.css`.
- Project structure scaffold: layout shell, nav, footer skeleton, route stubs for every planned page.
- `src/lib/config/store.ts` with iOS/Android URLs and feature flags.
- Vercel deploy + preview URLs.
- mdsvex configured for `.svx` content.
- Commit the new repo. From here, all subsequent work can fan out.

**Phase B — Parallel build** (~1 day with 5–10 agents running in parallel)
Foundation is done. Every section of the site is now its own self-contained file (e.g., `src/lib/components/sections/Hero.svelte`) so agents can work in parallel without touching each other's files. The homepage `+page.svelte` is just a composition shell that imports the sections.

Task families running in parallel:
- Homepage sections: Hero, How-it-works, Premium peek, For teachers strip, News preview, Final CTA.
- Demos: Quick Quiz (own folder), Scripture Match (own folder).
- Static pages: `/premium`, `/for-teachers`, `/apps`, `/apps/scripture-mastery`, `/about`, `/privacy`, `/terms`, `/contact`.
- News plumbing + 2 seed posts.
- SEO meta + structured data + sitemap + OG image generation.
- Footer (deep version), 404 page, page transitions.

**Phase C — Composition + polish** (~3–4 hours, serial)
- Wire all the parallel-built sections into the homepage.
- Cross-browser QA pass (iOS Safari, Android Chrome, desktop everything).
- Lighthouse pass — target 95+ on all four scores.
- Swap placeholder store URLs for real App Store / Play Store URLs on launch day.

**Realistic total: 2 focused days** (≈ 16 hours of human + agent time, calendar-time depends on how aggressively we parallelize). Site can go live after Phase A + the homepage Hero + How-it-works tasks if we want a "soft launch" before everything ships.

Bottlenecks that don't compress with more agents:
- Design/copy decisions that need owner input (taglines, hero photo selection, voice).
- Real screenshots from the Flutter app (needs simulator captures).
- DNS setup, store URL swap, App Store listing review (Apple-side).
- Content authoring you want to write yourself (first news post, About page voice).

---

## What Happens to the Old Repo

1. Final commit on `main` adding a `DEPRECATED.md` at the root: short note explaining the rewrite, link to the new site repo, kept for historical reference only.
2. Update the README's first paragraph to say "This codebase has been archived. See [new repo]."
3. Stop any running Docker deployments. (If anything is currently live from this repo, take it down or 301 redirect to the new site.)
4. Optional: rename the GitHub repo to `seminary-sidekick-legacy` to make the deprecation obvious.

The FastAPI + Postgres backend stops running. The scripture JSON is the only artifact that moves forward.

---

## Open Questions for You

**Tier 1 — needed before I build anything**

1. **Domain.** What domain are you using? `seminarysidekick.com`? Something else? Is it registered, pointed somewhere?
2. **Branding.** "Seminary Sidekick" leads, with the suite framing as a kicker — sound right? Confirming "BattlefieldSeminary" is dead.
3. **Logo + key art.** Do you have a final logo and any app screenshots you want featured? If not, I'll build placeholders and you swap them in later.
4. **Pricing.** What's the Premium price? Do we say it on the site or just "Free trial inside the app"?
5. **Android.** iOS-only first, or both stores? Affects the "Coming soon to Android" copy.
6. **First news post.** Want me to draft a "Seminary Sidekick is live" launch post as part of the build, or will you write that?
7. **Analytics.** Plausible (simple, ~$9/mo) or PostHog (free tier, more powerful, more setup)?
8. **Email capture.** Should the site have any email signup beyond a launch waitlist? (e.g., "monthly devotional" newsletter.)

**Tier 2/3 — directional, not blocking v1**

9. **Future apps.** What's app #2? Journal? Even a working name shapes how aggressively we lean on "the Suite" framing in Tier 1 copy.
10. **Teacher resource library scope.** Roughly how many resources do you want at launch of Tier 2? 20 hand-curated? 100? Helps decide if we need search from day one or can start with simple category pages.
11. **Classroom mode timing.** Is Tier 4 (teacher dashboards with student progress) something you actively want soon, or a "nice to have someday"? Decides how much we wire account-shape data into the apps now.
12. **Moderation.** When the community ships, are you doing the moderation, or recruiting volunteer teacher mods? Affects what tooling we build into the forum from the start.

**Locked decisions (no longer questions)**

- Stack: SvelteKit + Svelte 5 + TypeScript.
- Component library: shadcn-svelte.
- Styling: Tailwind, design tokens from `THEME.md`.
- Content: mdsvex (`.svx` files).
- Auth (when needed): Supabase Auth.
- Database (when needed): Supabase (Postgres).
- Hosting: Vercel.
- We are **not** integrating with Facebook. The goal is to build something better.

---

## What I'd Do Next

Once you've reviewed this and answered the open questions, the natural next step is **Phase 0 + Phase 1**: scaffold the new Astro repo, port the design tokens, and stand up a real homepage shell. That alone replaces today's "BattlefieldSeminary" landing page with something that actually sells the app, and it's a small enough chunk that you can see it work end-to-end before we invest more time.
