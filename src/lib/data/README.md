# `src/lib/data/` — Scripture data

The doctrinal-mastery scripture corpus the website uses for demos,
product pages, and any in-text scripture rendering.

## Source of truth

> **The Flutter app is the source of truth, not this repo.**

The canonical scripture corpus lives in the Flutter app at:

```
/Users/muse/Desktop/active/seminary_sidekick/lib/data/scriptures_data.dart
```

`src/lib/data/doctrinalMastery.json` in this repo is a **generated
port** of that Dart source. **Do not hand-edit the JSON.** Any change
to scripture content must happen in the Flutter app first, then this
JSON gets regenerated.

This rule exists because the same scripture data drives the live app
in production. Allowing two sources of truth guarantees they will
diverge. The Flutter app wins.

## Files

| File                    | Purpose                                                                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doctrinalMastery.json` | Generated — 100 scriptures from the Flutter app's `scriptures_data.dart`.                                                                                                                                                          |
| `types.ts`              | TypeScript types (`Scripture`, `ScriptureBook`) and `BOOK_META` / `BOOK_ORDER` constants.                                                                                                                                          |
| `scriptures.ts`         | Typed access helpers — `getScripture(id)`, `getScripturesByBook(book)`, `pickRandomScriptures(n)`, `countByBook()`, `TOTAL_SCRIPTURES`, `ALL_SCRIPTURES`. **Demos and pages should import from here, not from the JSON directly.** |

## Distribution

- Old Testament: 24
- New Testament: 24
- Book of Mormon: 24
- Doctrine & Covenants: 28
- **Total: 100**

This is the official LDS Doctrinal Mastery program count.

## Regenerating

When the Flutter app's `scriptures_data.dart` changes (scripture added,
text edited, reference fixed, etc.) the JSON must be regenerated.

The port script lives outside the web repo at:

```
~/.../local-agent-mode-sessions/.../outputs/dart_to_json.py
```

(Path varies by Cowork session. The script is short — a Python parser
that walks `Scripture(...)` blocks in the Dart source and emits the
JSON shape that mirrors the Flutter model.)

To regenerate:

```sh
python3 path/to/dart_to_json.py
# verify the count + distribution
python3 -c "import json; d=json.load(open('src/lib/data/doctrinalMastery.json')); print(len(d))"
```

If the Flutter `Scripture` model ever gains new fields, update:

1. `types.ts` (add the field to the `Scripture` type)
2. The port script (extract the new field from the Dart source)

Then regenerate.

## Usage

```svelte
<script lang="ts">
	import { ALL_SCRIPTURES, getScripture, pickRandomScriptures } from '$lib/data/scriptures';
	import { BOOK_META } from '$lib/data/types';

	const five = pickRandomScriptures(5);
	const passage = getScripture('42');
</script>

{#each five as s (s.id)}
	<article>
		<p class={BOOK_META[s.book].tailwindText}>{BOOK_META[s.book].label}</p>
		<h2>{s.reference} — {s.name}</h2>
		<p>{s.keyPhrase}</p>
	</article>
{/each}
```

## Why no `passages.json`

An earlier parallel attempt recovered a legacy `passages.json` from the
archived React webpage's git history. That file is **not used** — its
data was incomplete (most `fullPassage` fields were literally `"TODO"`).
The Flutter port supersedes it entirely. If you see a `passages.json`
in this directory in the future, it is stale and should be deleted.

## Bundle impact

The JSON inlines at ~30KB. That's fine for a marketing site where
demos use the data on the same pages. If we ever need a smaller subset
(e.g., a 10-scripture preview for SEO crawlers), add a `previewSubset.json`
rather than splitting `doctrinalMastery.json`.
