<!--
  ClassPlay — homepage marquee section for the live classroom
  multiplayer mode.

  Status: SHIPPED in the app (v1, May 2026) — two modes (live Quick
  Quiz + Scripture Builder Race), 4-letter join codes + QR, lobby,
  live leaderboard with rank deltas, podium results. The app itself
  is still pre-launch, so the framing is "built and ready at launch"
  and the waitlist captures teachers who want to know when the app
  ships.

  Strategic role: this is the viral mechanic of Seminary Sidekick.
  One teacher running a live class round = 20-30 students opening the
  app at once. The section's job is to (a) capture teacher interest
  pre-launch via a waitlist and (b) advertise the feature so it has
  momentum on launch day.

  Free vs Premium (keep in sync with the app — group_play_service.dart):
    Free host  = 1 game per week, rooms up to 6 players.
    Premium    = unlimited hosting, class rooms up to 30 players.
    Joining is always free — only the HOST needs Premium.

  Sits between <ScriptureMatchDemo /> and <ForTeachersStrip /> in the
  homepage composition so the narrative flow becomes:
    "You just played alone… now imagine your whole class on the same
     board, live."

  Per THEME.md:
   - Section bg surface-container — gives ClassPlay its own visual
     rhythm distinct from the surface demos above and the
     surface-container ForTeachersStrip below (kept consistent — the
     gentle ambient mix below adds a premium-gold-light radial behind
     the leaderboard mockup so the two strips don't read identically).
   - Rounded-4xl card surface (32px), shadow-floating on the mockup,
     pill-shaped buttons, lucide icons, no raw hex.
   - Plausible-but-fake student first names only (Sarah, Eli, Maya, Jonas).
-->
<script lang="ts">
	import WaitlistForm from '$lib/components/forms/WaitlistForm.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight, TrendingDown, TrendingUp, Trophy, Users, Zap } from 'lucide-svelte';
	import { reveal } from '$lib/actions';

	type LeaderboardRow = {
		rank: number;
		name: string;
		score: number;
		/** Positions gained (+) or lost (−) since the last question — mirrors the app's rank deltas. */
		delta?: number;
		highlight?: boolean;
	};

	// Stylised live-game leaderboard. Plausible first names only;
	// "Sarah" sits at the top with a subtle highlight so the eye lands.
	const leaderboard: LeaderboardRow[] = [
		{ rank: 1, name: 'Sarah', score: 1840, delta: 1, highlight: true },
		{ rank: 2, name: 'Eli', score: 1720, delta: -1 },
		{ rank: 3, name: 'Maya', score: 1610 },
		{ rank: 4, name: 'Jonas', score: 1495, delta: 2 }
	];
</script>

<section
	id="class-play"
	class="relative overflow-hidden bg-surface-container py-16 md:py-24"
	aria-labelledby="class-play-headline"
>
	<!-- Ambient warm radial so this strip reads distinct from the
	     ForTeachersStrip below (which uses the same base surface tone). -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 45% 55% at 80% 30%, var(--color-primary-fixed) 0%, transparent 60%),
			radial-gradient(ellipse 35% 50% at 15% 80%, var(--color-secondary-container) 0%, transparent 65%);
			opacity: 0.45;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16"
		use:reveal
	>
		<!-- Copy column -->
		<div class="max-w-xl">
			<p class="eyebrow">In the app · Class Play</p>

			<h2
				id="class-play-headline"
				class="font-serif text-display-lg tracking-tight md:text-display-lg lg:text-hero-lg"
			>
				Like Kahoot, for scripture mastery.
			</h2>

			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				Class-wide live rounds, built in and ready at launch. Students join with a
				four-letter code or a QR scan — then it's live Quick Quiz or a Scripture Builder
				race, on the same board, in real time, from the phones in their pockets.
			</p>

			<!-- Three quick value props above the form so the waitlist has weight. -->
			<ul class="mt-8 space-y-3" aria-label="What Class Play unlocks">
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary"
						aria-hidden="true"
					>
						<Users class="h-4 w-4" stroke-width={1.75} />
					</span>
					<p class="text-on-surface">
						<span class="font-semibold">A whole class on one board.</span>
						<span class="text-on-surface-variant">
							Project the live leaderboard from the front; students play on their
							phones.
						</span>
					</p>
				</li>
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary"
						aria-hidden="true"
					>
						<Zap class="h-4 w-4" stroke-width={1.75} />
					</span>
					<p class="text-on-surface">
						<span class="font-semibold">Two ways to play.</span>
						<span class="text-on-surface-variant">
							Fast Quick Quiz rounds for warmups, or a Scripture Builder race to prove
							verses cold — head to head.
						</span>
					</p>
				</li>
				<li class="flex items-start gap-3">
					<span
						class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary"
						aria-hidden="true"
					>
						<Trophy class="h-4 w-4" stroke-width={1.75} />
					</span>
					<p class="text-on-surface">
						<span class="font-semibold">Healthy, reverent competition.</span>
						<span class="text-on-surface-variant">
							A leaderboard that celebrates learners, not flashier feature work.
						</span>
					</p>
				</li>
			</ul>

			<!-- Free vs Premium clarity line — everyone can try it; Premium
			     is what unlocks real classroom hosting. -->
			<p class="mt-8 rounded-2xl bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
				<span class="font-semibold text-on-surface">Free to try, built to scale.</span>
				Every host can run one casual game a week with up to 6 players — free.
				<a href="/premium" class="font-semibold text-tertiary underline-offset-2 hover:underline">Premium</a>
				unlocks class rooms of up to 30 players, as many games as you want. Students
				always join free.
			</p>

			<!-- Waitlist form + secondary read-more. Form first; CTA second. -->
			<div class="mt-10 space-y-4">
				<WaitlistForm placement="homepage" />
				<div>
					<Button href="/for-teachers#class-play" variant="outlined">
						Read more
						<ArrowRight aria-hidden="true" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Visual column — stylised "live leaderboard" mockup -->
		<div class="relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end">
			<!--
				Faux live-game card. When a real screenshot lands at
				/images/class-play/leaderboard.png, replace the inner block
				with an <img> at that path. See the .txt sibling for spec.
			-->
			<div
				class="relative overflow-hidden rounded-4xl bg-surface-container-lowest p-6 shadow-floating md:p-8"
				data-placeholder
				aria-hidden="true"
			>
				<!-- Live header chip + faux session code -->
				<div class="flex items-center justify-between">
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-3 py-1 text-label-md uppercase text-error"
					>
						<span class="h-2 w-2 rounded-full bg-error motion-safe:animate-pulse"
						></span>
						Live
					</span>
					<span class="text-body-sm text-on-surface-variant">
						Join code <span
							class="font-mono font-semibold tracking-widest text-on-surface"
							>MAZE</span
						>
					</span>
				</div>

				<!-- Active question card -->
				<div
					class="relative mt-5 overflow-hidden rounded-3xl bg-surface-container-low p-5 shadow-editorial"
				>
					<span class="absolute top-4 bottom-4 left-0 w-1 rounded-r-full bg-primary"
					></span>
					<p class="text-label-md uppercase text-on-surface-variant">Question 4 of 10</p>
					<p class="mt-2 font-serif text-headline-md italic text-on-surface">
						"Ye are the light of the world."
					</p>
					<p class="mt-3 text-body-md text-on-surface-variant">
						Which reference is this?
					</p>

					<!-- Faux answer chips -->
					<div class="mt-4 grid grid-cols-2 gap-2">
						<span
							class="rounded-2xl bg-primary px-3 py-2 text-center text-label-md text-on-primary"
						>
							Matt 5:14–16
						</span>
						<span
							class="rounded-2xl bg-surface-container-lowest px-3 py-2 text-center text-label-md text-on-surface"
						>
							Hel 5:12
						</span>
						<span
							class="rounded-2xl bg-surface-container-lowest px-3 py-2 text-center text-label-md text-on-surface"
						>
							John 3:16
						</span>
						<span
							class="rounded-2xl bg-surface-container-lowest px-3 py-2 text-center text-label-md text-on-surface"
						>
							2 Ne 2:25
						</span>
					</div>
				</div>

				<!-- Leaderboard -->
				<div class="mt-5">
					<div class="mb-3 flex items-center justify-between">
						<p class="text-label-md uppercase text-on-surface-variant">
							Live leaderboard
						</p>
						<span class="text-body-sm text-on-surface-variant">28 in class</span>
					</div>
					<ol class="space-y-2">
						{#each leaderboard as row (row.rank)}
							<li
								class="flex items-center gap-3 rounded-2xl px-3 py-2.5 {row.highlight
									? 'bg-tertiary-fixed/70'
									: 'bg-surface-container-low'}"
							>
								<span
									class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest font-serif text-headline-sm text-on-surface tabular-nums"
								>
									{row.rank}
								</span>
								<span class="flex-1 text-body-lg text-on-surface">{row.name}</span>
								{#if row.delta}
									<span
										class="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm tabular-nums {row.delta >
										0
											? 'bg-secondary-container text-secondary'
											: 'bg-error/10 text-error'}"
									>
										{#if row.delta > 0}
											<TrendingUp class="h-3 w-3" aria-hidden="true" />
										{:else}
											<TrendingDown class="h-3 w-3" aria-hidden="true" />
										{/if}
										{Math.abs(row.delta)}
									</span>
								{/if}
								<span
									class="font-serif text-headline-sm font-semibold text-on-surface tabular-nums"
								>
									{row.score.toLocaleString()}
								</span>
							</li>
						{/each}
					</ol>
				</div>
			</div>
		</div>
	</div>
</section>
