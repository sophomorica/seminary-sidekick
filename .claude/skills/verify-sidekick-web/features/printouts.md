# Scripture Builder printouts

A teacher finds one of 100 doctrinal mastery verses and opens a printable tile sheet.

## Sub-features

- Finder at `/teachers/printouts`: this-week pin, search, level switch (Beginner, Intermediate, Advanced).
- Sheet at `/teachers/printouts/[slug]/[level]`, with print-fit locks (`data-font-pt`, pages per group).
- Group stepper for lettered sheets A to J.

## How to get to it (user POV)

"For teachers" in the header, then the printouts link. Or `/teachers/printouts`.

## Driving it with Playwright

`[printouts]`: open the finder (`#printout-finder`, `data-verse-count="100"`), search "joy" in the "Find a scripture" searchbox, click `[data-verse-slug="2-nephi-2-25"]`, expect `data-selected-slug`, click "Print tiles", expect the sheet URL `/teachers/printouts/2-nephi-2-25/beginner`, `[data-sheet-kind="tiles"]` visible, and the group A tiles (`[data-tile-phrase]`) include "Adam fell". Run `$S/run.sh printouts`.

## Gotchas

- This feature needs no Supabase. It is static scripture data, so a pass here says nothing about the fake.
- Not driven: print layout in a real printer or PDF, Advanced glyph sheets, the group stepper. `tests/printouts.spec.ts` pins the fit locks.
- The this-week pin depends on the date in Denver, so do not assert a specific pinned verse.
