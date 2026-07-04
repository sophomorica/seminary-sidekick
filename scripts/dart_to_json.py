#!/usr/bin/env python3
"""Regenerate src/lib/data/doctrinalMastery.json from the Flutter app's
scriptures_data.dart (the single source of truth for the 100 scriptures).

Usage:
    python3 scripts/dart_to_json.py [path/to/scriptures_data.dart]

Defaults to the sibling Flutter repo layout:
    ../seminary_sidekick/lib/data/scriptures_data.dart  (relative to repo root)

The emitted JSON mirrors the Flutter `Scripture` model minus computed
fields (`words`, `wordCount`), matching src/lib/data/types.ts:
    id, book, volume, reference, name, keyPhrase, fullText
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DART = (
    REPO_ROOT.parent.parent / "seminary_sidekick" / "lib" / "data" / "scriptures_data.dart"
)
OUT_PATH = REPO_ROOT / "src" / "lib" / "data" / "doctrinalMastery.json"

FIELDS = ["id", "book", "volume", "reference", "name", "keyPhrase", "fullText"]


def parse_dart_string(segment: str) -> str:
    """Concatenate adjacent single-quoted Dart string literals and unescape."""
    parts = re.findall(r"'((?:[^'\\]|\\.)*)'", segment)
    raw = "".join(parts)
    return raw.replace("\\'", "'").replace("\\n", "\n").replace("\\\\", "\\")


def main() -> None:
    dart_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DART
    source = dart_path.read_text(encoding="utf-8")

    # Split on `Scripture(` constructor starts; each chunk runs to the next one.
    chunks = re.split(r"\bScripture\(", source)[1:]
    scriptures = []
    for chunk in chunks:
        entry = {}
        for field in FIELDS:
            if field == "book":
                m = re.search(r"\bbook:\s*ScriptureBook\.(\w+)", chunk)
                if not m:
                    break
                entry[field] = m.group(1)
            else:
                # Capture one-or-more adjacent single-quoted literals
                # (Dart concatenates them). Immune to parens/commas in text.
                m = re.search(
                    rf"\b{field}:\s*((?:'(?:[^'\\]|\\.)*'\s*)+)", chunk, re.DOTALL
                )
                if not m:
                    break
                entry[field] = parse_dart_string(m.group(1))
        if len(entry) == len(FIELDS):
            scriptures.append(entry)

    assert len(scriptures) == 100, f"expected 100 scriptures, parsed {len(scriptures)}"
    ids = [s["id"] for s in scriptures]
    assert ids == [str(n) for n in range(1, 101)], "ids must be '1'..'100' in order"

    OUT_PATH.write_text(
        json.dumps(scriptures, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8"
    )
    by_book = {}
    for s in scriptures:
        by_book[s["book"]] = by_book.get(s["book"], 0) + 1
    print(f"Wrote {len(scriptures)} scriptures to {OUT_PATH}")
    print(f"Distribution: {by_book}")


if __name__ == "__main__":
    main()
