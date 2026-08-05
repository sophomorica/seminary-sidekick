/**
 * Shared Class Play teacher-waitlist helper.
 *
 * Called from SvelteKit form actions on every page that hosts a
 * <WaitlistForm />. Centralised so the validation, the provider call,
 * and the log-only fallback all live in one place.
 *
 * Provider: Formspree (no-code, free tier). The endpoint URL is held in
 * `src/lib/config/site.ts` (`CLASS_PLAY_WAITLIST_ENDPOINT`). Until the
 * owner pastes a real Formspree form id, this module runs in "log-only"
 * mode — submissions are validated, written to the server console, and
 * reported back to the form as a success (so the UI keeps working even
 * before the endpoint is configured).
 */

import { CLASS_PLAY_WAITLIST_ENDPOINT } from '$lib/config/site';

/** Strict-enough email regex for first-pass validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistResult = { ok: true; mode?: 'logged-only' } | { ok: false; error: string };

/**
 * Submit a teacher email to the Class Play waitlist.
 *
 * @param email     The teacher's email address. Validated server-side.
 * @param placement Where on the site the form was submitted from.
 *                  Used later to differentiate signup sources.
 */
export async function joinClassPlayWaitlist(
	email: string,
	placement: string
): Promise<WaitlistResult> {
	if (!email || !EMAIL_RE.test(email)) {
		return { ok: false, error: 'Please enter a valid email address.' };
	}

	// If endpoint isn't configured yet, log-only mode keeps the UI working
	// end-to-end without a real provider call.
	if (!CLASS_PLAY_WAITLIST_ENDPOINT || CLASS_PLAY_WAITLIST_ENDPOINT.includes('YOUR_ENDPOINT')) {
		console.log('[waitlist] would submit', { email, placement });
		return { ok: true, mode: 'logged-only' };
	}

	try {
		const res = await fetch(CLASS_PLAY_WAITLIST_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ email, placement, source: 'class-play-waitlist' })
		});
		if (!res.ok) throw new Error(`endpoint returned ${res.status}`);
		return { ok: true };
	} catch (err) {
		console.error('[waitlist] submission failed', err);
		return { ok: false, error: 'Something went wrong. Please try again.' };
	}
}
