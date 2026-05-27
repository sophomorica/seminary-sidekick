<!--
  TEMPORARY token-showcase page.
  Verifies every Tailwind token from THEME.md renders correctly.
  Will be replaced in Phase C (TASK-C-100) with the real homepage.
-->
<script lang="ts">
	const brandColors = [
		{ name: 'primary', hex: '#94492C', text: 'on-primary' },
		{ name: 'primary-container', hex: '#D9805F', text: 'on-primary-container' },
		{ name: 'primary-fixed', hex: '#FFDBCF', text: 'on-surface' },
		{ name: 'primary-fixed-dim', hex: '#FFB59B', text: 'on-surface' },
		{ name: 'secondary', hex: '#3B665F', text: 'on-secondary' },
		{ name: 'secondary-container', hex: '#BEECE2', text: 'on-surface' },
		{ name: 'tertiary', hex: '#735C00', text: 'on-tertiary' },
		{ name: 'tertiary-container', hex: '#CCA72F', text: 'on-surface' },
		{ name: 'accent', hex: '#5B8ABF', text: 'on-primary' }
	];

	const surfaces = [
		{ name: 'surface', hex: '#FFF8F6' },
		{ name: 'surface-container-lowest', hex: '#FFFFFF' },
		{ name: 'surface-container-low', hex: '#FFF1EC' },
		{ name: 'surface-container', hex: '#FBEBE6' },
		{ name: 'surface-container-high', hex: '#F5E5E0' },
		{ name: 'surface-container-highest', hex: '#EFDFDA' },
		{ name: 'surface-dim', hex: '#E6D7D2' }
	];

	const feedbackColors = [
		{ name: 'success', hex: '#66BB6A' },
		{ name: 'success-light', hex: '#E8F5E9' },
		{ name: 'warning', hex: '#FFA726' },
		{ name: 'error', hex: '#BA1A1A' },
		{ name: 'error-container', hex: '#FFDAD6' }
	];

	const bookColors = [
		{ name: 'book-ot', label: 'Old Testament', hex: '#8D6E63' },
		{ name: 'book-nt', label: 'New Testament', hex: '#5C6BC0' },
		{ name: 'book-bom', label: 'Book of Mormon', hex: '#26A69A' },
		{ name: 'book-dc', label: 'D&C', hex: '#AB47BC' }
	];

	const masteryColors = [
		{ name: 'mastery-new', label: 'New', hex: '#9E9E9E' },
		{ name: 'mastery-learning', label: 'Learning', hex: '#FF8A65' },
		{ name: 'mastery-familiar', label: 'Familiar', hex: '#FFD54F' },
		{ name: 'mastery-memorized', label: 'Memorized', hex: '#81C784' },
		{ name: 'mastery-mastered', label: 'Mastered', hex: '#64B5F6' },
		{ name: 'mastery-eternal', label: 'Eternal', hex: '#CCA72F' }
	];
</script>

