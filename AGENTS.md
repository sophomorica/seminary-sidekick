# AGENTS.md

Standing brain for Grok Bot, Grok Build, Cursor, and GitHub. Start here. Then read `CLAUDE.md`.

**Repo:** Seminary Sidekick website (`sophomorica/seminary-sidekick`).

This clone is the instruction set. Hub is not here. Do not open `../../hub/standards/`.

Definition of done (all must be true):
1. This repo’s analyze or lint command exits 0.
2. This repo’s test command exits 0. New behavior has a test.
3. Build or typecheck succeeds when the repo has one.
4. No orphans (unreachable screens, unused new files).
5. No secrets in git.
6. If `.claude/stop-gate.sh` exists, you ran it and it exited 0. If it does not exist, do not write that a Stop hook ran.

Workers escalate architecture instead of inventing it.
Commands and stack rules: `CLAUDE.md`.
