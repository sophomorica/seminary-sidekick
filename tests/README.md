# `tests/` — Playwright E2E suite

This is the regression baseline. Every test here documents something
that **should keep working** as the site evolves. When a test fails,
either:

1. The thing broke (fix the code), or
2. The thing changed intentionally (update the test).

There is no third option — silenced tests defeat the purpose of having
the baseline.

## Quick start

```sh
# One-time setup on a fresh checkout
pnpm install
pnpm test:e2e:install   # downloads Chromium binary (~150MB)

# Run all tests headless
pnpm test:e2e

# Best dev experience — UI mode with live re-run, time-travel, etc.
pnpm test:e2e:ui

# Open the HTML report from the most recent run
pnpm test:e2e:report
```

Playwright auto-starts `pnpm dev` on port 5173 before running tests
(see `playwright.config.ts` → `webServer`). You don't need to start it
yourself.

## What's covered

| File                            | What it asserts                                                                                                                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smoke.spec.ts`                 | Every public route returns 200, renders the layout shell, has at least one `<h1>`, and throws zero JS console errors. Also: 404 page works, RSS feed serves valid XML.                                                                                           |
| `nav.spec.ts`                   | Logo links home from any page. Every AppNav link (Premium, For teachers, Library, News, How it works) routes to the right place. Every AppFooter link returns 200. Skip link is keyboard-first and jumps to `#main-content`. Mobile menu opens/closes correctly. |
| `news.spec.ts`                  | Homepage What’s new and `/news` list the three live posts (not the empty stub). Each `/news/[slug]` renders. RSS includes the slugs.                                                                                                                             |
| `teachers.spec.ts`              | `/teachers` is an honest catalog: live advice + DM tips link to real posts; tools link to save-a-class / how-it-works / printouts; lesson plans and testimonials stay “coming” with no fake quotes. Homepage tease points at `/teachers`.                        |
| `printouts.spec.ts`             | `/teachers/printouts` lists the full DM library (100). Default 2 Nephi 2:25 keeps signed-off tiles + Advanced glyphs. Also covers a long verse (compact 2-column tiles + Advanced first-letter contract, no full verse). Proof PDFs stay on 2 Nephi 2:25.        |
| `demos/quick-quiz.spec.ts`      | The Quick Quiz at `/quick-quiz` renders with interactive choice buttons, advances through 5 questions when clicked, and ends on a card containing store CTAs.                                                                                                    |
| `demos/scripture-match.spec.ts` | The Scripture Match at `/scripture-match` renders 16+ selectable items in two columns, exposes `aria-pressed`, and toggles selection state on click.                                                                                                             |
| `legal.spec.ts`                 | Privacy and Terms pages render every required `<h2>` section (so a copy-edit can't silently delete the children's-privacy clause, etc.).                                                                                                                         |
| `a11y.spec.ts`                  | Per-route: every `<img>` has alt, every interactive control has an accessible name, exactly one `<h1>`. Site-wide: skip link is the first keyboard target.                                                                                                       |

## "Timestamp of things that work"

The HTML report at `playwright-report/index.html` is the canonical
snapshot. It records:

- Every test that passed (with duration)
- Every test that failed (with screenshot, trace, video)
- The browser + viewport used
- The timestamp of the run

After any meaningful build or push, run `pnpm test:e2e` and open the
report. If it's green, the linked URL is your "known good" state.

For a CI-grade record, the `--reporter=github` reporter is auto-enabled
when `CI=true` is set in the environment — that emits annotations into
GitHub Actions logs.

## Adding new tests

When a new feature lands:

1. Add a smoke entry if it introduces a new route.
2. Add a nav entry if it introduces a new link target.
3. Add a feature-specific spec under `tests/` if it has its own
   interactive surface (like the demos).
4. Keep selectors role-based (`getByRole`, `getByLabel`) so tests
   don't break on copy edits.

## Future additions worth doing

- **`@axe-core/playwright`** for full WCAG AA audits per route. Drop-in
  on top of `a11y.spec.ts`.
- **Cross-browser projects** in `playwright.config.ts` — Firefox, WebKit,
  iPhone viewport. Currently chromium-only.
- **Visual regression** via Playwright's `toHaveScreenshot()` once the
  homepage composition (Phase C) stabilizes.
- **CI workflow** that uploads the HTML report as a build artifact so
  reviewers can browse failures from a PR.

## Why this setup

- Tests live in `tests/` (project root, parallel to `src/`) so they
  aren't bundled into the SvelteKit production build.
- One file per concern. New contributors can find the right spot.
- Role-based selectors throughout — copy can change without breaking
  tests; selectors only break when behavior actually changes.
- HTML report enabled by default — turns "did the tests pass?" into a
  link you can share.
