# Seminary Sidekick Site — Narrow Road Studios

<!-- nr-agent-contract:1 -->
## Agent contract (all models)

Start here. Do not search the disk for “how we work.”
This file is the instruction set on GitHub and on disk.

Definition of done (all must be true):
1. This repo’s analyze or lint command exits 0.
2. This repo’s test command exits 0. New behavior has a test.
3. Build or typecheck succeeds when the repo has one.
4. No orphans (unreachable screens, unused new files).
5. No secrets in git.
6. If `.claude/stop-gate.sh` exists, you ran it and it exited 0. If it does not exist, do not write that a Stop hook ran.

Workers escalate architecture instead of inventing it.
Hub `standards/` and poteto-mode skills apply only when this session already loaded them. A clone of this repo alone does not have hub.

Context is loaded by role — read only what your role lists. Don't preload other standards; the validator enforces them.

- **Workers:** this file + your task spec. Definition of done is below; everything else comes from the spec.
- **Validator / design-reviewer:** hub standards apply only when this session already loaded hub. Do not open `../../hub/standards/` from this clone.
- **Main / planning sessions only:** also follow hub `standards/OPERATING_MANUAL.md` if this session already loaded hub. A clone of this repo alone does not have hub.

Design identity for THIS product lives in `THEME.md` (this repo). Universal floors are shared; the vibe is this product's own.

## Non-negotiables
- Definition of done is in the Agent contract above. This repo has no Stop hook. Do not write that one ran.
- Work is not complete until `/review` (validator subagent) returns PASS.
- Workers make no architectural decisions — escalate instead of improvising.
- No orphaned components: everything merged must be reachable and imported.

## Commands
- install: `pnpm install` (plus one-time `pnpm test:e2e:install` — downloads Chromium for Playwright, ~150MB)
- dev: `pnpm dev`
- check / lint: `pnpm check` && `pnpm lint`
- test: `pnpm test:e2e` (headless) · `pnpm test:e2e:ui` (UI mode) · `pnpm test:e2e:report` (HTML report)
- build: `pnpm build` && `pnpm preview`

CI must pass `pnpm check` (no TS errors), `pnpm lint`, and `pnpm test:e2e`. Lighthouse target: 95+ on all four scores on the homepage. The E2E suite is the regression baseline — when a test fails, either the thing broke or the test needs updating; never silence one. See `tests/README.md` for the coverage map.

## Stack rules
SvelteKit / Svelte 5 + TypeScript + Tailwind + shadcn-svelte + mdsvex, deployed on Vercel.
- Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`, snippets) — no legacy Svelte 4 syntax.
- All styling via Tailwind utilities; design tokens live in `tailwind.config.js` — never hardcode hex colors, never use `shadow-lg`/`shadow-xl` (use `shadow-editorial`/`shadow-floating`). Cards `rounded-[2rem]`, buttons `rounded-full`.
- No `<style>` blocks except for animations utilities can't do (justify in a comment).
- No Tier-2/3 additions now (Supabase, Resend, Pagefind) — Tier 1 has no general backend, accounts, or database. **Explicit product exception:** Class Play web join uses Supabase anonymous auth, `join_room`, and Realtime under `/join`; this exception is limited to the Group Play participant flow.

## Repo-specific notes
- Family layout is **`../app/` + `../webpage/` only**. Sibling folders named `app-pr*` / `webpage-pr*` are leftover git worktrees, not extra products. Do not treat them as products.
- Scripture data is owned by the Flutter app (`../app/lib/data/scriptures_data.dart`). Never hand-edit `src/lib/data/doctrinalMastery.json`; import via `$lib/data/scriptures` helpers. Full rules in `docs/CONVENTIONS.md`.
- Never generate real image/audio assets — `.txt` placeholders at the intended final path (see `docs/CONVENTIONS.md`).
- Launch-day values (store URLs, site metadata, nav) live in `src/lib/config/*.ts` — every CTA reads from these.
- Parallel agents coordinate via `TODO.md` claim/complete protocol — read `docs/AGENT-COORDINATION.md` before claiming a task.

## Doc map
- `docs/OVERVIEW.md` — what this project is / is not, Tier-1 scope, open strategic questions. Read when planning or scoping new work.
- `docs/ARCHITECTURE.md` — tech stack rationale, full project structure tree, key files reference. Read before adding routes/components or when lost in the layout.
- `docs/CONVENTIONS.md` — naming, Svelte 5, styling, mdsvex content, scripture-data rules, asset placeholders, config-as-code, accessibility, SEO. Read before writing any code.
- `docs/AGENT-COORDINATION.md` — TODO.md claim/complete protocol, file ownership, commit format, parallel-safe patterns. Read before claiming a task.
- `docs/vercel-setup.md` — Vercel hosting/deploy configuration. Read when touching deployment.
- `THEME.md` — visual design system: colors, fonts, motion, components. Read before any UI work.
- `TODO.md` — task board (`TASK-XXX` items). Read to find and claim work.
- `NEW_SITE_PLAN.md` — strategic plan and 4-tier roadmap. Read for full strategic context.
- `AGENT_DECISIONS.md` — log of past agent decisions. Read when a past choice seems odd before reversing it.
- `README.md` — human-facing project intro. Read for onboarding context only.
