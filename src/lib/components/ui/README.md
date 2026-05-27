# `src/lib/components/ui/` — shadcn-svelte primitives

This directory holds the project's UI primitives. They follow the
shadcn-svelte pattern: components are **owned** (copied into the repo,
not imported from a package) so we have full control over styling.

Read `THEME.md` first. Every component here conforms to the Sacred
Editorial design system — large radii, tinted shadows, Merriweather
for titles, Inter for body.

## What's here today

| Component  | Status     | Notes                                                                                |
| ---------- | ---------- | ------------------------------------------------------------------------------------ |
| `button`   | hand-built | All 6 variants (primary, secondary, outlined, ghost, tertiary, destructive) + sizes. |
| `card`     | hand-built | Root + Header/Title/Description/Content/Footer composable parts.                     |
| `input`    | hand-built | Text input with focus ring matching primary brand color.                             |
| `label`    | hand-built | Form label, paired with input via `for=`.                                            |
| `separator`| hand-built | Use sparingly — prefer surface elevation per the No-Line philosophy.                 |

## What's missing (add via shadcn-svelte CLI on the host)

These need `bits-ui` (already declared in `package.json`) and the
shadcn-svelte CLI installed:

| Component       | How to add                                          |
| --------------- | --------------------------------------------------- |
| `dialog`        | `pnpm dlx shadcn-svelte@latest add dialog`          |
| `dropdown-menu` | `pnpm dlx shadcn-svelte@latest add dropdown-menu`   |
| `tabs`          | `pnpm dlx shadcn-svelte@latest add tabs`            |
| `toggle`        | `pnpm dlx shadcn-svelte@latest add toggle`          |
| `tooltip`       | `pnpm dlx shadcn-svelte@latest add tooltip`         |

After adding, restyle each component to match THEME.md (Tailwind
classes, large radii, tinted shadows). See `button.svelte` as the
template — the `tv()` pattern there shows how variants should look.

## Component conventions

- Each component lives in its own folder (e.g., `button/`).
- The folder exports via `index.ts` so consumers `import { Button } from '$lib/components/ui/button'`.
- Multi-part components (Card) export each part as both a namespaced
  short name (`Header`) and a fully-qualified one (`CardHeader`).
- All variant logic uses `tailwind-variants` (`tv()`).
- All class merging uses `cn()` from `$lib/utils`.
- Props use Svelte 5 runes (`$props()`, `$bindable()`).
