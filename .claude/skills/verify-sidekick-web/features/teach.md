# Teaching idea finder

A teacher picks a year, book, type or keyword and gets short teaching ideas, or opens a per-book page.

## Sub-features

- Filter form on `/teach` (year, book, type, search), server-filtered.
- Per-book page `/teach/[book]`, grouped by type, with honest thin and empty states.
- `/teach/mastery` doctrinal mastery hub.
- No private columns or free-asset flags ever reach the page.

## How to get to it (user POV)

Header "For teachers", then the "Teaching idea finder" link on `/teachers`. Or go to `/teach`.

## Driving it with Playwright

`[teach]` in `verify.spec.ts`: open `/teach` (10 cards), select Book `genesis` via `select[name="book"]`, click "Find ideas", expect `?book=genesis`, 3 `idea-card`s and `teach-count` "3 ideas". Then assert the HTML has no `source_ref`, `has_free_asset` or the fixture private ref. Then click the "Ruth" link under "Browse by book" and expect `book-thin`. Run `$S/run.sh teach`.

## Gotchas

- The data is the repo mock's 10 fixture rows, not the 1,179 production rows. A pass proves the code path and the privacy filter, not the catalog.
- Not driven yet: course, type and keyword filters, `/teach/mastery`, 404 for an unknown book. `tests/teach.spec.ts` covers them against the same mock.
