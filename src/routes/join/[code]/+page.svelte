<script lang="ts">
	import JoinShell from '$lib/components/group-play/JoinShell.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<JoinShell initialCode={data.code} />
