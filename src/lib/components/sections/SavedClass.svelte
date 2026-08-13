<!--
  SavedClass — how teachers save a classroom (Teacher Roster, live in-app).

  Product facts (keep in sync with the Flutter Teacher Roster):
    - Create a class, add a seat per student, load it when hosting Class Play.
    - Students join with the 4-letter *game* code (never a class invite code)
      at seminarysidekick.com/join or via the host QR, then pick their name.
    - First join claims the seat; later games light that seat green.
    - Free: 1 class / 6 seats. Premium: 10 classes / 30 seats.
    - No student accounts.

  Used on /for-teachers (#saved-class). Homepage + strip link here.
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
	import { Bookmark, CircleCheck, ListPlus, QrCode, RotateCcw } from 'lucide-svelte';
	import { reveal } from '$lib/actions';

	type Step = {
		title: string;
		body: string;
		icon: typeof ListPlus;
	};

	const steps: Step[] = [
		{
			title: 'Create the class',
			body: 'In the app, open Group Play and tap New class. Add a seat for each student — first names are enough.',
			icon: ListPlus
		},
		{
			title: 'Host and load it',
			body: 'Start a Class Play game and load that class. The roster is waiting before anyone joins.',
			icon: Bookmark
		},
		{
			title: 'Students pick their name',
			body: 'They go to seminarysidekick.com/join (or scan the QR on your screen), enter the four-letter game code, and tap their name.',
			icon: QrCode
		},
		{
			title: 'Next class is ready',
			body: 'Load the same class again. Seats already claimed light up green when those students join. No retyping.',
			icon: RotateCcw
		}
	];

	type RosterRow = {
		name: string;
		status: 'in' | 'waiting';
	};

	const roster: RosterRow[] = [
		{ name: 'Sarah', status: 'in' },
		{ name: 'Eli', status: 'in' },
		{ name: 'Maya', status: 'waiting' },
		{ name: 'Jonas', status: 'in' },
		{ name: 'Priya', status: 'waiting' }
	];
</script>

<section
	id="saved-class"
	class="relative overflow-hidden bg-surface-container py-16 md:py-24"
	aria-labelledby="saved-class-headline"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background:
			radial-gradient(ellipse 40% 50% at 12% 20%, var(--color-secondary-container) 0%, transparent 60%),
			radial-gradient(ellipse 35% 45% at 90% 80%, var(--color-primary-fixed) 0%, transparent 65%);
			opacity: 0.4;"
		aria-hidden="true"
	></div>

	<div
		class="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
		use:reveal
	>
		<div class="max-w-xl">
			<p class="eyebrow">In the app · Your class</p>
			<h2
				id="saved-class-headline"
				class="font-serif text-display-md tracking-tight md:text-display-lg"
			>
				Type the names once. Keep the class.
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
				Save a classroom in Group Play and load it every time you host. Students join with
				the four-letter game code and pick their own name. No student accounts. No retyping
				the roll next period.
			</p>

			<ol class="mt-8 space-y-4" aria-label="How to save a classroom">
				{#each steps as step, i (step.title)}
					{@const Icon = step.icon}
					<li class="flex items-start gap-3">
						<span
							class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary"
							aria-hidden="true"
						>
							<Icon class="h-4 w-4" stroke-width={1.75} />
						</span>
						<div>
							<p class="font-semibold text-on-surface">
								<span class="sr-only">Step {i + 1}. </span>{step.title}
							</p>
							<p class="text-on-surface-variant">{step.body}</p>
						</div>
					</li>
				{/each}
			</ol>

			<p
				class="mt-8 rounded-2xl bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface-variant"
			>
				<span class="font-semibold text-on-surface"
					>Free to try, built for a full class.</span
				>
				Every teacher can save one class of up to 6 students, free.
				<a
					href="/premium"
					class="font-semibold text-tertiary underline-offset-2 hover:underline"
					>Premium</a
				>
				unlocks up to 10 classes and 30 seats each. Students always join free.
			</p>

			<div class="mt-10 flex flex-col items-start gap-4">
				<StoreButtons />
				<Button href="#class-play" variant="outlined">Back to Class Play</Button>
			</div>
		</div>

		<div class="relative mx-auto w-full max-w-md lg:max-w-none">
			<div
				class="relative overflow-hidden rounded-4xl bg-surface-container-lowest p-6 shadow-floating md:p-8"
				data-placeholder
				aria-hidden="true"
			>
				<div class="flex items-center justify-between gap-3">
					<div>
						<p class="text-label-md uppercase text-on-surface-variant">Saved class</p>
						<p class="mt-1 font-serif text-headline-md text-on-surface">
							3rd Hour Seminary
						</p>
					</div>
					<span
						class="rounded-full bg-secondary-container px-3 py-1 text-label-md text-secondary"
					>
						5 seats
					</span>
				</div>

				<ol class="mt-6 space-y-2">
					{#each roster as row (row.name)}
						<li
							class="flex items-center gap-3 rounded-2xl px-3 py-2.5 {row.status ===
							'in'
								? 'bg-success-light'
								: 'bg-surface-container-low'}"
						>
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest font-serif text-headline-sm text-on-surface"
							>
								{row.name.slice(0, 1)}
							</span>
							<span class="flex-1 text-body-lg text-on-surface">{row.name}</span>
							{#if row.status === 'in'}
								<span
									class="inline-flex items-center gap-1 text-label-sm font-medium text-success"
								>
									<CircleCheck class="h-3.5 w-3.5" stroke-width={2} />
									In
								</span>
							{:else}
								<span class="text-label-sm text-on-surface-variant">Waiting</span>
							{/if}
						</li>
					{/each}
				</ol>

				<p class="mt-5 text-body-sm text-on-surface-variant">
					They pick their name. The seat stays theirs next time.
				</p>
			</div>
		</div>
	</div>
</section>
