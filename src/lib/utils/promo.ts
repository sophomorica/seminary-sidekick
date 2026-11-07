/**
 * Promo-strip tags for outbound links.
 *
 * `utm_source` is this site. `utm_medium` is the placement. `utm_campaign`
 * names the effort. `utm_content` is the destination when a link has one.
 *
 * Google Play Install Referrer reads the tags from the `referrer` param, so
 * Play links encode them there. Apple drops `utm_*`. `ct` carries the placement.
 */

export const PROMO_SOURCE = 'sidekick';

/** Campaign for App Store and Google Play clicks. */
export const STORE_CAMPAIGN = 'get-the-app';

export type PromoStore = 'ios' | 'android';

export type PromoLink = {
	href: string;
	medium: string;
	campaign: string;
	content?: string;
	store?: PromoStore;
};

export function withPromo({ href, medium, campaign, content, store }: PromoLink): string {
	const tags = new URLSearchParams({
		utm_source: PROMO_SOURCE,
		utm_medium: medium,
		utm_campaign: campaign
	});
	if (content) tags.set('utm_content', content);

	const url = new URL(href);

	if (store === 'android') {
		url.searchParams.set('referrer', tags.toString());
		return url.toString();
	}

	for (const [key, value] of tags) {
		url.searchParams.set(key, value);
	}

	if (store === 'ios') {
		// Apple drops utm_* before the install is attributed. `ct` is the
		// campaign token App Store Connect keeps, so it carries the placement.
		// TODO: add `pt` once an Apple provider token exists in this repo.
		url.searchParams.set('ct', medium);
	}

	return preserveHostOnlyPath(href, url);
}

/** `new URL('https://example.com')` inserts a slash the input did not have. */
function preserveHostOnlyPath(href: string, url: URL): string {
	const serialized = url.toString();
	const hostStart = href.indexOf('://');
	if (hostStart === -1) return serialized;
	const pathStarted = href.indexOf('/', hostStart + 3) !== -1;
	if (!pathStarted && url.pathname === '/') return serialized.replace('/?', '?');
	return serialized;
}
