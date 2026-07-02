# THEME.md — Sacred Editorial Design System (Web)

> **Single source of truth for visual design on the Seminary Sidekick website.**
> Read this before building any component. Every color, font, radius, and spacing value comes from this file.
> Ported faithfully from the Flutter app's `lib/theme/app_theme.dart` so the web and the app feel like one product.

---

## Design Philosophy

**The Digital Sanctuary.** The website should feel like a premium, leather-bound volume translated into a digital medium. Three principles guide every choice:

1. **No-Line.** Borders and dividers are a last resort. Use tonal depth, whitespace, and ambient shadows to separate content. If you reach for a `border-` utility, pause and ask if surface elevation would do the job instead.
2. **Smooth Stones.** Radii are large and confident. Cards are `rounded-3xl` (32px), sections can go to `rounded-[3rem]` (48px). Pill-shaped buttons. Nothing sharp or industrial.
3. **Tinted Shadows.** Shadows are never pure black. They're warm, derived from the on-surface text color at very low opacity (4–6%). They float content, they don't cut it out.

**Voice.** Reverent but warm. Calm but playful when it counts. We use serif headings for editorial authority and sans-serif body for clarity. We trust the reader. We don't shout.

**Density.** Generous. Long-form spacing, big type, room to breathe. Mobile-first, but the desktop experience should feel like a beautiful book, not a cramped marketing page.

---

## Color System

All colors live in `tailwind.config.js` under semantic names. **Never use raw hex values in component code.** Always use the Tailwind class (`bg-primary`, `text-on-surface`, etc.) or a CSS variable (`var(--color-primary)`).

### Brand colors

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `primary` | `#2F4374` | `bg-primary` / `text-primary` | Active states, primary CTAs ("Get the app"), brand moments. Deep navy. |
| `primary-container` | `#5C77AE` | `bg-primary-container` | Softer primary surface — secondary CTA fills, primary-tinted backgrounds. |
| `primary-fixed` | `#DCE4F9` | `bg-primary-fixed` | Subtle primary tint — hover backgrounds, soft chips. |
| `primary-fixed-dim` | `#9FB4E8` | `bg-primary-fixed-dim` | Dark-mode primary, slightly louder primary tint in light mode. |
| `on-primary` | `#FFFFFF` | `text-on-primary` | Text on `primary` backgrounds. |
| `on-primary-container` | `#12224A` | `text-on-primary-container` | Text on `primary-container` backgrounds. |
| `secondary` | `#3F6E9C` | `bg-secondary` | Calming elements — progress, completion states, secondary CTAs. Steel blue. |
| `secondary-container` | `#C7DDF0` | `bg-secondary-container` | Soft blue surface — "completed" badges, calm backgrounds. |
| `on-secondary` | `#FFFFFF` | `text-on-secondary` | Text on `secondary`. |
| `tertiary` | `#6F5A10` | `bg-tertiary` / `text-tertiary` | **Sacred moments only.** Achievements, scripture mastery, premium features. Deep gold. |
| `tertiary-container` | `#B8942A` | `bg-tertiary-container` | Premium gold for the AI Sidekick section and premium CTAs. |
| `tertiary-fixed` | `#F4E3A6` | `bg-tertiary-fixed` | Light premium tint — sample journal cards, achievement glows. |
| `accent` | `#5B8ABF` | `bg-accent` / `text-accent` | Links, highlight strokes, blue moments. Calm blue. Use sparingly. |

### Surface hierarchy ("stacked sheets of fine, translucent paper")

This is the most important and least obvious part of the system. Surfaces don't separate via borders — they separate via tonal depth. Pick the right surface for the right elevation.

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `surface` | `#F7F8FC` | `bg-surface` | Page background. The base "paper." |
| `surface-container-lowest` | `#FFFFFF` | `bg-surface-container-lowest` | Floating, lifted elements. Cards that should feel "above" the page. Pair with `shadow-editorial`. |
| `surface-container-low` | `#EFF2F9` | `bg-surface-container-low` | Section backgrounds. The "next sheet up." |
| `surface-container` | `#E9EDF6` | `bg-surface-container` | Slightly more emphasis than `low`. |
| `surface-container-high` | `#E2E7F2` | `bg-surface-container-high` | More emphasized sections. |
| `surface-container-highest` | `#DBE1EE` | `bg-surface-container-highest` | Strongest surface tone without going to a brand color. |
| `surface-dim` | `#D4DBEA` | `bg-surface-dim` | Pressed states, disabled fills. |
| `surface-variant` | `#DBE1EE` | `bg-surface-variant` | Alternate surface for chips, tags. |