<svelte:head>
	<title>Design Tokens — Seminary Sidekick (TASK-002 verification)</title>
	<meta
		name="description"
		content="Temporary token-showcase page verifying THEME.md tokens render correctly."
	/>
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
	<header class="mb-16">
		<p class="eyebrow">TASK-002 · verification</p>
		<h1 class="font-serif text-hero-lg">Sacred Editorial — token check.</h1>
		<p class="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
			This page is a temporary design-system reference. It exercises every Tailwind utility
			minted from <code>THEME.md</code>. If it looks right, the foundation is solid. Phase C
			replaces this with the real homepage.
		</p>
	</header>

	<!-- Typography -->
	<section class="mb-20">
		<p class="eyebrow">Typography</p>
		<h2 class="mb-6 font-serif text-display-md">Merriweather + Inter, in scale.</h2>

		<div class="card space-y-4">
			<p class="font-serif text-hero-xl">Hero XL — 72px</p>
			<p class="font-serif text-hero-lg">Hero LG — 56px</p>
			<p class="font-serif text-display-lg">Display LG — 36px</p>
			<p class="font-serif text-display-md">Display MD — 30px</p>
			<p class="font-serif text-display-sm">Display SM — 24px</p>
			<p class="font-serif text-headline-lg">Headline LG — 22px</p>
			<p class="font-serif text-headline-md">Headline MD — 20px</p>
			<p class="font-serif text-headline-sm">Headline SM — 18px</p>
			<p class="text-title-lg">Title LG — Inter 16px / 600</p>
			<p class="text-body-lg">
				Body LG — Inter 16px / 400. For with God nothing shall be impossible.
			</p>
			<p class="text-body-md text-on-surface-variant">Body MD — muted, 14px.</p>
			<p class="text-body-sm text-on-surface-variant">Body SM — 12px caption.</p>
			<p class="text-label-md text-on-surface-variant uppercase">
				Label MD — uppercase eyebrow
			</p>
		</div>
	</section>

	<!-- Brand colors -->
	<section class="mb-20">
		<p class="eyebrow">Brand colors</p>
		<h2 class="mb-6 font-serif text-display-md">Primary, secondary, tertiary, accent.</h2>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
			{#each brandColors as { name, hex, text } (name)}
				<div
					class="flex h-32 flex-col justify-end rounded-4xl p-4 shadow-editorial"
					style="background-color: var(--color-{name}); color: var(--color-{text})"
				>
					<p class="text-label-md uppercase">{name}</p>
					<p class="text-body-sm opacity-80">{hex}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Surface hierarchy -->
	<section class="mb-20">
		<p class="eyebrow">Surface hierarchy</p>
		<h2 class="mb-2 font-serif text-display-md">Stacked sheets of fine, translucent paper.</h2>
		<p class="mb-6 max-w-2xl text-body-lg text-on-surface-variant">
			Separation by tone, never by border. Each step lifts perceived elevation without drawing
			a line.
		</p>
		<div class="grid grid-cols-1 gap-2 md:grid-cols-7">
			{#each surfaces as { name, hex } (name)}
				<div
					class="flex h-32 flex-col justify-end rounded-2xl p-3"
					style="background-color: var(--color-{name})"
				>
					<p class="text-label-sm uppercase text-on-surface">
						{name.replace('surface-', '')}
					</p>
					<p class="text-body-sm text-on-surface-variant">{hex}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Premium gold (sacred moments) -->
	<section class="mb-20">
		<p class="eyebrow">Premium · Sacred moments</p>
		<h2 class="mb-6 font-serif text-display-md">Used sparingly.</h2>
		<div
			class="rounded-5xl p-12 text-center text-on-primary shadow-floating"
			style="background: linear-gradient(135deg, var(--color-premium-gradient-from), var(--color-premium-gradient-to))"
		>
			<p class="text-label-md mb-3 uppercase">Seminary Sidekick AI</p>
			<p class="font-serif text-display-lg">Your study companion.</p>
		</div>
	</section>

	<!-- Feedback -->
	<section class="mb-20">
		<p class="eyebrow">Feedback</p>
		<h2 class="mb-6 font-serif text-display-md">Success, warning, error.</h2>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each feedbackColors as { name, hex } (name)}
				<div
					class="rounded-4xl p-4 shadow-editorial"
					style="background-color: var(--color-{name})"
				>
					<p class="text-label-md uppercase">{name}</p>
					<p class="text-body-sm opacity-80">{hex}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Book + mastery -->
	<section class="mb-20">
		<p class="eyebrow">Books & mastery</p>
		<h2 class="mb-6 font-serif text-display-md">Categorical accents.</h2>

		<div class="mb-8">
			<p class="text-label-md mb-3 uppercase text-on-surface-variant">Books</p>
			<div class="flex flex-wrap gap-3">
				{#each bookColors as { name, label, hex } (name)}
					<div
						class="rounded-full px-4 py-2 text-on-primary"
						style="background-color: var(--color-{name})"
					>
						<span class="text-label-lg">{label}</span>
						<span class="ml-2 text-body-sm opacity-70">{hex}</span>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<p class="text-label-md mb-3 uppercase text-on-surface-variant">Mastery levels</p>
			<div class="flex flex-wrap gap-3">
				{#each masteryColors as { name, label, hex } (name)}
					<div
						class="rounded-full px-4 py-2"
						style="background-color: var(--color-{name}); color: var(--color-on-surface)"
					>
						<span class="text-label-lg">{label}</span>
						<span class="ml-2 text-body-sm opacity-70">{hex}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Shadows -->
	<section class="mb-20">
		<p class="eyebrow">Shadows</p>
		<h2 class="mb-6 font-serif text-display-md">Tinted, never pure black.</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="card">
				<p class="text-label-md mb-2 uppercase text-on-surface-variant">shadow-editorial</p>
				<p class="font-serif text-headline-md">Default card shadow.</p>
				<p class="mt-2 text-body-md text-on-surface-variant">
					Subtle lift — used for most cards.
				</p>
			</div>
			<div class="card shadow-floating">
				<p class="text-label-md mb-2 uppercase text-on-surface-variant">shadow-floating</p>
				<p class="font-serif text-headline-md">Big floating elements.</p>
				<p class="mt-2 text-body-md text-on-surface-variant">
					Hero phone mockups, premium teasers.
				</p>
			</div>
		</div>
	</section>

	<!-- Buttons (raw — real shadcn Buttons land in TASK-003) -->
	<section class="mb-20">
		<p class="eyebrow">Buttons · placeholder</p>
		<h2 class="mb-3 font-serif text-display-md">Real Button comes in TASK-003.</h2>
		<p class="mb-6 max-w-2xl text-body-md text-on-surface-variant">
			These are raw, unstyled shapes to verify the tokens. shadcn-svelte Button replaces them.
		</p>
		<div class="flex flex-wrap items-center gap-3">
			<button
				class="focus-ring rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition hover:bg-primary-container"
			>
				Primary
			</button>
			<button
				class="focus-ring rounded-full bg-secondary px-6 py-3 text-label-lg text-on-secondary transition hover:opacity-90"
			>
				Secondary
			</button>
			<button
				class="focus-ring rounded-full border border-outline-variant/40 bg-transparent px-6 py-3 text-label-lg text-primary transition hover:bg-surface-container-low"
			>
				Outlined
			</button>
			<button
				class="focus-ring rounded-full bg-transparent px-6 py-3 text-label-lg text-on-surface transition hover:bg-surface-container-low"
			>
				Ghost
			</button>
			<button
				class="focus-ring rounded-full bg-tertiary-container px-6 py-3 text-label-lg text-on-primary transition hover:opacity-90"
			>
				Sacred (tertiary)
			</button>
		</div>
	</section>

	<!-- Scripture -->
	<section class="mb-20">
		<p class="eyebrow">Scripture</p>
		<h2 class="mb-8 font-serif text-display-md">Blockquote pattern.</h2>
		<blockquote class="scripture">
			"For with God nothing shall be impossible."
			<footer>Luke 1:37 — New Testament</footer>
		</blockquote>
	</section>

	<!-- Motion -->
	<section class="mb-20">
		<p class="eyebrow">Motion</p>
		<h2 class="mb-2 font-serif text-display-md">Calm, warm, intentional.</h2>
		<p class="mb-6 max-w-2xl text-body-md text-on-surface-variant">
			Hover the left card for the standard card lift. The right card floats ambiently
			(disabled if your system prefers reduced motion).
		</p>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="card card-hover cursor-pointer">
				<p class="text-label-md mb-2 uppercase text-on-surface-variant">card-hover</p>
				<p class="font-serif text-headline-md">Hover me.</p>
				<p class="mt-2 text-body-md text-on-surface-variant">
					translateY(-4px) + shadow-floating, ease-out-soft 250ms.
				</p>
			</div>
			<div class="card animate-float">
				<p class="text-label-md mb-2 uppercase text-on-surface-variant">animate-float</p>
				<p class="font-serif text-headline-md">I float.</p>
				<p class="mt-2 text-body-md text-on-surface-variant">
					Hero phone mockup uses this. 8s loop, paused under reduced-motion.
				</p>
			</div>
		</div>
	</section>

	<footer class="border-t border-outline-variant/40 pt-8 text-body-sm text-on-surface-variant">
		<p>
			Generated for TASK-002 verification. Delete this page in TASK-C-100 when the real
			homepage ships.
		</p>
	</footer>
</main>
