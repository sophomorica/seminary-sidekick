# `src/lib/data/` — Scripture data

This directory holds the doctrinal-mastery scripture corpus that the
website needs for demos, product pages, and any in-text scripture
rendering.

## Files

| File | Purpose |
| --- | --- |
| `doctrinalMastery.json` | Authoritative data — 100 scriptures, ported from the Flutter app. |
| `types.ts` | TypeScript types (`Scripture`, `ScriptureBook`) and book metadata (`BOOK_META`, `BOOK_ORDER`). |
| `scriptures.ts` | Typed access helpers — `getScripture(id)`, `getScripturesByBook(book)`, `pickRandomScriptures(n)`, etc. |

## Source of truth

`doctrinalMastery.json` is **generated from the Flutter app's
`lib/data/scriptures_data.dart`**. The Flutter file is the source of
truth — if scriptures get added, edited, or reordered, update the
Flutter source first, then re-run the port script to regenerate this
JSON.

### Re-porting

When the Flutter app's data changes, regenerate this JSON:

```sh
# From any host with both repos checked out:
python3 path/to/dart_to_json.py
```

A copy of the port script lives in the agent session's `outputs/`
directory under `dart_to_json.py`. It parses the Dart source's
`Scripture(...)` blocks and emits this JSON. Re-running it overwrites
`doctrinalMastery.json` in place.

If the Flutter `Scripture` model gains new fields, update both
`types.ts` and the Python port script before regenerating.

## Distribution

- Old Testament: 24
- New Testament: 24
- Book of Mormon: 24
- Doctrine & Covenants: 28
- **Total: 100**

## Usage

```svelte
<script lang="ts">
  import { ALL_SCRIPTURES, getScripture, pickRandomScriptures } from '$lib/data/scriptures';
  import { BOOK_META } from '$lib/data/types';

  const five = pickRandomScriptures(5);
  const lehi = getScripture('42'); // example
</script>

{#each five as s (s.id)}
  <article>
    <p class={BOOK_META[s.book].tailwindText}>{BOOK_META[s.book].label}</p>
    <h2>{s.reference} — {s.name}</h2>
    <p>{s.keyPhrase}</p>
  </article>
{/each}
```

## Bundle impact

The full JSON inlines at ~30KB. That's acceptable for a marketing site
where demos use the data on the same pages. If we ever need to ship a
smaller subset (e.g., a "preview" 10-scripture set for SEO crawlers),
add a `previewSubset.json` rather than splitting this file.
