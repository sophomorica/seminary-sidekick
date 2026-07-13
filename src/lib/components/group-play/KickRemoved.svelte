<script lang="ts">
	import { UserRoundX } from 'lucide-svelte';

	type Props = {
		unavailable?: boolean;
		onrejoin?: () => void;
	};

	let { unavailable = false, onrejoin }: Props = $props();
</script>

<section
	class="rounded-[2rem] bg-surface-container-lowest p-8 text-center shadow-editorial"
	aria-labelledby="removed-heading"
>
	<div
		class="mx-auto flex size-14 items-center justify-center rounded-full bg-error-light text-error"
		aria-hidden="true"
	>
		<UserRoundX class="size-7" />
	</div>
	<h1 id="removed-heading" class="mt-6 font-serif text-display-sm">
		{unavailable ? 'This session is no longer available' : 'You were removed'}
	</h1>
	<p class="mt-3 text-body-lg text-on-surface-variant">
		{unavailable
			? 'The room may have ended, or this browser is no longer part of it.'
			: 'Your teacher removed you from this Class Play room.'}
	</p>
	<button
		type="button"
		class="focus-ring mt-6 min-h-12 rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition-colors hover:bg-primary/90"
		onclick={() => onrejoin?.()}
	>
		Join another room
	</button>
</section>
