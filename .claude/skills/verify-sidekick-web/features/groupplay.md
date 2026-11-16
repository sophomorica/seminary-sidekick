# Group Play (Class Play) join page

A student enters the 4-letter code from the teacher's screen and either gets a clear error or a class-list name picker.

## Sub-features

- `/join` and `/join/[code]`: code field, nickname or roster picker, error line.
- Roster rooms show "Pick your name" with claimed seats marked.
- After joining: lobby, quiz, Scripture Builder race, results (Supabase Realtime).

## How to get to it (user POV)

"Join a room" in the header, or the link a teacher shares, `/join/ABCD`.

## Driving it with Playwright

`[groupplay]`: open `/join`, fill "Game code" with `ZZZZ` and expect "Room not found. Double-check the code." Then fill `CLAZ` and expect the "Class list" radiogroup with two seats, select "Ada Fixture", and expect the button "Join as Ada Fixture". The test then reads `rpc-calls.jsonl` and expects `get_room_join_info` for both codes with statuses 400 and 200. The fixtures live in `fake-supabase.mjs`. Run `$S/run.sh groupplay`.

## Gotchas

- A successful join needs Realtime, which the fake does not implement. This journey stops before joining. Lobby, gameplay and results are unverified here, and a real proof needs a Supabase test project.
- Do not point this at the production project. Joining creates anonymous auth users and room rows there.
- Classic (non-roster) rooms and `SEAT_ALREADY_CLAIMED` exist in the fake but are not driven.