**Rule of thumb:** alternating sections on the homepage step through `surface` → `surface-container-low` → `surface` → `surface-container` to create rhythm without lines.

### On-surface text

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `on-surface` | `#1B2233` | `text-on-surface` | Default body text. Near-black, slightly cool. |
| `on-surface-variant` | `#4E5871` | `text-on-surface-variant` | Muted text — captions, metadata, secondary copy. |
| `outline` | `#737E98` | `border-outline` | When you absolutely need a border (rare). |
| `outline-variant` | `#C9D2E5` | `border-outline-variant` | Even softer border. Use this 99% of the time you reach for a border. |

### Feedback colors

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `success` | `#66BB6A` | `bg-success` / `text-success` | Correct demo answers, "you did it" moments. |
| `success-light` | `#E8F5E9` | `bg-success-light` | Soft success backgrounds. |
| `warning` | `#FFA726` | `bg-warning` | Cautions, "needs review" pills. |
| `error` | `#BA1A1A` | `bg-error` / `text-error` | Wrong answers in demos, form errors. |
| `error-container` | `#FFDAD6` | `bg-error-container` | Soft error backgrounds. |
| `error-light` | `#FFEBEE` | `bg-error-light` | Lightest error tint. |

### Premium / Sidekick AI

Use **only** in the premium AI section, the `/premium` page, and Sidekick chat UI examples. Premium is a "sacred moment" and overusing the gold cheapens it.

