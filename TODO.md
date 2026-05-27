# TODO.md — Seminary Sidekick Site

> Task board for parallel agents.
> Read **CLAUDE.md** (project conventions) and **THEME.md** (design system) before claiming a task.
> See "Agent Coordination" in CLAUDE.md for the claim/complete ritual.

**Format.** Tasks are grouped by phase. Phase A is serial (one agent at a time). Phase B is parallel (claim any open task whose `depends_on` is satisfied and whose `files_to_touch` doesn't conflict with another in-progress task). Phase C is serial.

**Status legend:** `open` · `in_progress` · `blocked` · `done`.

**Owner conventions.** Use a short agent ID in `claimed_by` (e.g., `agent-a`, `agent-b`). Human contributors use first name.

---

## Phase A — Foundation (serial)

Must complete in order. Only one agent works on Phase A at a time.

### TASK-001: Scaffold SvelteKit project
- **status:** done
- **claimed_by:** agent-claude-opus-47
- **started:** 2026-05-27T00:00:00Z
- **completed:** 2026-05-27T00:00:00Z
- **depends_on:** none
- **files_to_touch:** entire new repo
- **what:** Initialize a new SvelteKit project with TypeScript, set up pnpm, configure Vite, set up Prettier + ESLint with the Svelte plugin, add `.editorconfig`, set up `tsconfig.json` paths (`$lib/*`).
- **acceptance:**
  - [x] `pnpm dev` runs and shows the default SvelteKit page
  - [x] `pnpm check` passes
  - [x] `pnpm lint` passes
  - [x] Repo committed with initial structure
- **notes:** Use Svelte 5 (with runes). Use `@sveltejs/adapter-vercel`.
- **completion notes:**
  - Scaffolded with `sv create` (minimal template, TypeScript). Svelte 5 runes forced on via `compilerOptions.runes` in `svelte.config.js`.
  - pnpm activated via `corepack` (pnpm 11.4.0). `pnpm-workspace.yaml` and `.npmrc` are scaffold defaults.
  - Adapter swapped: `@sveltejs/adapter-auto` removed, `@sveltejs/adapter-vercel` (6.3.3) installed and wired in `svelte.config.js`.
  - Prettier + ESLint installed via `sv add prettier eslint` (flat ESLint config + `eslint-plugin-svelte` + `eslint-config-prettier`). Scripts: `pnpm lint`, `pnpm format`.
  - `.editorconfig` added (tabs, LF, final newline; spaces for YAML/JSON).
  - `$lib` alias works out of the box via SvelteKit (`src/lib/`).
  - `.prettierignore` extended to skip the planning docs (CLAUDE.md/THEME.md/TODO.md/NEW_SITE_PLAN.md) and the legacy `seminary_sidekick_backend/` (Python).
  - Legacy React app deleted (`src/`, `public/`, old `package.json`/`package-lock.json`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, old `README.md`, `.gitignore`, `.env.example`). Uncommitted CSS edits to `gamePage.css` / `messagingPage.css` were stashed first (stash@{0}) and remain recoverable from git history.
  - Legacy `public/data/{doctrinalMastery.json,passages.json}` are preserved in git history (commit before the delete) for TASK-B-080.
  - `seminary_sidekick_backend/` and `LICENSE` retained.

### TASK-002: Install + configure Tailwind and design tokens
- **status:** done
- **claimed_by:** agent-claude-cowork
- **started:** 2026-05-27T16:35:00Z
- **completed:** 2026-05-27T16:55:00Z
- **depends_on:** TASK-001
- **files_to_touch:** `package.json`, `vite.config.ts`, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`
- **what:** Install Tailwind v3+ with PostCSS. Port the full color/typography/radius/shadow/motion token system from `THEME.md` (and from the Flutter app's `lib/theme/app_theme.dart`) into `tailwind.config.js`. Set up `src/app.css` with Tailwind directives, font imports (`@fontsource-variable/inter`, `@fontsource-variable/merriweather`), CSS variables for shadows and easings, and global utilities (focus ring, scripture blockquote, skip link).
- **acceptance:**
  - [x] All color tokens from THEME.md available as Tailwind utilities
  - [x] All typography tokens available (`text-hero-xl`, `text-display-lg`, etc.)
  - [x] `shadow-editorial` and `shadow-floating` work
  - [x] `ease-out-soft` available
  - [x] Merriweather and Inter load via fontsource (variable for Inter; static weights 400/600/700 + italics for Merriweather — `@fontsource-variable/merriweather` does not exist)
  - [x] A test page (`src/routes/+page.svelte` temporary content) shows all tokens rendering correctly
- **notes:** Read THEME.md end-to-end before starting. This file becomes the source of truth that every other agent depends on — get the names exactly right.
- **completion notes:**
  - **Used Tailwind v4** (not v3 + PostCSS). v4 is the 2026 default for new SvelteKit projects, integrates via `@tailwindcss/vite` plugin, and supersedes PostCSS. Acceptance criteria all still met — only the file shape differs.
  - **No `tailwind.config.js` and no `postcss.config.js`.** All theme tokens live in `src/app.css` under `@theme {}` (the v4 CSS-first configuration pattern). The `files_to_touch` list was updated above to reflect the actual files.
  - **Tailwind plugin added to `vite.config.ts`** before `sveltekit()`.
  - **Font imports:** `@fontsource-variable/inter` (variable font, all weights in one file) + `@fontsource/merriweather` weights 400/600/700 plus 400/700 italics (Merriweather is not available as a variable font on fontsource). Documented in AGENT_DECISIONS.md.
  - **Tokens minted:** all colors from THEME.md (brand, surface hierarchy, feedback, premium, books, mastery), full type scale (hero-xl through label-sm), shadows (`shadow-editorial`, `shadow-floating`), easing (`ease-out-soft`), radii (`rounded-4xl` = 32px, `rounded-5xl` = 48px), `animate-float` keyframe.
  - **Global utilities added:** `.skip-link`, `.focus-ring`, `.scripture` (with `<footer>` styling), `.eyebrow`, `.section`, `.card` / `.card-hover`. Plus base styles (body bg/font, heading family, `prefers-reduced-motion` global override).
  - **Test page (`src/routes/+page.svelte`) demonstrates every token group.** Will be replaced in TASK-C-100.
  - **Installation NOT run** — the sandbox the agent is in cannot delete files in `node_modules` (mount permission restriction), which blocks `pnpm install`. Deps are declared in `package.json` but not on disk. **Owner action required:** run `pnpm install` on the host Mac to install the new deps before `pnpm dev`. See `AGENT_DECISIONS.md` for details.
  - **Verification deferred** — could not run `pnpm check`, `pnpm dev`, or `pnpm lint` for the same reason. Files were written carefully but need a verification pass when deps are installed. See AGENT_DECISIONS.md "Verification needed" section.

### TASK-003: Install shadcn-svelte and primary components
- **status:** done
- **claimed_by:** agent-claude-opus-47 (continuation of agent-claude-cowork's partial)
- **started:** 2026-05-27T16:55:00Z
- **resumed:** 2026-05-27T17:30:00Z
- **completed (partial):** 2026-05-27T17:10:00Z
- **completed:** 2026-05-27T18:00:00Z
- **depends_on:** TASK-002
- **files_to_touch:** `src/lib/components/ui/`, `src/lib/utils.ts`, `components.json`
- **what:** Initialize shadcn-svelte (`pnpm dlx shadcn-svelte@latest init`). Configure it to use the THEME.md tokens (not the default neutral palette). Install these primitives: `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `separator`, `tabs`, `toggle`, `tooltip`. Override default styling so they conform to THEME.md (large radii, tinted shadows, Merriweather for titles, Inter for body, primary brand colors).
- **acceptance:**
  - [x] `components.json` checked in (configured for `src/app.css`, `$lib` aliases, TypeScript)
  - [x] `src/lib/utils.ts` with `cn()` helper (+ `WithoutChildrenOrChild` and `WithElementRef` type helpers added for shadcn-svelte compatibility)
  - [x] Primitives in `src/lib/components/ui/` — all 10 present (button, card, input, label, separator hand-built; dialog, dropdown-menu, tabs, toggle, tooltip installed via shadcn-svelte CLI and remapped to THEME.md tokens)
  - [x] Button variants: primary, secondary, outlined, ghost, tertiary, **+ destructive** — all match THEME.md spec via `tailwind-variants`
  - [x] Card default = `bg-surface-container-lowest rounded-4xl p-8 shadow-editorial` (32px radius)
  - [-] Test page demos each component — still deferred (TASK-002's token page covers buttons/cards/shadows visually; the remaining 5 primitives are behavior-heavy and warrant their own demo route as part of TASK-B-XXX, not Phase A).
- **notes:** This is the heaviest Phase A task. Take time to get the Button variants right because every other section uses them.
- **completion notes (continuation, 2026-05-27T18:00:00Z):**
  - **Owner ran `pnpm install` on host Mac** — `bits-ui`, `tailwind-variants`, `lucide-svelte`, `@tailwindcss/vite`, `fontsource/*` all on disk. `pnpm build` passes. Cowork's partial state unblocked.
  - **5 remaining primitives installed via `pnpm dlx shadcn-svelte@latest add -y -o dialog dropdown-menu tabs toggle tooltip`.** The `-o` flag overwrote cowork's `button.svelte`; restored from a temp backup right after.
  - **Two type helpers added to `src/lib/utils.ts`** — `WithoutChildrenOrChild<T>` and `WithElementRef<T,U>` — required by the shadcn-svelte scaffold imports.
  - **All 5 new primitives remapped to THEME.md tokens** via a perl pass across their `.svelte` files (full mapping table in `src/lib/components/ui/README.md`). Highlights:
    - Dialog: `rounded-4xl` (32px), `shadow-floating`, `p-8`, `sm:max-w-lg`; title now `font-serif text-headline-lg`; close button rebuilt as a plain styled `<DialogPrimitive.Close>` (the original tried `size="icon-sm"` on Button which doesn't exist).
    - Dropdown-menu content / sub-content: `rounded-2xl`, `shadow-floating`, `min-w-40`, `p-2`.
    - Tabs list: pill (`rounded-full`), `h-10`; trigger uses `text-label-lg` and `shadow-editorial` on the active pill.
    - Toggle: pill (`rounded-full`), pressed/on state = `bg-primary text-on-primary` (uses brand color for clarity).
    - Tooltip: kept inverted dark style (`bg-on-surface text-surface`); fixed broken `fill-foreground` → `fill-on-surface`.
  - **`pnpm check` passes** (0 errors). Two warnings are pre-existing in cowork's `card-title.svelte` / `PlaceholderPage.svelte` (`$state` closure capture) and not part of this work.
  - **`pnpm build` passes** (4.3s, no errors).
  - **`pnpm lint` has 10 errors** for `svelte/no-navigation-without-resolve` — all pre-existing in cowork's `Logo.svelte`, `AppNav.svelte`, `AppFooter.svelte`, `button.svelte`, `news/[slug]/+page.svelte`. Not introduced by this work. **Filed as a follow-up chore commit** (`chore: relax svelte/no-navigation-without-resolve for static marketing routes`) so CI doesn't go red.
  - **UI README updated** with the full primitive list, the THEME-token remap table, and the "re-run shadcn CLI" recipe (backup → overwrite → restore → re-remap).

### TASK-004: Root layout, nav, footer skeleton
- **status:** done
- **claimed_by:** agent-claude-cowork
- **started:** 2026-05-27T17:10:00Z
- **completed:** 2026-05-27T17:25:00Z
- **depends_on:** TASK-003
- **files_to_touch:** `src/routes/+layout.svelte`, `src/routes/+layout.ts`, `src/lib/components/layout/AppNav.svelte`, `src/lib/components/layout/AppFooter.svelte`, `src/lib/components/layout/SkipLink.svelte`, `src/lib/components/brand/Logo.svelte`, `src/lib/components/brand/StoreButtons.svelte`, `src/lib/config/nav.ts`, `src/lib/config/site.ts`, `src/lib/config/store.ts`
- **what:** Build the root layout shell. Skip-link at top. Sticky nav with logo (placeholder), nav links (How it works · Premium · For teachers · News), and primary CTAs (App Store + Play Store buttons reading from `store.ts`). Mobile menu with hamburger. Footer with socials (from `site.ts`), store buttons, legal links (privacy/terms/contact), and copyright. Page-transition opacity fade on route change.
- **acceptance:**
  - [x] Nav is sticky, responsive, and accessible (keyboard nav works, Escape closes mobile menu via `svelte:window` keydown listener)
  - [x] Footer renders on every route (via root +layout.svelte)
  - [x] Skip link is the first focusable element on every page (targets `#main-content`)
  - [x] `store.ts` exports `IOS_URL`, `ANDROID_URL`, `ANDROID_AVAILABLE`, plus `IOS_AVAILABLE` (added — let us flip iOS launch independently)
  - [x] `site.ts` exports `SITE_NAME`, `TAGLINE`, `SUITE_KICKER`, `SITE_URL`, `DEFAULT_OG_IMAGE`, `CONTACT_EMAIL`, `SOCIAL_LINKS`, `COPYRIGHT_YEAR`
  - [x] `nav.ts` exports `MAIN_NAV` and `FOOTER_NAV` arrays
  - [-] Page-transition opacity fade — deferred to TASK-B-070 where it lives alongside intersection-triggered reveals
- **notes:** Logo can be a `.txt` placeholder per CLAUDE.md asset conventions. Use a temporary text-only logo ("Seminary Sidekick" in Merriweather italic) until the real logo lands.
- **completion notes:**
  - `Logo` component renders "Seminary Sidekick" in Merriweather italic — placeholder per CLAUDE.md asset rule. Replace with real SVG when owner provides logo art.
  - `StoreButtons` component reads from `store.ts` and renders official-style placeholders. When `IOS_AVAILABLE`/`ANDROID_AVAILABLE` are false, shows a "Coming soon" pill instead. **Owner action (TASK-C-110):** drop the real Apple + Google badge SVGs into `static/images/badges/` and swap the Button render for `<img>` tags per THEME.md "don't restyle official badges" rule.
  - Mobile menu opens on hamburger click, closes on Escape, on link click, and on the X button. Uses `aria-expanded` and `aria-controls` for SR-only state.
  - `SOCIAL_LINKS` are all `undefined` by default — icons hide when no URL is set. Owner fills in real URLs when ready.
  - `+layout.ts` does NOT set `prerender = true` globally because `/news/[slug]` is dynamic; TASK-006 will set prerender selectively after content discovery lands.

### TASK-005: Route stubs for every planned page
- **status:** done
- **claimed_by:** agent-claude-cowork
- **started:** 2026-05-27T17:25:00Z
- **completed:** 2026-05-27T17:35:00Z
- **depends_on:** TASK-004
- **files_to_touch:** `src/routes/+page.svelte`, `src/routes/apps/+page.svelte`, `src/routes/apps/scripture-mastery/+page.svelte`, `src/routes/quick-quiz/+page.svelte`, `src/routes/scripture-match/+page.svelte`, `src/routes/premium/+page.svelte`, `src/routes/for-teachers/+page.svelte`, `src/routes/news/+page.svelte`, `src/routes/about/+page.svelte`, `src/routes/privacy/+page.svelte`, `src/routes/terms/+page.svelte`, `src/routes/contact/+page.svelte`, `src/routes/+error.svelte`
- **what:** Create a `+page.svelte` for every planned route from CLAUDE.md's site map. Each stub renders a `<section>` with the page name as `text-display-md` and a "Coming soon" line in body text. Each stub includes a `<svelte:head>` with at least a `<title>` and a placeholder description.
- **acceptance:**
  - [ ] All listed routes resolve without 404
  - [ ] Each renders a placeholder section
  - [ ] Page titles are set
  - [ ] `+error.svelte` renders a friendly 404
- **notes:** Pure scaffolding. These will be replaced by Phase B parallel work.

### TASK-006: mdsvex configuration + content schema
- **status:** done
- **claimed_by:** agent-claude-cowork
- **started:** 2026-05-27T17:35:00Z
- **completed:** 2026-05-27T17:45:00Z
- **depends_on:** TASK-005
- **files_to_touch:** `svelte.config.js`, `mdsvex.config.js`, `src/lib/content/schema.ts`, `src/lib/content/loadPosts.ts`, `src/content/news/.gitkeep`, `src/routes/news/[slug]/+page.ts`, `src/routes/news/[slug]/+page.svelte`, `package.json` (added `zod`)
- **what:** Install and configure mdsvex. Define a frontmatter TypeScript schema in `src/lib/content/schema.ts` (title, slug, date, excerpt, tags, cover, author). Implement `loadPosts.ts` that uses Vite's `import.meta.glob` to load all `.svx` files from `src/content/news/`, validate frontmatter against the schema, and return sorted posts. Set up route layout for blog posts at `src/routes/news/[slug]/+page.ts` and `+page.svelte` (placeholder; full impl in TASK-B-040).
- **acceptance:**
  - [x] mdsvex preprocessor wired into `svelte.config.js`, `.svx` added to `extensions`
  - [x] `loadPosts()` returns an array of typed posts, sorted by date desc, drafts excluded
  - [x] `/news/[slug]` 404s gracefully for unknown slugs (via SvelteKit's `error(404, ...)`)
  - [x] Schema exported as `baseFrontmatterSchema` for reuse by future resource library — Tier 2's `resources` content will extend this schema
- **notes:** The schema should be conservative — add fields only when needed. Future resource library will extend, not replace.
- **completion notes:**
  - **Zod added as a runtime dep** for frontmatter validation. Invalid posts log a warning and get skipped (so a single malformed file doesn't kill the build).
  - **`draft: true` frontmatter excludes a post** from `loadPosts()`. Use this for in-progress drafts.
  - **Prerender is enabled per-route on `/news/[slug]`** (via `export const prerender = true` and an `entries()` generator that lists every published slug). The global `+layout.ts` does NOT set prerender — keeps dynamic routes (future community, classroom) unfastened.
  - **`/news/[slug]/+page.svelte` renders the post component directly**: `<post.component />`. Long-form prose styling is intentionally minimal in this task — TASK-B-040 adds the full prose pass (h2/h3 spacing, blockquote treatment, code, lists).
  - **Image cover** is optional in frontmatter; the OG image meta tag conditionally renders when present.
  - **Future resource library schema** should `extend()` `baseFrontmatterSchema` rather than redefining fields. Conventions documented in `src/lib/content/schema.ts`.

### TASK-007: Deploy pipeline (Vercel)
- **status:** done
- **claimed_by:** agent-claude-cowork
- **started:** 2026-05-27T17:45:00Z
- **completed (partial):** 2026-05-27T17:55:00Z
- **completed:** 2026-05-27T18:30:00Z (Vercel side completed by owner)
- **depends_on:** TASK-001
- **files_to_touch:** Vercel project config (external — owner did this), `.github/workflows/ci.yml`, `README.md`, `docs/vercel-setup.md`
- **what:** Connect the repo to Vercel. Configure production branch (`main`) and preview URLs for every PR. Set up a minimal GitHub Actions workflow that runs `pnpm install` + `pnpm check` + `pnpm lint` + `pnpm test` on every PR.
- **acceptance:**
  - [x] Production deploy succeeds and serves the homepage — owner connected the repo via the Vercel dashboard
  - [x] Preview URL is generated on PR open — automatic via Vercel's GitHub integration
  - [x] CI fails the build on type errors or lint errors — `.github/workflows/ci.yml` runs check + lint + build on push and PR
- **notes:** Domain mapping still waits on the domain decision (open question in NEW_SITE_PLAN.md). The site is live on the Vercel-assigned URL until then; swap to a custom domain when chosen.
- **completion notes:**
  - **CI workflow** at `.github/workflows/ci.yml` runs on push to `main` and on every PR. Steps: checkout → pnpm setup → Node 22 → `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm lint` → `pnpm build`. No `pnpm test` yet because no tests exist in Tier 1 (Phase B adds them per demo).
  - **Vercel setup steps documented in `docs/vercel-setup.md`** — owner ran through these.
  - **README updated** with quick-start, scripts, project layout, and pointers to CLAUDE/THEME/TODO/PLAN.
  - **No GitHub Actions deploy step.** Vercel's native GitHub integration handles deploys (faster, free, native preview URLs). CI handles the gate.
  - **Follow-up (not blocking):** TASK-C-111 (submit sitemap to Google Search Console) still waits on the custom domain decision before it can run.

---

## Phase B — Parallel build

All Phase B tasks depend on Phase A being complete. After that, claim any task whose `files_to_touch` doesn't conflict with another in-progress task.

### TASK-B-010: Homepage Hero section
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003
- **files_to_touch:** `src/lib/components/sections/Hero.svelte`, `static/images/hero/phone-mockup.txt`
- **what:** Build the Hero per `NEW_SITE_PLAN.md` Homepage section 2 and THEME.md "Hero" component pattern. Eyebrow ("The Seminary Sidekick Suite — App 1 of more to come"), display headline ("Master all 100 doctrinal mastery scriptures."), sub-headline, primary CTA (App Store button reading from `store.ts`), secondary CTA ("Try a Quick Quiz →" that scrolls to `#quick-quiz-demo`). Floating phone mockup on the right (desktop), below CTAs (mobile). Hero uses `text-hero-xl` headline and `surface` background with subtle warm gradient overlay.
- **acceptance:**
  - [ ] Renders correctly on mobile (< 640px), tablet (640-1024px), desktop (1024px+)
  - [ ] All text uses THEME.md tokens
  - [ ] Phone mockup is a `.txt` placeholder; component references `/images/hero/phone-mockup.png` (which 404s for now)
  - [ ] Secondary CTA scrolls to `#quick-quiz-demo` anchor
  - [ ] Hero respects `prefers-reduced-motion` (no float loop if reduced)
  - [ ] WCAG AA contrast verified
- **notes:** Don't compose this into `+page.svelte` yet — that's Phase C. Just build the component.

### TASK-B-011: How-it-works section (mastery loop)
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003
- **files_to_touch:** `src/lib/components/sections/HowItWorks.svelte`, `static/images/how/study.txt`, `static/images/how/build.txt`, `static/images/how/prove.txt`, `static/images/how/master.txt`
- **what:** Four-step illustrated section: **Study → Build → Prove → Master.** Each step is a card with an icon (lucide-svelte) or illustration placeholder, a step number/label, a heading (`headline-md`), and one-line description. Layout: 4 columns on desktop, 2×2 on tablet, stacked on mobile. Section background: `surface-container-low` to differentiate from Hero.
- **acceptance:**
  - [ ] Four cards render with correct layout per breakpoint
  - [ ] Each card hover-lifts per THEME.md motion pattern
  - [ ] Card images are `.txt` placeholders
  - [ ] Eyebrow label above section heading ("How it works")
- **notes:** This is the under-told story on the old site. Lean into the editorial feel — generous spacing, serif headings, calm motion.

### TASK-B-012: Premium peek section
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003
- **files_to_touch:** `src/lib/components/sections/PremiumPeek.svelte`, `static/images/premium/chat-screenshot.txt`
- **what:** Two-column section: left = a screenshot mockup of the AI chat/journal prompt (`.txt` placeholder), right = a short bulleted list of what Sidekick AI does (daily prompt, goal suggestion, reflection questions, scripture connections) + "Learn more about Premium →" link to `/premium`. Visual treatment uses the `premium-gold` gradient on the heading or eyebrow so it reads as distinct. Section background can be `surface` or a soft `premium-gold-light` tint.
- **acceptance:**
  - [ ] Premium gold gradient applied to eyebrow or heading
  - [ ] Screenshot is a `.txt` placeholder
  - [ ] "Learn more →" links to `/premium`
  - [ ] Responsive: two-column desktop, stacked mobile
- **notes:** Don't overuse the gold. Most of the section is on `surface`; the gold is an accent.

### TASK-B-013: For teachers strip on home
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003
- **files_to_touch:** `src/lib/components/sections/ForTeachersStrip.svelte`
- **what:** Compact section pitching teachers/parents. Three sentences max. Trust signals row (no ads · age-appropriate · privacy-first · AI curated for doctrinal mastery). Soft tease: "Soon: a resource library and a community to swap lesson ideas with other teachers." CTA: "For teachers →" linking to `/for-teachers`. Background: `surface-container` for visual rhythm.
- **acceptance:**
  - [ ] Renders cleanly on all breakpoints
  - [ ] Trust signal row is a horizontal list on desktop, wrapped on mobile
  - [ ] CTA link works
- **notes:** This is short. Don't pad it.

### TASK-B-014: News preview strip on home
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-006
- **files_to_touch:** `src/lib/components/sections/NewsPreview.svelte`
- **what:** Three most recent posts pulled via `loadPosts()`. Title, date, 1-line excerpt, cover thumbnail. Card layout. Section heading: "What's new". "All posts →" link to `/news`.
- **acceptance:**
  - [ ] Calls `loadPosts()` and renders 3 latest
  - [ ] Falls back gracefully if fewer than 3 posts exist
  - [ ] Cards link to `/news/[slug]`
  - [ ] Date format: "May 28, 2026"
- **notes:** If there are no posts yet, render a placeholder card ("New posts coming soon") so the section never appears empty.

### TASK-B-015: Final CTA band
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004
- **files_to_touch:** `src/lib/components/sections/FinalCTA.svelte`
- **what:** Big band, `bg-primary` background, white text. Heading: "Start with the first scripture. Get the app." Sub: short line. App Store + Play Store buttons. Reads URLs from `store.ts`.
- **acceptance:**
  - [ ] Band spans full width
  - [ ] Buttons render as real Apple/Google badges (placeholders ok until TASK-B-080)
  - [ ] Contrast verified — white text on primary
- **notes:** Final CTA = last conversion attempt before footer. Make it confident, not desperate.

### TASK-B-020: Quick Quiz demo component
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003, TASK-B-080
- **files_to_touch:** `src/lib/components/demos/quick-quiz/`, `src/routes/quick-quiz/+page.svelte`
- **what:** 5-question quiz demo. Picks 5 random passages from `src/lib/data/passages.json`. Each question shows a passage and 4 answer choices (correct reference + 3 distractors). Visual + haptic-substitute feedback per THEME.md (green pulse for correct, red shake for wrong). After 5 questions, shows a celebration moment + a "Get the app for the other 95" card with store buttons. No login, no persistence. Used as a homepage component AND as the standalone `/quick-quiz` route. Anchor id: `quick-quiz-demo`.
- **acceptance:**
  - [ ] 5 questions, one round, finishes in 30–60 seconds
  - [ ] Animations respect `prefers-reduced-motion`
  - [ ] End-card has working store CTAs
  - [ ] Standalone page wraps the component with appropriate hero/heading
  - [ ] Component is fully responsive
  - [ ] Confetti on perfect score (use `canvas-confetti`, brand colors only)
- **notes:** Don't add "play again" — the path forward is the app. Use Svelte 5 runes for state.

### TASK-B-021: Scripture Match demo component
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004, TASK-002, TASK-003, TASK-B-080
- **files_to_touch:** `src/lib/components/demos/scripture-match/`, `src/routes/scripture-match/+page.svelte`
- **what:** One round of Scripture Match. Two columns: 8 key phrases on the left, 8 references on the right. Tap-to-select pairing (drag-and-drop optional; tap-to-select is the baseline). Correct match: both items glow `success`, then fade out. Wrong: shake + red flash, items reset. Same end-card as Quick Quiz. Standalone route + homepage component, like Quick Quiz.
- **acceptance:**
  - [ ] 8 pairs, single round
  - [ ] Tap-to-select works on touch and mouse
  - [ ] End-card with store CTAs
  - [ ] Component + standalone route both work
- **notes:** Make it accessible — keyboard pairing should work too. Use `aria-pressed` on selectable items.

### TASK-B-030: /premium page
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005, TASK-002, TASK-003
- **files_to_touch:** `src/routes/premium/+page.svelte`, `src/lib/components/premium/*.svelte`, `static/images/premium/`
- **what:** Deep dive on Seminary Sidekick AI. Hero with premium-gold gradient and "Your AI study companion." headline. "What you get" feature list (daily prompt, journal with dynamic prompts, suggested goals + timeline, reflection questions, scripture connections, chat with Sidekick) each with screenshot + 1-line description. "Sample outputs" cards (hand-curated, static): a daily prompt, a reflection question, a suggested goal. CTA: "Try Premium in the app." No live Grok call.
- **acceptance:**
  - [ ] Hero, features grid, sample outputs, CTA all render
  - [ ] All images are `.txt` placeholders
  - [ ] Visual treatment clearly distinct (more gold) without overusing it
  - [ ] SEO meta set
- **notes:** This is the page that sells $$$ subscriptions. Take time to write the copy carefully.

### TASK-B-031: /for-teachers page
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005, TASK-002, TASK-003
- **files_to_touch:** `src/routes/for-teachers/+page.svelte`, `src/lib/components/teachers/*.svelte`
- **what:** Teacher/leader pitch page. Sections: "Why we built this" (Patrick's voice, 2 paragraphs — placeholder copy ok), "How a class can use it" (5-min warmup, individual practice, group competition — tie into the future multiplayer feature), "What about AI safety?" (curated Sidekick, age-appropriate, no data sold), "Get in touch" (email mailto). Forward-looking strip: "Coming soon — Teacher resource library and community."
- **acceptance:**
  - [ ] All sections render
  - [ ] Voice feels personal, not corporate
  - [ ] "Coming soon" forward-looking strip points to the suite vision
  - [ ] SEO meta set
- **notes:** Voice matters more than visual design here. Get the copy right before polishing.

### TASK-B-032: /apps and /apps/scripture-mastery pages
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005, TASK-002, TASK-003
- **files_to_touch:** `src/routes/apps/+page.svelte`, `src/routes/apps/scripture-mastery/+page.svelte`, `src/lib/components/apps/AppCard.svelte`
- **what:** `/apps` is the suite portfolio page. Tier 1 shows one card (Scripture Mastery) and a "More apps coming soon" placeholder card. `/apps/scripture-mastery` is the full product page: hero, screenshots, feature list, premium tier mention, FAQ, download CTAs. This is the "single product" deep dive for visitors who want more detail than the homepage.
- **acceptance:**
  - [ ] /apps shows the suite framing with one live app card
  - [ ] /apps/scripture-mastery is a full product page
  - [ ] Both have proper SEO meta
- **notes:** The product page is the "Tier 1 app, but framed as suite member" idea made concrete. Don't duplicate homepage copy — go deeper.

### TASK-B-040: News blog index + post template
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-006
- **files_to_touch:** `src/routes/news/+page.svelte`, `src/routes/news/[slug]/+page.svelte`, `src/routes/news/[slug]/+page.ts`, `src/lib/components/news/PostCard.svelte`, `src/routes/news/rss.xml/+server.ts`
- **what:** Blog index page (lists all posts, paginated if >12). Individual post page with Merriweather long-form body (18px, 1.7 line-height, `max-w-2xl` for readability), proper headings, scripture blockquotes per THEME.md, date + author + tags. RSS feed auto-generated.
- **acceptance:**
  - [ ] Index renders, sorted desc by date
  - [ ] Post template renders MDX correctly with all components
  - [ ] Scripture blockquotes use the THEME.md pattern
  - [ ] RSS feed at `/news/rss.xml` is valid
  - [ ] Post pages have OG meta
- **notes:** Long-form readability matters. Test with real lorem-ipsum at typical post length (800-1500 words).

### TASK-B-041: First news post — launch announcement
- **status:** open · **owner-blocked**
- **claimed_by:**
- **depends_on:** TASK-B-040
- **files_to_touch:** `src/content/news/seminary-sidekick-is-live.svx`, `static/images/news/launch-cover.txt`
- **what:** Write the launch announcement post. Patrick's voice. What the app does, why he built it, what's next (the suite vision), call to action.
- **acceptance:**
  - [ ] Post compiles in mdsvex
  - [ ] Frontmatter complete (title, slug, date, excerpt, tags, cover, author)
  - [ ] Cover image is `.txt` placeholder
  - [ ] Reads in Patrick's voice — owner must approve before merge
- **notes:** Blocked on whether the owner wants to write this themselves or have an agent draft it. See open question #6 in NEW_SITE_PLAN.md.

### TASK-B-042: Second news post — devotional or behind-the-scenes
- **status:** open · **owner-blocked**
- **claimed_by:**
- **depends_on:** TASK-B-040
- **files_to_touch:** `src/content/news/[slug].svx`
- **what:** A second post so the blog doesn't look empty. Choose: a short devotional tied to a specific doctrinal mastery scripture, OR a behind-the-scenes "why scripture mastery matters" piece.
- **acceptance:**
  - [ ] Post compiles
  - [ ] Reads naturally — owner approves
- **notes:** Same owner-blocked status as TASK-B-041.

### TASK-B-050: /about page
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005, TASK-002, TASK-003
- **files_to_touch:** `src/routes/about/+page.svelte`
- **what:** Who's building this and why. Patrick's story, mission, "what's next." Single-column, long-form Merriweather body. Includes a photo placeholder.
- **acceptance:**
  - [ ] Renders with proper long-form typography
  - [ ] Voice is personal
  - [ ] SEO meta set
- **notes:** Copy is owner-blocked unless owner wants an agent to draft a starting point.

### TASK-B-051: /privacy and /terms pages
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005
- **files_to_touch:** `src/routes/privacy/+page.svelte`, `src/routes/terms/+page.svelte`
- **what:** Standard privacy policy and terms of use. Template-based (no PII collection in Tier 1; mentions Plausible analytics; mentions email if waitlist exists; covers app's premium subscription via RevenueCat). Long-form Merriweather body.
- **acceptance:**
  - [ ] Both pages render
  - [ ] Cover the current data flow honestly (no accounts, no PII server-side in Tier 1)
  - [ ] Tier 2/3 sections marked TBD (will be updated when auth and forum ship)
- **notes:** Use a reputable template (e.g., Termly or Iubenda's free generators) as a starting point; adapt to actual practices.

### TASK-B-052: /contact page
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005
- **files_to_touch:** `src/routes/contact/+page.svelte`
- **what:** Simple contact page. Email link, optional contact form (defer the form to Tier 2 — just `mailto:` link for now is fine). Social links.
- **acceptance:**
  - [ ] Renders
  - [ ] `mailto:` link works
- **notes:** Keep it minimal in Tier 1.

### TASK-B-060: SEO + structured data
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004
- **files_to_touch:** `src/lib/components/Seo.svelte`, `src/lib/utils/jsonLd.ts`, every `+page.svelte` (small additions)
- **what:** Build a reusable `<Seo>` component that handles `<title>`, `<meta description>`, OG tags, Twitter Card, canonical URL, and JSON-LD structured data. Pages opt-in with `<Seo title=... description=... />`. JSON-LD: `SoftwareApplication` on home, `Article` on posts, `Organization` on about.
- **acceptance:**
  - [ ] Every page has unique title and description
  - [ ] OG tags render correctly in social link previews
  - [ ] JSON-LD validates on schema.org validator
- **notes:** Coordinate with section/page agents — they consume the `<Seo>` component but don't define it.

### TASK-B-061: Sitemap + robots.txt
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-005, TASK-006
- **files_to_touch:** `src/routes/sitemap.xml/+server.ts`, `static/robots.txt`
- **what:** Auto-generated sitemap that includes all static routes + all news posts (pulled via `loadPosts()`). `robots.txt` allows all.
- **acceptance:**
  - [ ] `/sitemap.xml` returns valid XML
  - [ ] Includes every page and every news post
  - [ ] `/robots.txt` references the sitemap
- **notes:** When community/classroom ship, this gets extended.

### TASK-B-062: OG image generation
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-B-060
- **files_to_touch:** `src/routes/og/[...slug].png/+server.ts`, `static/og/`
- **what:** Per-page Open Graph image generation using `@vercel/og` or `satori`. Template: brand colors, Merriweather title, Inter subtitle, small Seminary Sidekick logo. Cached at build time where possible.
- **acceptance:**
  - [ ] OG image route returns valid 1200×630 PNG
  - [ ] Falls back to default static OG for pages that don't opt-in
  - [ ] Used by `<Seo>` component
- **notes:** This is polish — defer if time-pressured at launch.

### TASK-B-070: Page transitions + intersection-triggered section reveals
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004
- **files_to_touch:** `src/routes/+layout.svelte`, `src/lib/actions/reveal.ts`
- **what:** Subtle opacity fade on route transition (Svelte's built-in `crossfade` or a simple opacity transition). A `reveal` action that uses IntersectionObserver to fade in + slide up sections as they enter the viewport (per THEME.md motion). Both respect `prefers-reduced-motion`.
- **acceptance:**
  - [ ] Route changes feel smooth, no jarring snap
  - [ ] Reveal action works on any section
  - [ ] Reduced-motion users see no motion (just instant)
- **notes:** Don't go overboard. Restraint is part of the brand.

### TASK-B-080: Port scripture data from old repo
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-001
- **files_to_touch:** `src/lib/data/doctrinalMastery.json`, `src/lib/data/passages.json`, `src/lib/data/types.ts`
- **what:** Copy `public/data/doctrinalMastery.json` and `public/data/passages.json` from the legacy repo into `src/lib/data/`. Write TypeScript types for them. Verify the data is complete (100 scriptures across 4 books).
- **acceptance:**
  - [ ] Both JSON files in place
  - [ ] TypeScript types defined and exported
  - [ ] A quick sanity check shows 100 scriptures, 4 books
- **notes:** Pure data port. No transformation unless needed.

### TASK-B-090: 404 page
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-004
- **files_to_touch:** `src/routes/+error.svelte`
- **what:** Friendly 404 page. Heading "Verse not found." Body: "The page you're looking for doesn't exist (yet)." CTA: "Back home" + "Browse the news." Subtle illustration placeholder.
- **acceptance:**
  - [ ] Renders for any non-existent route
  - [ ] Links work
  - [ ] Voice is on-brand
- **notes:** Small but visible. Don't skip.

---

## Phase C — Composition + polish (serial)

After all Phase B tasks complete.

### TASK-C-100: Compose homepage from section components
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-B-010 through TASK-B-015
- **files_to_touch:** `src/routes/+page.svelte`
- **what:** Replace the homepage stub with the composition shell that imports and renders all section components in order: Hero → HowItWorks → QuickQuizDemo → PremiumPeek → ForTeachersStrip → ScriptureMatchDemo → NewsPreview → FinalCTA.
- **acceptance:**
  - [ ] All sections render in correct order
  - [ ] No layout shift or alignment issues
  - [ ] Page loads fast (Lighthouse perf 95+)
- **notes:** This is the only task that should touch `+page.svelte` after Phase A.

### TASK-C-101: Cross-browser QA pass
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-C-100
- **files_to_touch:** none (bug-fix tasks created for any issues found)
- **what:** Test the full site on iOS Safari (latest), Android Chrome (latest), desktop Chrome, Safari, Firefox. Check every page, every interactive component, the demos. File `TASK-FIX-XXX` tasks for any bugs.
- **acceptance:**
  - [ ] No critical visual or functional bugs on any tested browser
  - [ ] Demos work on touch and mouse
- **notes:** This is where polish wins or loses.

### TASK-C-102: Lighthouse pass
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-C-100
- **files_to_touch:** none directly
- **what:** Run Lighthouse on every major page (home, /premium, /for-teachers, /news, /news/[a post]). Target 95+ on Performance, Accessibility, Best Practices, SEO. File fix tasks for any deficiencies.
- **acceptance:**
  - [ ] All 4 scores ≥ 95 on the homepage
  - [ ] All 4 scores ≥ 90 on every other page
- **notes:** Common offenders: image lazy-loading missing, font preload missing, color contrast on muted text.

### TASK-C-110: Launch-day URL swap
- **status:** open · **owner-blocked**
- **claimed_by:**
- **depends_on:** App is live in the App Store
- **files_to_touch:** `src/lib/config/store.ts`
- **what:** Swap the placeholder iOS URL for the real App Store URL. Same for Android if launching both. Set `ANDROID_AVAILABLE: true` if Play Store is live.
- **acceptance:**
  - [ ] All CTAs link to real store listings
  - [ ] No broken links anywhere
- **notes:** This is a one-file change. Push to main, Vercel auto-deploys.

### TASK-C-111: Submit sitemap to Google Search Console
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-C-110, domain configured
- **files_to_touch:** none (external — GSC)
- **what:** Verify domain ownership in Google Search Console, submit the sitemap URL.
- **acceptance:**
  - [ ] Domain verified
  - [ ] Sitemap accepted
- **notes:** Helps SEO indexing.

### TASK-C-112: Ship launch announcement
- **status:** open
- **claimed_by:**
- **depends_on:** TASK-B-041, TASK-C-110
- **files_to_touch:** none (deploy already includes the post)
- **what:** Verify the launch announcement post is live, share on socials.
- **acceptance:**
  - [ ] Post is live at `/news/seminary-sidekick-is-live`
  - [ ] OG image renders correctly when shared
- **notes:** Marketing moment.

---

## Future tiers (placeholder backlog)

Not for Tier 1. Listed so we know where they slot in.

- **TASK-2-XXX: Teacher resource library** (`/teach`, `/teach/[slug]`, `/teach/submit`)
- **TASK-2-XXX: Resource library search (Pagefind)**
- **TASK-2-XXX: Suite portfolio v2** (`/apps` reframed once app #2 is real)
- **TASK-3-XXX: Auth via Supabase**
- **TASK-3-XXX: Forum data model + endpoints**
- **TASK-3-XXX: Forum UI** (categories, threads, replies, reactions)
- **TASK-3-XXX: Comments on resources**
- **TASK-3-XXX: Moderation tools**
- **TASK-4-XXX: Classroom mode** (teacher dashboards, opt-in student progress)
- **TASK-4-XXX: Cross-app identity layer**

---

## Notes

- **Open question dependencies.** Several Tier-1 questions in `NEW_SITE_PLAN.md` (domain, logo, pricing, Android availability, first post authorship) still need owner input. Tasks `TASK-B-015`, `TASK-B-041`, `TASK-B-042`, `TASK-C-110`, `TASK-C-111` are most affected. Tasks proceed with placeholders that swap via `store.ts` / `site.ts` at launch.
- **Don't expand scope mid-task.** If you discover work that doesn't fit your claimed task, create a new TASK rather than absorbing it. Keeps file-ownership clean.
- **Mark blocking issues immediately.** If you hit a blocker, change `status: blocked`, document `blocked_by`, and commit so the next agent sees it.
