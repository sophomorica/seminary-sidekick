# Seminary Sidekick — Web

The web home of Seminary Sidekick. SvelteKit + Tailwind v4 + shadcn-svelte.

For project context, agent instructions, design system, and the work board, read these in order:

1. **[CLAUDE.md](./CLAUDE.md)** — single entry point for AI agents (and humans new to the repo). Tech stack, project structure, conventions, agent coordination ritual.
2. **[THEME.md](./THEME.md)** — Sacred Editorial design system. Colors, typography, motion, accessibility minimums.
3. **[TODO.md](./TODO.md)** — task board for parallel work.
4. **[NEW_SITE_PLAN.md](./NEW_SITE_PLAN.md)** — strategic plan and 4-tier roadmap.

## Quick start

```sh
pnpm install
pnpm dev          # http://localhost:5173
```

Other scripts:

```sh
pnpm check        # svelte-check + TypeScript
pnpm lint         # prettier --check + eslint
pnpm format       # prettier --write
pnpm build        # production build (Vercel adapter)
pnpm preview      # preview production build locally
```

## CI / hosting

- **CI** runs on every push and PR (`.github/workflows/ci.yml`): install, type check, lint, build. Must pass before merge.
- **Hosting** is Vercel via `@sveltejs/adapter-vercel`. See `docs/vercel-setup.md` for the one-time owner setup.

## Project layout

```
src/
├── app.css                    Tailwind v4 + design tokens (see THEME.md)
├── lib/
│   ├── components/
│   │   ├── ui/                shadcn-svelte primitives
│   │   ├── layout/            AppNav, AppFooter, SkipLink
│   │   ├── brand/             Logo, StoreButtons
│   │   ├── sections/          Homepage sections (Phase B)
│   │   └── demos/             Quick Quiz, Scripture Match (Phase B)
│   ├── content/               MDX content loader + schema
│   ├── config/                store.ts, site.ts, nav.ts
│   └── utils.ts               cn() helper
├── content/
│   └── news/                  .svx blog posts (gitkeep until Phase B)
└── routes/                    SvelteKit routes
```

## Contributing

Don't edit shared files (`tailwind.config.js`, `src/app.css`, `+layout.svelte`, configs) without claiming the matching TODO task. See "Agent Coordination" in CLAUDE.md.
