<!--
  ClassPlayTestingNotice — small honest status note for Class Play.

  Class Play shipped with the iOS launch and is in active testing with
  our first classrooms. Rather than stay silent while we iron out bugs,
  this notice says so plainly wherever Class Play is pitched (homepage
  <ClassPlay /> section and the /for-teachers #class-play section).

  Lightweight by design — an inline note, not a dismissible site-wide
  bar, so it never competes with the hero. Remove it (delete the two
  usages + this file) once Class Play graduates from testing.

  Styling per THEME.md: rounded-2xl note card on surface-container-lowest
  (reads cleanly on both surface-container and surface-container-low
  section backgrounds), lucide icon, no raw hex, no <style> block.
-->
<script lang="ts">
	import { Wrench } from 'lucide-svelte';
</script>

<p
	class="mt-6 flex items-start gap-3 rounded-2xl bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface-variant shadow-editorial"
>
	<span
		class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary"
		aria-hidden="true"
	>
		<Wrench class="h-3.5 w-3.5" stroke-width={1.75} />
	</span>
	<span>
		<span class="font-semibold text-on-surface">Class Play is live and in active testing</span>
		— we're ironing out bugs as our first classrooms use it. Thanks for your patience!
	</span>
</p>
