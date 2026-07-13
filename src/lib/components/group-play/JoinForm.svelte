<script lang="ts">
	import { isValidRoomCode, normalizeRoomCode, ROOM_CODE_LENGTH } from '$lib/services/groupPlay';

	type Props = {
		initialCode?: string;
		busy?: boolean;
		error?: string;
		onjoin: (code: string, nickname: string) => void | Promise<void>;
	};

	let { initialCode = '', busy = false, error = '', onjoin }: Props = $props();
	let code = $derived(normalizeRoomCode(initialCode));
	let nickname = $state('');
	let localError = $state('');

	const codeIsLocked = $derived(isValidRoomCode(initialCode));

	function handleCodeInput(event: Event) {
		code = normalizeRoomCode((event.currentTarget as HTMLInputElement).value);
		localError = '';
	}

	function handleNicknameInput() {
		localError = '';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const trimmedNickname = nickname.trim();

		if (!isValidRoomCode(code)) {
			localError = 'Enter the 4-character code from your teacher.';
			return;
		}
		if (trimmedNickname.length < 2 || trimmedNickname.length > 14) {
			localError = 'Choose a nickname between 2 and 14 characters.';
			return;
		}

		localError = '';
		await onjoin(code, trimmedNickname);
	}
</script>

<form
	class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-editorial md:p-8"
	onsubmit={handleSubmit}
>
	<div>
		<label for="room-code" class="text-label-lg text-on-surface">Class code</label>
		<input
			id="room-code"
			name="room-code"
			type="text"
			value={code}
			oninput={handleCodeInput}
			disabled={codeIsLocked || busy}
			autocomplete="one-time-code"
			autocapitalize="characters"
			inputmode="text"
			maxlength={ROOM_CODE_LENGTH}
			placeholder="ABCD"
			class="focus-ring mt-2 min-h-14 w-full rounded-2xl bg-surface-container-low px-5 font-sans text-2xl font-semibold tracking-[0.3em] text-on-surface uppercase placeholder:text-on-surface-variant/50 disabled:cursor-not-allowed disabled:opacity-70"
			aria-describedby="code-help"
		/>
		<p id="code-help" class="mt-2 text-body-sm text-on-surface-variant">
			Use the code shown on your teacher's screen.
		</p>
	</div>

	<div class="mt-6">
		<label for="nickname" class="text-label-lg text-on-surface">Nickname</label>
		<input
			id="nickname"
			name="nickname"
			type="text"
			bind:value={nickname}
			oninput={handleNicknameInput}
			disabled={busy}
			autocomplete="nickname"
			minlength="2"
			maxlength="14"
			placeholder="What should we call you?"
			class="focus-ring mt-2 min-h-14 w-full rounded-2xl bg-surface-container-low px-5 text-body-lg text-on-surface placeholder:text-on-surface-variant/60 disabled:cursor-not-allowed disabled:opacity-70"
		/>
	</div>

	<p class="mt-4 min-h-5 text-body-md text-error" aria-live="polite">
		{localError || error}
	</p>

	<button
		type="submit"
		disabled={busy}
		class="focus-ring mt-3 min-h-12 w-full rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
	>
		{busy ? 'Joining…' : 'Join class'}
	</button>
</form>
