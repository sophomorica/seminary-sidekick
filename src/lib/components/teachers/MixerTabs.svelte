<!--
  Mix / Today / This week — link tabs so a teacher can share a view.
  Styled like the site pill tabs. No Saved tab (no accounts).
-->
<script lang="ts">
	import { MIXER_VIEWS, type MixerView } from '$lib/teachers/mixer';
	import { cn } from '$lib/utils';

	let { view }: { view: MixerView } = $props();
</script>

<nav
	class="inline-flex h-11 flex-wrap items-center rounded-full bg-surface-container p-[3px]"
	aria-label="Mixer views"
>
	{#each MIXER_VIEWS as item (item.id)}
		<a
			href={item.href}
			aria-current={view === item.id ? 'page' : undefined}
			class={cn(
				'inline-flex h-10 min-w-11 items-center justify-center rounded-full px-5 text-label-lg transition-colors duration-150 ease-out-soft',
				'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none',
				view === item.id
					? 'bg-surface-container-lowest text-on-surface shadow-editorial'
					: 'text-on-surface/60 hover:text-on-surface'
			)}
		>
			{item.label}
		</a>
	{/each}
</nav>
