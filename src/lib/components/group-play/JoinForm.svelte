<script lang="ts">
	import {
		isValidRoomCode,
		normalizeRoomCode,
		ROOM_CODE_LENGTH,
		type RoomJoinInfo,
		type RoomJoinSeat
	} from '$lib/services/groupPlay';

	type Props = {
		initialCode?: string;
		busy?: boolean;
		error?: string;
		/** When set (roster room), the form shows the name picker instead of a nickname field. */
		joinInfo?: RoomJoinInfo | null;
		/** Fired as soon as a complete room code is entered, so the shell can peek the roster. */
		oncodecomplete?: (code: string) => void;
		onjoin: (code: string, nickname: string) => void | Promise<void>;
		onseatjoin: (code: string, seat: RoomJoinSeat, claimCode: string) => void | Promise<void>;
		onreset?: () => void;
	};

	let {
		initialCode = '',
		busy = false,
		error = '',
		joinInfo = null,
		oncodecomplete,
		onjoin,
		onseatjoin,
		onreset
	}: Props = $props();
	let code = $derived(normalizeRoomCode(initialCode));
	let nickname = $state('');
	let claimCode = $state('');
	let selectedSeatId = $state('');
	let localError = $state('');

	const codeIsLocked = $derived(isValidRoomCode(initialCode));
	const showSeatPicker = $derived(joinInfo?.hasClass === true);
	const selectedSeat = $derived(
		joinInfo?.seats.find((seat) => seat.id === selectedSeatId) ?? null
	);

	function handleCodeInput(event: Event) {
		code = normalizeRoomCode((event.currentTarget as HTMLInputElement).value);
		localError = '';
		if (isValidRoomCode(code)) oncodecomplete?.(code);
	}

	function handleFieldInput() {
		localError = '';
	}

	function selectSeat(seat: RoomJoinSeat) {
		selectedSeatId = seat.id;
		localError = '';
	}

	function handleReset() {
		selectedSeatId = '';
		claimCode = '';
		localError = '';
		onreset?.();
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!isValidRoomCode(code)) {
			localError = 'Enter the 4-character code from your teacher.';
			return;
		}

		if (showSeatPicker) {
			const seat = selectedSeat;
			if (!seat) {
				localError = 'Pick your name from the class list.';
				return;
			}
			if (joinInfo?.requireClaimCodes && claimCode.trim().length === 0) {
				localError = 'Enter your claim code — your teacher has it.';
				return;
			}
			localError = '';
			await onseatjoin(code, seat, claimCode.trim());
			return;
		}

		const trimmedNickname = nickname.trim();
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
		<label for="room-code" class="text-label-lg text-on-surface">Game code</label>
		<input
			id="room-code"
			name="room-code"
			type="text"
			value={code}
			oninput={handleCodeInput}
			disabled={codeIsLocked || showSeatPicker || busy}
			autocomplete="one-time-code"
			autocapitalize="characters"
			inputmode="text"
			maxlength={ROOM_CODE_LENGTH}
			placeholder="ABCD"
			class="focus-ring mt-2 min-h-14 w-full rounded-2xl bg-surface-container-low px-5 font-sans text-2xl font-semibold tracking-[0.3em] text-on-surface uppercase placeholder:text-on-surface-variant/50 disabled:cursor-not-allowed disabled:opacity-70"
			aria-describedby="code-help"
		/>
		<p id="code-help" class="mt-2 text-body-sm text-on-surface-variant">
			Use the 4-letter code shown on your teacher's screen.
		</p>
	</div>

	{#if showSeatPicker && joinInfo}
		<fieldset class="mt-6">
			<legend class="text-label-lg text-on-surface">
				Pick your name{joinInfo.className ? ` — ${joinInfo.className}` : ''}
			</legend>
			<div class="mt-2 flex flex-col gap-2" role="radiogroup" aria-label="Class list">
				{#each joinInfo.seats as seat (seat.id)}
					<button
						type="button"
						role="radio"
						aria-checked={selectedSeatId === seat.id}
						onclick={() => selectSeat(seat)}
						disabled={busy}
						class="focus-ring flex min-h-12 w-full items-center justify-between rounded-2xl px-5 py-3 text-left text-body-lg transition-colors disabled:cursor-not-allowed disabled:opacity-70 {selectedSeatId ===
						seat.id
							? 'bg-primary text-on-primary'
							: 'bg-surface-container-low text-on-surface hover:bg-surface-container'}"
					>
						<span>{seat.displayName}</span>
						{#if selectedSeatId === seat.id}
							<span class="text-label-md">Selected</span>
						{:else if seat.isClaimed}
							<span class="text-label-md opacity-70">Claimed</span>
						{/if}
					</button>
				{/each}
			</div>
			<p class="mt-2 text-body-sm text-on-surface-variant">
				Already claimed your name on this device before? Just pick it again.
			</p>
		</fieldset>

		{#if joinInfo.requireClaimCodes}
			<div class="mt-6">
				<label for="claim-code" class="text-label-lg text-on-surface">Your claim code</label
				>
				<input
					id="claim-code"
					name="claim-code"
					type="text"
					bind:value={claimCode}
					oninput={handleFieldInput}
					disabled={busy}
					autocomplete="off"
					autocapitalize="characters"
					maxlength="8"
					placeholder="From your teacher"
					class="focus-ring mt-2 min-h-14 w-full rounded-2xl bg-surface-container-low px-5 font-sans text-xl font-semibold tracking-[0.2em] text-on-surface uppercase placeholder:text-body-lg placeholder:font-normal placeholder:tracking-normal placeholder:text-on-surface-variant/60 disabled:cursor-not-allowed disabled:opacity-70"
					aria-describedby="claim-code-help"
				/>
				<p id="claim-code-help" class="mt-2 text-body-sm text-on-surface-variant">
					Your teacher gave each student a personal code — it proves this name is yours.
				</p>
			</div>
		{/if}
	{:else}
		<div class="mt-6">
			<label for="nickname" class="text-label-lg text-on-surface">Nickname</label>
			<input
				id="nickname"
				name="nickname"
				type="text"
				bind:value={nickname}
				oninput={handleFieldInput}
				disabled={busy}
				autocomplete="nickname"
				minlength="2"
				maxlength="14"
				placeholder="What should we call you?"
				class="focus-ring mt-2 min-h-14 w-full rounded-2xl bg-surface-container-low px-5 text-body-lg text-on-surface placeholder:text-on-surface-variant/60 disabled:cursor-not-allowed disabled:opacity-70"
			/>
		</div>
	{/if}

	<p class="mt-4 min-h-5 text-body-md text-error" aria-live="polite">
		{localError || error}
	</p>

	<button
		type="submit"
		disabled={busy}
		class="focus-ring mt-3 min-h-12 w-full rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
	>
		{#if busy}
			Joining…
		{:else if showSeatPicker}
			Join as {selectedSeat?.displayName ?? '…'}
		{:else}
			Join game
		{/if}
	</button>

	{#if showSeatPicker && !codeIsLocked}
		<button
			type="button"
			onclick={handleReset}
			disabled={busy}
			class="focus-ring mt-3 min-h-10 w-full rounded-full px-6 py-2 text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-70"
		>
			Use a different code
		</button>
	{/if}
</form>
