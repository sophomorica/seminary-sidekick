<!--
  WaitlistForm — Class Play teacher waitlist.

  Reused on the homepage <ClassPlay /> section and embedded in
  /for-teachers. Posts to a SvelteKit form action — `?/joinWaitlist`
  on the route the form lives on. Each route delegates to the shared
  helper at `$lib/server/waitlist.ts`.

  Progressive enhancement via `use:enhance` — works without JS, gets
  a smooth no-reload submission flow with JS on.

  States:
    idle      → email field + Join the waitlist button.
    submitting → button shows "Joining…", input disabled.
    success   → field collapses into a soft confirmation card.
    error     → input remains, friendly error message under it.

  Accessibility:
    - <label> wraps the input via htmlFor so screen readers always have
      a name, even if the visible label is collapsed by `label="..."`.
    - Status messages live in an aria-live="polite" region so SRs
      announce success/failure without stealing focus.
    - Button has an accessible name even while submitting.
-->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { CheckCircle2, Send } from 'lucide-svelte';

	type Placement = 'homepage' | 'for-teachers' | 'apps';

	let {
		placement,
		label = 'Teachers — get notified when Class Play launches'
	}: {
		placement: Placement;
		label?: string;
	} = $props();

	// Stable id per instance so multiple forms on one page each have a
	// unique input id. The placement is unique per page in practice; a
	// random suffix guards against accidental duplicates on the same page.
	const fieldId = `waitlist-email-${placement}-${Math.random().toString(36).slice(2, 8)}`;

	let email = $state('');
	let status: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');
</script>

<form
	method="POST"
	action="?/joinWaitlist"
	class="w-full max-w-md"
	use:enhance={() => {
		status = 'submitting';
		errorMessage = '';
		return async ({ result }) => {
			// Apply the SvelteKit action result first so server errors etc.
			// flow through normal redirect/error handling.
			await applyAction(result);
			if (result.type === 'success' && result.data?.ok) {
				status = 'success';
				email = '';
			} else if (result.type === 'failure') {
				status = 'error';
				errorMessage =
					(result.data?.error as string | undefined) ??
					'Something went wrong. Please try again.';
			} else if (result.type === 'error') {
				status = 'error';
				errorMessage = 'Something went wrong. Please try again.';
			}
		};
	}}
>
	<input type="hidden" name="placement" value={placement} />

	{#if status === 'success'}
		<div
			class="flex items-start gap-3 rounded-2xl bg-success-light p-4 text-on-surface"
			role="status"
			aria-live="polite"
		>
			<span
				class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
				aria-hidden="true"
			>
				<CheckCircle2 class="h-5 w-5" />
			</span>
			<div>
				<p class="font-serif text-headline-sm">You're on the list.</p>
				<p class="mt-1 text-body-md text-on-surface-variant">
					We'll email you the moment Class Play is ready for your classroom.
				</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			<Label for={fieldId} class="sr-only">{label}</Label>
			<div
				class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:bg-surface-container-lowest sm:p-1.5 sm:shadow-editorial"
			>
				<Input
					id={fieldId}
					name="email"
					type="email"
					required
					placeholder="teacher@example.com"
					autocomplete="email"
					bind:value={email}
					disabled={status === 'submitting'}
					aria-label={label}
					class="sm:border-transparent sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0 sm:focus-visible:border-transparent"
				/>
				<Button
					type="submit"
					variant="primary"
					disabled={status === 'submitting'}
					aria-label="Join the Class Play waitlist"
				>
					<Send aria-hidden="true" />
					{status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
				</Button>
			</div>

			<p
				class="min-h-[1.25rem] text-body-sm {status === 'error'
					? 'text-error'
					: 'text-on-surface-variant'}"
				aria-live="polite"
			>
				{#if status === 'error'}
					{errorMessage}
				{:else}
					No spam. One email when it launches.
				{/if}
			</p>
		</div>
	{/if}
</form>
