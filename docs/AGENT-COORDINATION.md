# Agent Coordination — Seminary Sidekick Site

Moved verbatim from the original CLAUDE.md.

## Agent Coordination

This project is built to run many agents in parallel. The same claim/complete pattern from the Flutter app applies.

### Quick start

```
1. Read this file (CLAUDE.md)      → Understand the project
2. Read THEME.md                   → Understand the visual system
3. Read TODO.md                    → Find an open task
4. Claim the task                  → Write your agent ID into TODO.md, commit
5. Do the work                     → Follow conventions, only touch files in `files_to_touch`
6. Mark task done                  → Update TODO.md, commit
```

### Claiming a task

1. Pull latest, then read `TODO.md` fresh (never rely on cached state).
2. Find a task with `status: open`.
3. Check `depends_on` — don't start blocked work.
4. Check `files_to_touch` — verify no other in-progress task overlaps.
5. Edit `TODO.md`: set `status: in_progress`, `claimed_by: [your-id]`, `started: [ISO timestamp]`.
6. **Commit the claim before writing code:** `git add TODO.md && git commit -m "claim TASK-XXX: [description]"`.
7. Push.

If two agents claim the same task, the second push fails with a non-fast-forward. Pull, see it's taken, pick another task.

### Completing a task

1. Finish the code changes.
2. Verify acceptance criteria locally (run `pnpm dev`, run `pnpm check`, run any tests).
3. Edit `TODO.md`: set `status: done`, add `completed` timestamp, check acceptance criteria, add notes.
4. Commit everything: `git add -A && git commit -m "complete TASK-XXX: [what was done]"`.
5. Push.

### Blocked or abandoned

- **Blocked:** set `status: blocked`, add `blocked_by` note, commit, move on.
- **Abandoned:** set `status: open`, clear `claimed_by`, add notes explaining why, commit.

### File ownership

Two agents should never edit the same file concurrently. **The TODO.md `files_to_touch` field is the contract.** Before claiming a task, scan the other in-progress tasks and verify no overlap.

**Shared files (extra caution):**
- `tailwind.config.js`
- `src/app.css`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/lib/config/*.ts`
- `package.json`
- `CLAUDE.md`, `THEME.md`, `TODO.md`

If you need to change one of these for your task, claim it explicitly in `files_to_touch` and finish quickly.

### Commit format

```
[verb] TASK-XXX: [concise description]
```

Verbs: `claim`, `complete`, `fix`, `add`, `update`, `refactor`, `block`.

### Parallel-safe component pattern

Homepage sections live in `src/lib/components/sections/` as standalone files (one per section). The homepage `+page.svelte` is a thin composition shell that imports each section. This lets multiple agents work on different sections without touching the same file.

```svelte
<!-- src/routes/+page.svelte (one agent owns this composition) -->
<script lang="ts">
  import Hero from '$lib/components/sections/Hero.svelte';
  import HowItWorks from '$lib/components/sections/HowItWorks.svelte';
  import QuickQuizDemo from '$lib/components/demos/quick-quiz/QuickQuizDemo.svelte';
  import PremiumPeek from '$lib/components/sections/PremiumPeek.svelte';
  import ForTeachersStrip from '$lib/components/sections/ForTeachersStrip.svelte';
  import NewsPreview from '$lib/components/sections/NewsPreview.svelte';
  import FinalCTA from '$lib/components/sections/FinalCTA.svelte';
</script>

<Hero />
<HowItWorks />
<QuickQuizDemo />
<PremiumPeek />
<ForTeachersStrip />
<NewsPreview />
<FinalCTA />
```

Each `<X />` component is built by a different agent in parallel and lands independently.
