# `src/lib/components/ui/` — shadcn-svelte primitives

This directory holds the project's UI primitives. They follow the
shadcn-svelte pattern: components are **owned** (copied into the repo,
not imported from a package) so we have full control over styling.

Read `THEME.md` first. Every component here conforms to the Sacred
Editorial design system — large radii, tinted shadows, Merriweather
for titles, Inter for body.

## What's here

| Component       | Origin        | Notes                                                                                  |
| --------------- | ------------- | -------------------------------------------------------------------------------------- |
| `button`        | hand-built    | All 6 variants (primary, secondary, outlined, ghost, tertiary, destructive) + 4 sizes. |
| `card`          | hand-built    | Root + Header/Title/Description/Content/Footer composable parts.                       |
| `input`         | hand-built    | Text input with focus ring matching primary brand color.                               |
| `label`         | hand-built    | Form label, paired with input via `for=`.                                              |
| `separator`     | hand-built    | Use sparingly — prefer surface elevation per the No-Line philosophy.                   |
| `dialog`        | shadcn-svelte | Full set: Root/Trigger/Portal/Overlay/Content/Header/Title/Description/Footer/Close.   |
| `dropdown-menu` | shadcn-svelte | Full set including sub-menus, checkbox + radio items, separators, shortcuts.           |
| `tabs`          | shadcn-svelte | Root/List/Trigger/Content. `variant: "line"` for underline style.                      |
| `toggle`        | shadcn-svelte | Pressed-state toggle button (pill, brand-color when on).                               |
| `tooltip`       | shadcn-svelte | Inverted dark tooltip on `bg-on-surface text-surface`.                                 |

## Restyling notes (for the shadcn-svelte primitives)

shadcn-svelte's "nova" style ships with neutral-palette tokens
(`bg-popover`, `text-foreground`, `border-input`, `bg-muted`, etc.)
that don't exist in our theme. After installing via the CLI, **every
primitive was remapped** to THEME.md tokens:

| shadcn neutral token       | Seminary Sidekick token       |
| -------------------------- | ----------------------------- |
| `bg-popover`, `bg-card`    | `bg-surface-container-lowest` |
| `text-foreground`          | `text-on-surface`             |
| `bg-foreground`            | `bg-on-surface`               |
| `text-muted-foreground`    | `text-on-surface-variant`     |
| `bg-muted`                 | `bg-surface-container`        |
| `bg-accent`                | `bg-surface-container-low`    |
| `border-input`             | `border-outline-variant`      |
| `border-border`            | `border-outline-variant/40`   |
| `ring-ring`, `bg-ring`     | `ring-primary` / `bg-primary` |
| `text-primary-foreground`  | `text-on-primary`             |
| `bg-destructive` (+ -text) | `bg-error` / `text-error`     |
| `rounded-xl` (dialogs)     | `rounded-4xl` (32px)          |
| `rounded-lg` (dropdowns)   | `rounded-2xl`                 |
| `rounded-lg` (tabs/toggle) | `rounded-full`                |
| `shadow-md`, `shadow-lg`   | `shadow-floating`             |
| `text-base` (dialog title) | `font-serif text-headline-lg` |

To re-run `pnpm dlx shadcn-svelte@latest add <component>` later,
**use `--overwrite` carefully** — it will overwrite hand-built
primitives. The recipe is: back up the hand-built files, run with
`-y -o`, restore the hand-built files, then re-apply the remap above
to the freshly-installed primitive's Tailwind classes.

## Component conventions

- Each component lives in its own folder (e.g., `button/`).
- The folder exports via `index.ts` so consumers `import { Button } from '$lib/components/ui/button'`.
- Multi-part components (Card, Dialog, DropdownMenu) export each part as both a namespaced
  short name (`Header`) and a fully-qualified one (`CardHeader`).
- All variant logic uses `tailwind-variants` (`tv()`).
- All class merging uses `cn()` from `$lib/utils`.
- Type helpers `WithoutChildrenOrChild` and `WithElementRef` also live in `$lib/utils`.
- Props use Svelte 5 runes (`$props()`, `$bindable()`).
- Imports use the `$lib/utils.js` form (with `.js`) where shadcn-svelte's scaffold produces them; both `$lib/utils` and `$lib/utils.js` resolve to the same module under TypeScript's bundler resolution.
