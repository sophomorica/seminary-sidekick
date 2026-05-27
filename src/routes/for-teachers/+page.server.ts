/**
 * /for-teachers form actions.
 *
 * Hosts the Class Play teacher waitlist for visitors who landed on the
 * dedicated teachers page. Delegates to the shared helper so behaviour
 * stays identical to the homepage form.
 */

import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { joinClassPlayWaitlist } from '$lib/server/waitlist';

export const actions: Actions = {
	joinWaitlist: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim();
		const placement = String(data.get('placement') ?? 'for-teachers');

		const result = await joinClassPlayWaitlist(email, placement);
		if (!result.ok) {
			return fail(400, { ok: false, error: result.error, email });
		}
		return { ok: true };
	}
};
