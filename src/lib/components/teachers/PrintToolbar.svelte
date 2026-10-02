<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Printer } from 'lucide-svelte';

	let {
		backHref,
		backLabel
	}: {
		backHref: string;
		backLabel: string;
	} = $props();

	function printSheet() {
		window.print();
	}
</script>

<div
	class="print-toolbar print:hidden border-b border-outline-variant/40 bg-surface-container-lowest px-4 py-4 md:px-8"
>
	<div class="mx-auto flex max-w-[8.5in] flex-wrap items-center justify-between gap-3">
		<Button href={backHref} variant="ghost" size="sm">
			<ArrowLeft aria-hidden="true" />
			{backLabel}
		</Button>
		<Button variant="primary" size="sm" onclick={printSheet}>
			<Printer aria-hidden="true" />
			Print / Save as PDF
		</Button>
	</div>
</div>
