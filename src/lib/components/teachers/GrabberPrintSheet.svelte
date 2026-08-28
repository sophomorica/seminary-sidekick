<!--
  US Letter sheets for mixer grabbers. Reuses .printout-sheet / @page
  printout-letter from app.css. Original copy only.
-->
<script lang="ts">
	import type { Grabber } from '$lib/teachers/mixer';

	let { grabber }: { grabber: Grabber } = $props();

	const corners = [
		{ title: 'Talk it out', line: 'I learn by saying it out loud.' },
		{ title: 'Write it down', line: 'I learn with a pen in my hand.' },
		{ title: 'Try it', line: 'I learn by doing the thing once.' },
		{ title: 'Listen first', line: 'I learn by hearing it through.' }
	] as const;

	const beats = ['Grabber', 'Teach', 'Wrap', 'Invite'] as const;

	const partnerPrompts = [
		'My first name is',
		'Someone who helped me get here is',
		'One question I have about the Old Testament this year is'
	] as const;
</script>

{#if grabber.slug === 'name-tents'}
	<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
		<header class="mb-3 border-b-[3px] border-primary pb-2 print:mb-2">
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Name tents
			</p>
			<h1 class="font-serif text-display-sm text-primary">Fold on the dashed line</h1>
			<p class="mt-1 text-body-sm text-on-surface-variant">
				Cut the four cards. Name faces the room. Hope and “ask me about” face you.
			</p>
		</header>
		<ul class="grid grid-cols-2 gap-3 print:gap-2" aria-label="Name tents">
			{#each [1, 2, 3, 4] as tent (tent)}
				<li
					class="min-h-[4.6in] rounded-2xl border-2 border-dashed border-outline bg-surface-container-lowest px-4 py-3 print:min-h-[4.4in]"
				>
					<p
						class="text-label-sm font-semibold tracking-[0.12em] text-on-surface-variant uppercase"
					>
						Name · faces the room
					</p>
					<div class="mt-2 min-h-[1.4in] rounded-xl bg-surface-container-low px-3 py-4">
						<p class="font-serif text-headline-md text-on-surface-variant italic">
							Write a first name large
						</p>
					</div>
					<p
						class="my-2 text-center text-label-sm tracking-[0.2em] text-on-surface-variant uppercase"
					>
						— fold —
					</p>
					<p class="font-serif text-body-md">This year I hope</p>
					<div class="mt-1 h-10 rounded-lg bg-surface-container-low"></div>
					<p class="mt-3 font-serif text-body-md">Ask me about</p>
					<div class="mt-1 h-10 rounded-lg bg-surface-container-low"></div>
				</li>
			{/each}
		</ul>
	</article>
{:else if grabber.slug === 'corner-compass'}
	<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
		<header class="mb-3 border-b-[3px] border-primary pb-2">
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Corner compass
			</p>
			<h1 class="font-serif text-display-sm text-primary">Tape one sign in each corner</h1>
		</header>
		<ul class="grid grid-cols-2 gap-3" aria-label="Corner signs">
			{#each corners as corner (corner.title)}
				<li
					class="flex min-h-[4.4in] flex-col justify-center rounded-[2rem] bg-surface-container-low px-6 py-8 text-center"
				>
					<p class="text-label-md font-semibold tracking-[0.14em] text-primary uppercase">
						How I learn
					</p>
					<p class="mt-4 font-serif text-display-md text-on-surface">{corner.title}</p>
					<p class="mt-4 text-body-lg text-on-surface-variant">{corner.line}</p>
				</li>
			{/each}
		</ul>
	</article>
{:else if grabber.slug === 'partner-echo'}
	<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
		<header class="mb-3 border-b-[3px] border-primary pb-2">
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Partner echo
			</p>
			<h1 class="font-serif text-display-sm text-primary">
				Ninety seconds, then introduce them
			</h1>
			<p class="mt-1 text-body-sm text-on-surface-variant">
				Cut the cards. Swap the third line in a New Testament, Book of Mormon, or D&C year.
			</p>
		</header>
		<ul class="grid grid-cols-2 gap-2" aria-label="Partner echo prompts">
			{#each [1, 2, 3, 4, 5, 6, 7, 8] as card (card)}
				<li
					class="rounded-2xl border-2 border-dashed border-outline bg-surface-container-lowest px-4 py-3"
				>
					<p class="text-label-sm font-semibold tracking-[0.12em] text-primary uppercase">
						Partner echo
					</p>
					<ol class="mt-2 list-decimal space-y-1 pl-5 text-body-md">
						{#each partnerPrompts as prompt (prompt)}
							<li>{prompt}</li>
						{/each}
					</ol>
					<p class="mt-2 text-body-sm text-on-surface-variant">
						Introduce your partner. Do not introduce yourself.
					</p>
				</li>
			{/each}
		</ul>
	</article>
{:else if grabber.slug === 'welcome-seat'}
	<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
		<header class="mb-3 border-b-[3px] border-primary pb-2">
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Welcome seat
			</p>
			<h1 class="font-serif text-display-sm text-primary">Two lines for an empty chair</h1>
			<p class="mt-1 text-body-sm text-on-surface-variant">
				Teacher keeps the stack. Do not read these aloud today.
			</p>
		</header>
		<ul class="grid grid-cols-2 gap-2" aria-label="Welcome notes">
			{#each [1, 2, 3, 4, 5, 6, 7, 8] as card (card)}
				<li
					class="rounded-2xl border-2 border-dashed border-outline bg-surface-container-lowest px-4 py-3"
				>
					<p class="text-label-sm font-semibold tracking-[0.12em] text-primary uppercase">
						A seat is waiting
					</p>
					<p class="mt-2 font-serif text-body-md italic">
						For a classmate who is not in the room yet
					</p>
					<div class="mt-3 h-8 rounded-lg bg-surface-container-low"></div>
					<div class="mt-2 h-8 rounded-lg bg-surface-container-low"></div>
					<p class="mt-3 text-body-sm text-on-surface-variant">From</p>
					<div class="mt-1 h-7 rounded-lg bg-surface-container-low"></div>
				</li>
			{/each}
		</ul>
	</article>
{:else if grabber.slug === 'four-beats-pass'}
	<article class="printout-sheet mx-auto max-w-[8.5in] text-on-surface">
		<header class="mb-3 border-b-[3px] border-primary pb-2">
			<p
				class="text-label-sm font-semibold tracking-[0.14em] text-on-surface-variant uppercase"
			>
				Seminary Sidekick · Four beats pass
			</p>
			<h1 class="font-serif text-display-sm text-primary">One beat per student</h1>
			<p class="mt-1 text-body-sm text-on-surface-variant">
				Four beats. One morning. Cut the cards. Write one sentence each.
			</p>
		</header>
		<ul class="grid grid-cols-2 gap-3" aria-label="Four beat cards">
			{#each beats as beat (beat)}
				<li
					class="flex min-h-[4.2in] flex-col rounded-[2rem] bg-surface-container-low px-6 py-8"
				>
					<p class="text-label-md font-semibold tracking-[0.14em] text-primary uppercase">
						This year’s morning
					</p>
					<p class="mt-4 font-serif text-display-md">{beat}</p>
					<p class="mt-6 font-serif text-body-lg italic">This beat should feel like</p>
					<div class="mt-3 h-14 rounded-xl bg-surface-container-lowest"></div>
					<p class="mt-2 text-body-sm text-on-surface-variant">this year.</p>
				</li>
			{/each}
		</ul>
	</article>
{/if}
