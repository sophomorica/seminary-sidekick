<script lang="ts">
	import StoreButtons from '$lib/components/brand/StoreButtons.svelte';
</script>

<!--
  Conversion nudge after a Class Play session ends. Shared by quiz +
  scripture-builder results so both modes pitch the same App Store CTA.
-->
<aside class="mt-10 border-t border-outline-variant/40 pt-8 text-center" aria-label="Get the app">
	<p class="font-serif text-headline-sm text-on-surface">Liked Class Play?</p>
	<p class="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
		Get Seminary Sidekick and keep practicing anytime — not just when class is in session.
	</p>
	<div class="mt-6 flex justify-center">
		<StoreButtons size="default" showComingSoon />
	</div>
</aside>