| Token | Hex | Tailwind | Use for |
|---|---|---|---|
| `premium-gold` | `#B8942A` | `bg-premium-gold` | Premium icons, badges, accent strokes. |
| `premium-gold-light` | `#F4E3A6` | `bg-premium-gold-light` | Soft premium backgrounds, sample journal cards. |
| `premium-gradient-from` | `#B8942A` | `from-premium-gradient-from` | Gradient start (use with Tailwind's `bg-gradient-*`). |
| `premium-gradient-to` | `#D6B45E` | `to-premium-gradient-to` | Gradient end. |

### Book colors (used in screenshots, demo cards, scripture references)

| Token | Hex | Tailwind | Book |
|---|---|---|---|
| `book-ot` | `#8D6E63` | `bg-book-ot` / `text-book-ot` | Old Testament — earthy brown. |
| `book-nt` | `#5C6BC0` | `bg-book-nt` / `text-book-nt` | New Testament — indigo. |
| `book-bom` | `#26A69A` | `bg-book-bom` / `text-book-bom` | Book of Mormon — teal. |
| `book-dc` | `#AB47BC` | `bg-book-dc` / `text-book-dc` | Doctrine & Covenants — purple. |

### Mastery level colors (used in screenshots and the How-it-works section)

| Token | Hex | Tailwind | Level |
|---|---|---|---|
| `mastery-new` | `#9E9E9E` | `bg-mastery-new` | New |
| `mastery-learning` | `#FF8A65` | `bg-mastery-learning` | Learning |
| `mastery-familiar` | `#FFD54F` | `bg-mastery-familiar` | Familiar |
| `mastery-memorized` | `#81C784` | `bg-mastery-memorized` | Memorized |
| `mastery-mastered` | `#64B5F6` | `bg-mastery-mastered` | Mastered |
| `mastery-eternal` | `#B8942A` | `bg-mastery-eternal` | Eternal — sacred gold |

### Dark mode — "Midnight" (Tier 1 plans light only, ship dark in a follow-up)

Reserved tokens (not built in v1):

| Token | Hex | Use for |
|---|---|---|
| `dark-background` | `#131A2B` | Page background in dark mode |
| `dark-card` | `#1C2438` | Card background in dark mode |
| `dark-on-surface` | `#E4E9F5` | Default text in dark mode — cool blue-tinted white |

---

## Typography

**Two families. No more.**

- **Merriweather** (Google Fonts) — serif, used for all display and headline text. The editorial voice.
- **Inter** (Google Fonts) — sans-serif, used for body, UI labels, buttons. The guide voice.

Load both via `@fontsource/merriweather` and `@fontsource/inter` (self-host, don't link Google CDN — better perf, better privacy).

### Scale

Match the Flutter app's text theme exactly. All sizes in `tailwind.config.js`.

| Token | Family | Size | Weight | Line height | Letter spacing | Use for |
|---|---|---|---|---|---|---|
| `display-lg` | Merriweather | 36px | 700 | 1.15 | -0.5px | Hero headline |
| `display-md` | Merriweather | 30px | 700 | 1.2 | -0.3px | Major section headings |
| `display-sm` | Merriweather | 24px | 700 | 1.25 | 0 | Sub-section headings |
| `headline-lg` | Merriweather | 22px | 700 | 1.3 | 0 | Card titles, important headings |
| `headline-md` | Merriweather | 20px | 600 | 1.3 | 0 | Mid-level headings |
| `headline-sm` | Merriweather | 18px | 600 | 1.3 | 0 | Small headings, italic for AppBar style |
| `title-lg` | Inter | 16px | 600 | 1.4 | 0 | Button labels, UI titles |
| `title-md` | Inter | 14px | 500 | 1.4 | 0 | Secondary titles |
| `body-lg` | Inter | 16px | 400 | 1.6 | 0 | Body text — primary |
| `body-md` | Inter | 14px | 400 | 1.5 | 0 | Body text — secondary |
| `body-sm` | Inter | 12px | 400 | 1.4 | 0 | Captions, metadata (use `on-surface-variant` color) |
| `label-lg` | Inter | 14px | 600 | 1.2 | 0.5px | Button text, prominent labels |
| `label-md` | Inter | 12px | 600 | 1.2 | 1.0px | Eyebrow labels (uppercase recommended) |
| `label-sm` | Inter | 10px | 600 | 1.2 | 1.5px | Tiny labels, nav indicators (uppercase) |

### Web-only adjustments

The Flutter scale tops out at 36px because phones are small. The web hero can go bigger:

| Token | Size | Use for |
|---|---|---|
| `hero-xl` | 72px on desktop, 48px on mobile | Hero headline ("Master all 100…") |
| `hero-lg` | 56px on desktop, 36px on mobile | Suite portfolio hero, premium page hero |

Implement these as responsive Tailwind: `text-5xl md:text-7xl` etc.

### Tone rules

- Headlines are sentence case, not title case ("How it works", not "How It Works").
- Eyebrow labels are uppercase with letter-spacing.
- Long-form body text (blog) uses Merriweather 18px at 1.7 line-height for readability.
- Italic is reserved for emphasis and scripture quotations. Don't italicize the brand name.

---

## Spacing

Tailwind's default spacing scale works fine, but our "rhythm" comes from this subset. Stick to these:

| Token | Px | Use for |
|---|---|---|
| `space-1` | 4 | Tightest gap |
| `space-2` | 8 | Default tight |
| `space-4` | 16 | Default — most gaps between elements |
| `space-6` | 24 | Comfortable separation |
| `space-8` | 32 | Section internals |
| `space-12` | 48 | Between sub-sections |
| `space-16` | 64 | Between major sections (mobile) |
| `space-24` | 96 | Between major sections (desktop) |
| `space-32` | 128 | Hero top/bottom on desktop |

Page-level rhythm: sections separate by at least `py-16` on mobile, `py-24` on desktop. Generous whitespace is part of the brand.

---

## Border Radius

**Smooth stones.** Radii are large.

| Token | Px | Tailwind | Use for |
|---|---|---|---|
| `radius-sm` | 8 | `rounded-lg` | Tags, chips, small UI elements |
| `radius-md` | 16 | `rounded-2xl` | Inputs, buttons (when not pill), small cards |
| `radius-lg` | 24 | `rounded-3xl` | Medium cards, panels |
| `radius-xl` | 32 | `rounded-[2rem]` | **Default for cards.** Most card-shaped things use this. |
| `radius-xxl` | 48 | `rounded-[3rem]` | Hero sections, oversized feature cards |
| `radius-full` | 9999 | `rounded-full` | Pill buttons, avatars |

Buttons are pill-shaped (`rounded-full`) by default. Outlined buttons too.

---

## Shadows ("Tinted, never pure black")

Two named shadows. **Never** use Tailwind's default `shadow-lg`, `shadow-xl` — those are too gray. Use these:

```css
/* in src/app.css */
:root {
  --shadow-editorial: 0 4px 20px 0 rgb(27 34 51 / 0.06); /* on-surface @ 6% */
  --shadow-floating: 0 12px 40px 0 rgb(27 34 51 / 0.04); /* on-surface @ 4% */
}
```

Use in Tailwind:
- `shadow-editorial` — Default card shadow. Subtle lift.
- `shadow-floating` — Big floating elements (hero phone mockup, premium teaser cards). Larger blur, softer.

---

## Motion

Calm, warm, intentional. Nothing snappy or arcade-y.

### Easing

```css
/* Standard easing for everything */
--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
```

Tailwind: extend with `'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)'` so we get `ease-out-soft`.

### Durations

| Token | Ms | Use for |
|---|---|---|
| `duration-fast` | 150 | Hover transitions, button presses |
| `duration-base` | 250 | Default transition |
| `duration-slow` | 450 | Section reveals, hero float-in |
| `duration-slowest` | 800 | Hero phone mockup float loop, ambient animations |

### Common motion patterns

- **Card hover.** `translate-y -4px` + shadow lift from `shadow-editorial` to `shadow-floating`. Duration: `duration-base`. Easing: `ease-out-soft`.
- **Hero phone float.** Looped, `translate-y -6px` to `0`, duration: 8s, easing: `ease-in-out`, infinite.
- **Section fade-in.** `opacity 0 → 1`, `translate-y 16px → 0`, duration `duration-slow`, triggered on intersection. Use Svelte's `intersection` action.
- **Demo correct.** Pulse: `scale 1 → 1.03 → 1` over 300ms, plus brief green halo.
- **Demo incorrect.** Shake: `translate-x ±8px ±4px 0` over 400ms, plus brief red halo.
- **No carousel auto-rotation.** Don't move things the user didn't ask to move (beyond ambient hero loop).

### Confetti

Use [`canvas-confetti`](https://github.com/catdad/canvas-confetti) for demo completion. Brand colors only — primary, secondary-fixed-dim, tertiary-container, accent.

---

## Component Patterns

### Buttons

| Variant | Background | Text | Border | Radius | Padding |
|---|---|---|---|---|---|
| Primary | `bg-primary` | `text-on-primary` | none | `rounded-full` | `px-6 py-3` |
| Secondary | `bg-secondary` | `text-on-secondary` | none | `rounded-full` | `px-6 py-3` |
| Outlined | `bg-transparent` | `text-primary` | `border border-outline-variant/30` | `rounded-full` | `px-6 py-3` |
| Ghost | `bg-transparent` | `text-on-surface` | none | `rounded-full` | `px-6 py-3` |
| Tertiary (sacred) | `bg-tertiary-container` | `text-on-primary` | none | `rounded-full` | `px-6 py-3` |

Text style: `label-lg` (Inter 14px, 600 weight, 0.5px letter-spacing). Hover: subtle `bg-primary/90` darkening, 150ms.

App Store / Play Store buttons are real official badges, not custom. Use the SVGs from Apple's Marketing Guidelines and Google's brand page.

### Cards

```svelte
<div class="bg-surface-container-lowest rounded-[2rem] p-8 shadow-editorial">
  <!-- content -->
</div>
```

Default card = `surface-container-lowest` (white) + `rounded-[2rem]` (32px) + `shadow-editorial` + `p-8` (32px padding). On hover (if interactive), lift to `shadow-floating` and `-translate-y-1`.

### Sections

```svelte
<section class="py-16 md:py-24">
  <div class="mx-auto max-w-6xl px-4 md:px-8">
    <!-- content -->
  </div>
</section>
```

Section padding: `py-16` mobile, `py-24` desktop. Max-width: `6xl` (1152px) for most sections. Hero and demos can go to `7xl` (1280px).

### Hero

The hero is the front door. It must feel like opening a beautiful book.

- Background: `surface` with a subtle warm gradient overlay (or a faint texture, see Assets below).
- Headline: `display-lg` desktop sizing scaled up to `hero-xl` (72px), Merriweather 700, `text-on-surface`, max-width `4xl` for readability.
- Sub: `body-lg` + 1.5× line-height, `text-on-surface-variant`, max-width `2xl`.
- Eyebrow: `label-md` uppercase with `text-primary`.
- CTA row: two pill buttons side-by-side, gap-4. Primary (App Store / Play Store) + Secondary ("Try a Quick Quiz →").
- Phone mockup: floating to the right on desktop, below CTAs on mobile. `shadow-floating`. Subtle float animation.

### Eyebrow labels

The little uppercase label above a heading. Used for section identification.

```svelte
<p class="text-primary text-xs font-semibold uppercase tracking-[1.5px] mb-3">
  How it works
</p>
<h2 class="font-serif text-display-md">Study, build, prove, master.</h2>
```

### Quote / Scripture rendering

When showing scripture text in any context:

```svelte
<blockquote class="font-serif text-xl md:text-2xl leading-relaxed text-on-surface italic max-w-3xl mx-auto">
  "For with God nothing shall be impossible."
  <footer class="not-italic font-sans text-sm text-on-surface-variant mt-3 tracking-wide uppercase">
    Luke 1:37 — New Testament
  </footer>
</blockquote>
```

---

## Accessibility Minimums

Non-negotiable:

- **Contrast.** All text meets WCAG AA: 4.5:1 for body, 3:1 for large text (18px+ or 14px+ bold). Use the `on-*` color tokens — they're contrast-tested against their base.
- **Focus.** Every interactive element has a visible focus ring. Default: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none`. Define as a Tailwind utility in `src/app.css`.
- **Hit targets.** Minimum 44×44px for any tap target on mobile. Buttons and links in nav are at least `h-11`.
- **Headings.** Pages have a single `<h1>`, headings descend in order. Don't use heading sizes for visual styling — use the `display-*` classes on `<p>` or `<div>` if needed.
- **Motion.** Respect `prefers-reduced-motion`. All ambient animations (hero float, section reveals) are gated on it. Tailwind: `motion-safe:` and `motion-reduce:` variants.
- **Images.** Every `<img>` has alt text. Decorative images use `alt=""` (not omitted).
- **Forms.** Every input has a `<label>`. Errors are announced via `aria-live`.
- **Color is never the only signal.** Wrong answers in demos get a shake + an error icon, not just red. Correct ones get a checkmark + green.
- **Skip link.** First focusable element on every page is "Skip to main content."

---

## Asset Conventions

Mirrored from the Flutter app's `assets/` convention:

### Images

- Never generate real image files. When a section needs an image, create a `.txt` placeholder at the intended path with a detailed description: composition, style, mood, dimensions, color cues, references.
- Example: `static/images/hero_phone_mockup.txt` describing the floating phone screenshot we need.
- The owner generates or sources the real image and replaces the `.txt` with the real file (`.png`, `.webp`, `.svg`).
- Don't reference `.txt` files from code — code references the intended final path, which initially 404s until the asset lands.

### App Store / Play Store badges

Use the official SVGs:
- Apple: https://developer.apple.com/app-store/marketing/guidelines/
- Google: https://play.google.com/intl/en_us/badges/

Drop in `static/images/badges/`. Don't restyle them — Apple is strict about this.

### Icons

[`lucide-svelte`](https://lucide.dev/) for all UI icons. One library, consistent stroke, full set. Default size: 20px. Default stroke: 1.5. Default color: inherits from text color.

### Illustrations

Custom SVGs only. Saved as `.svg` in `static/images/illustrations/`. Use Tailwind colors via CSS variables so they theme correctly: `fill="var(--color-primary)"`.

---

## Tailwind Config Sketch

Drop this into `tailwind.config.js` during Phase A. Agents working on individual sections can assume these tokens exist:

```js
// tailwind.config.js (sketch — TASK-002 implements the real thing)
export default {
  content: ['./src/**/*.{svelte,svx,ts,js,html}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2F4374', container: '#5C77AE', fixed: '#DCE4F9', 'fixed-dim': '#9FB4E8' },
        'on-primary': { DEFAULT: '#FFFFFF', container: '#12224A' },
        secondary: { DEFAULT: '#3F6E9C', container: '#C7DDF0' },
        'on-secondary': { DEFAULT: '#FFFFFF' },
        tertiary: { DEFAULT: '#6F5A10', container: '#B8942A', fixed: '#F4E3A6' },
        accent: { DEFAULT: '#5B8ABF', light: '#89B4DB' },
        surface: {
          DEFAULT: '#F7F8FC',
          'container-lowest': '#FFFFFF',
          'container-low': '#EFF2F9',
          container: '#E9EDF6',
          'container-high': '#E2E7F2',
          'container-highest': '#DBE1EE',
          dim: '#D4DBEA',
          variant: '#DBE1EE',
        },
        'on-surface': { DEFAULT: '#1B2233', variant: '#4E5871' },
        outline: { DEFAULT: '#737E98', variant: '#C9D2E5' },
        success: { DEFAULT: '#66BB6A', light: '#E8F5E9' },
        warning: { DEFAULT: '#FFA726' },
        error: { DEFAULT: '#BA1A1A', container: '#FFDAD6', light: '#FFEBEE' },
        'premium-gold': { DEFAULT: '#B8942A', light: '#F4E3A6' },
        book: { ot: '#8D6E63', nt: '#5C6BC0', bom: '#26A69A', dc: '#AB47BC' },
        mastery: {
          new: '#9E9E9E', learning: '#FF8A65', familiar: '#FFD54F',
          memorized: '#81C784', mastered: '#64B5F6', eternal: '#B8942A',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-md': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
      },
      borderRadius: {
        '2.5xl': '1.25rem', // 20px
        '4xl': '2rem',      // 32px (default card)
        '5xl': '3rem',      // 48px
      },
      boxShadow: {
        editorial: '0 4px 20px 0 rgb(27 34 51 / 0.06)',
        floating: '0 12px 40px 0 rgb(27 34 51 / 0.04)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        450: '450ms',
        800: '800ms',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
```

---

## Do / Don't

### Do
- Use semantic color tokens (`bg-primary`, `text-on-surface`).
- Use the surface hierarchy to separate content.
- Use `font-serif` for any heading, `font-sans` for body and UI.
- Use `rounded-[2rem]` for cards, `rounded-full` for buttons.
- Use `shadow-editorial` for default cards, `shadow-floating` for elevated ones.
- Use `ease-out-soft` for all transitions.
- Respect `prefers-reduced-motion`.
- Test contrast in the design tool before committing.
- Keep section copy short. Whitespace is part of the design.

### Don't
- ❌ Use raw hex values in component code.
- ❌ Use Tailwind's default `shadow-*` utilities (`shadow-lg`, `shadow-xl`, etc.) — too gray.
- ❌ Use `border-*` to separate content if surface elevation can do the job.
- ❌ Use sharp corners (`rounded-none`, `rounded-sm`) on cards or buttons.
- ❌ Use system fonts as primary. Always Merriweather + Inter.
- ❌ Use red/green as the only signal for success/error.
- ❌ Use auto-rotating carousels.
- ❌ Restyle the App Store / Play Store badges.
- ❌ Use the premium gold outside premium contexts. It loses meaning.
- ❌ Use uppercase for regular headings. Reserved for eyebrow labels and tiny indicators.

---

## When in Doubt

- If the question is "should this look closer to the Flutter app?", the answer is yes.
- If you're considering an aesthetic that isn't documented here, pause and ask. Adding to the system requires a deliberate update to this file.
- If you're tempted to override a token "just this once," that's a sign the system needs another token. Propose it and update THEME.md.

The brand is bigger than this site. Every component built here might end up in the app marketing materials, the resource library, the community, or future Sidekick apps. Build like that future already exists.
