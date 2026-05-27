/**
 * Homepage form actions.
 *
 * Today: only the Class Play teacher waitlist (TASK Class Play feature).
 * Submission is delegated to the shared helper at
 * `$lib/server/waitlist.ts` so the same logic is reused on
 * `/for-teachers` (and any future page that hosts a <WaitlistForm />).
 */

import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { joinClassPlayWaitlist } from '$lib/server/waitlist';

export const actions: Actions = {
	joinWaitlist: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const placement = String(data.get('placement') ?? 'homepage');

		const result = await joinClassPlayWaitlist(email, placement);
		if (!result.ok) {
			return fail(400, { ok: false, error: result.error, email });
		}
		return { ok: true };
	}
};
