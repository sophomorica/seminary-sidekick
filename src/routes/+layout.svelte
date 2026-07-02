<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import SkipLink from '$lib/components/layout/SkipLink.svelte';
	import AppNav from '$lib/components/layout/AppNav.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';

	let { children } = $props();

	/**
	 * Brand easing — mirrors `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`.
	 * svelte/transition expects an easing function `(t: number) => number`, so
	 * we evaluate the bezier numerically (Newton-Raphson on the x curve, then
	 * sample y). Used for the global page-transition fade so route changes
	 * feel like the rest of the brand's motion language.
	 */
	function easeOutSoft(t: number): number {
		const x1 = 0.22,
			y1 = 1,
			x2 = 0.36,
			y2 = 1;
		const cx = 3 * x1;
		const bx = 3 * (x2 - x1) - cx;
		const ax = 1 - cx - bx;
		const cy = 3 * y1;
		const by = 3 * (y2 - y1) - cy;
		const ay = 1 - cy - by;
		const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
		const sampleDX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
		let u = t;
		for (let i = 0; i < 6; i++) {
			const x = sampleX(u) - t;
			const dx = sampleDX(u);
			if (Math.abs(x) < 1e-5 || dx === 0) break;
			u -= x / dx;
		}
		return ((ay * u + by) * u + cy) * u;
	}

	// Reactively track the user's reduced-motion preference. When reduced,
	// we render children directly with no transition wrapper at all.
	let prefersReducedMotion = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mq.matches;
		const onChange = (e: MediaQueryListEvent) => {
			prefersReducedMotion = e.matches;
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" content="#F7F8FC" />
</svelte:head>

<SkipLink />
<AppNav />

<main id="main-content" class="min-h-[60vh]">
	{#if prefersReducedMotion}
		{@render children()}
	{:else}
		{#key page.url.pathname}
			<div in:fade={{ duration: 200, easing: easeOutSoft }}>
				{@render children()}
			</div>
		{/key}
	{/if}
</main>

<AppFooter />
