---
name: verify-sidekick-web
description: Launch and drive the Seminary Sidekick website (SvelteKit, deployed on Vercel) with fixture Supabase data, then capture screenshots and proof for /teach, the printouts finder, and the Group Play join page. Use to confirm a site change works in the real app, not only in typecheck or the repo's own e2e suite.
---

# Verify seminary-sidekick (website)

Surface: a public web UI. Commands, stack rules and the production Supabase exceptions are in `CLAUDE.md`. Test coverage is in `tests/README.md`. Supabase tables are in `supabase/README.md`. Do not restate them here. `seminary_sidekick_backend/` is a legacy Python API that the site does not use, so this skill ignores it.

## Safety

The site reads Supabase at build time (`$env/static/public`) and at request time. This skill builds with `PUBLIC_SUPABASE_URL` pointing at a local fake and a dummy anon key, so it never reaches the production project, sends email, or touches payments. The fake is `fake-supabase.mjs`, which answers anonymous auth and the Group Play join RPCs and forwards the rest to the repo's own `tests/mocks/supabase-posts.mjs` (posts and teaching ideas). There is no read-only live path and none is needed.
`launch.sh start` refuses to run when a `.env*` file (other than `.env.example` and `.env.test`) sits in the repo root, and it builds and serves under `env -i`. Never copy an env file in.

## Prerequisites

- `pnpm install --frozen-lockfile`, and a Playwright chromium (`pnpm exec playwright install chromium` if the run cannot launch one). The repo pins no Node version. CI uses Node 22 and pnpm 11. Node 26 (the Mac default) built and ran this skill.
- Ports `VERIFY_PORT` (default 4400) and the next two (4401 repo mock, 4402 fake) must be free. Never use 4173 to 4182, which the repo's own `playwright.config.ts` and other agents use.
- `VERIFY_EVIDENCE` (default `/tmp/verify-sidekick-evidence`). Point it at your scratchpad.

## Launch

```bash
S=.claude/skills/verify-sidekick-web
$S/launch.sh start   # pnpm build (about 7 s), then mock, fake and `vite preview`
```

Ready means it printed `ready http://127.0.0.1:4400` after `/teach` rendered the 10 fixture ideas. Data is fixed fixtures, so restarting resets everything. `/teach` caches ideas for 10 minutes per instance.

## Doctor

`$S/launch.sh doctor` is read-only. It passes when the app, mock and fake processes this run started each own their port, `/teach` shows 10 fixture ideas, and the fake answers `/health`. Run it first whenever a result looks odd. On FAIL, `stop` and `start` again. Never drive a server you did not start.

## Drive

Playwright, from the repo's `node_modules`, with `verify.config.ts` and `verify.spec.ts` here. It runs against the live instance (no `webServer`). One test per mapped feature, tagged in the title.

```bash
$S/run.sh all          # launch, doctor, drive, teardown (about 25 s)
$S/run.sh printouts    # or teach, or groupplay
```

To iterate: `launch.sh start`, then `pnpm exec playwright test -c $S/verify.config.ts --grep '\[teach\]'`, then `launch.sh stop`. Selectors are ARIA roles, labels, and the repo's `data-testid` and `data-*` attributes. Add a feature by adding a `[tag]` test and a file in `features/`.

## Evidence

Written to `VERIFY_EVIDENCE`: `<feature>-N-*.png` screenshots (1280x720), `proof-<feature>.json` (state read back from the page or the fake's request log), `result.json` (Playwright), `rpc-calls.jsonl` (every RPC the browser sent to the fake), and `app.log`, `mock.log`, `fake.log`, `build.log`. A proof needs the action and its resulting state, not only a final screen. Failed runs keep a trace in `pw-output/`.

## Cleanup

`$S/launch.sh stop` kills only the three PIDs this run recorded in `VERIFY_EVIDENCE`. `run.sh` runs it on exit, including after a failure. It never deletes evidence. `.svelte-kit` and `.vercel` are gitignored build output.

## Features

`features/README.md`: `/teach`, the printouts finder and sheet, Group Play join. Not mapped yet: home, news, `/teachers` grabbers, the demos (`/quick-quiz`, `/scripture-match`), `/for-teachers` waitlist form.

## Gotchas

- `PUBLIC_SUPABASE_*` are baked at build time. Changing the fake's port needs a rebuild, which `start` always does.
- Room codes use `ROOM_CODE_ALPHABET` in `src/lib/services/groupPlay.ts`, which has no B, I, O, S, 0 or 1. A code outside it never reaches the network.
- Group Play after joining needs Supabase Realtime (websocket), which the fake does not implement. Lobby, quiz and results screens are unverified here.
- The repo's own `pnpm test:e2e` binds 4173 and 54329 and uses `pnpm dev`. It does not collide with this skill's ports, but two copies of it cannot run at once.
- Never submit the homepage or `/for-teachers` waitlist form here. It posts to the Formspree URL in `src/lib/config/site.ts`, which is a placeholder (log-only) today and becomes a real endpoint when the owner pastes the id. That is the one outbound write path the fake does not intercept.
- The fixtures come from the repo mock (`Mock summary for ...`), so copy and counts in `/teach` are not production data.
