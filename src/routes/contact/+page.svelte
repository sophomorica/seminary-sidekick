<script lang="ts">
	import { CONTACT_EMAIL } from '$lib/config/site';
</script>

<svelte:head>
	<title>Contact — Seminary Sidekick</title>
	<meta name="description" content="Get in touch with Seminary Sidekick." />
</svelte:head>

<section class="section mx-auto max-w-3xl px-4 md:px-8">
	<p class="eyebrow">Contact</p>
	<h1 class="font-serif text-display-md md:text-display-lg">Say hello.</h1>
	<p class="mt-4 text-body-lg text-on-surface-variant">
		Questions, feedback, ideas, or interest in using Seminary Sidekick in your class — email us
		directly.
	</p>
	<p class="mt-8">
		<a
			href={`mailto:${CONTACT_EMAIL}`}
			class="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition-colors hover:bg-primary-container"
		>
			{CONTACT_EMAIL}
		</a>
	</p>
</section>
