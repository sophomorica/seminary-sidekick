import { redirect } from '@sveltejs/kit';
import { platformForUserAgent, storeUrlForPlatform } from '$lib/utils/storeRedirect';
import type { PageServerLoad } from './$types';

// Depends on the request's User-Agent, so never prerender.
export const prerender = false;

/**
 * /update — target of the in-app "update available" banner.
 * iOS / Android get a server-side 302 to their store (works without JS);
 * everyone else gets a page with both store links.
 */
export const load: PageServerLoad = ({ request, setHeaders }) => {
	const target = storeUrlForPlatform(platformForUserAgent(request.headers.get('user-agent')));
	setHeaders({ 'cache-control': 'private, no-store', vary: 'User-Agent' });
	if (target) redirect(302, target);
	return {};
};
