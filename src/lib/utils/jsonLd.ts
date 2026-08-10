/**
 * JSON-LD structured-data helpers (TASK-B-060).
 *
 * Each function returns a plain object that the <Seo> component
 * serializes inside a <script type="application/ld+json"> tag.
 *
 * Schemas follow schema.org. Keep them small — Google ignores most
 * of the long tail. Conservative beats clever for SEO payloads.
 *
 * Usage:
 *   import { softwareApplication, article } from '$lib/utils/jsonLd';
 *   <Seo jsonLd={[softwareApplication(), webSite()]} ... />
 */

import { SITE_NAME, SITE_URL, TAGLINE, DEFAULT_OG_IMAGE, CONTACT_EMAIL } from '$lib/config/site';
import { ANDROID_AVAILABLE, ANDROID_URL, IOS_AVAILABLE, IOS_URL } from '$lib/config/store';

/**
 * Generic JSON-LD payload shape. We stay loose with `unknown`
 * because schema.org is a giant graph and over-typing is more
 * pain than it's worth. The component just JSON.stringifies these.
 */
export type JsonLd = Record<string, unknown>;

/** Make a path absolute against SITE_URL. Pass-through if already absolute. */
function absolute(pathOrUrl: string): string {
	if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
	const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
	return `${SITE_URL}${path}`;
}

/** Live store platforms + download URLs, derived from `store.ts` flags. */
function liveStoreListing(): { operatingSystem?: string; downloadUrls: string[] } {
	const systems: string[] = [];
	const downloadUrls: string[] = [];
	if (IOS_AVAILABLE) {
		systems.push('iOS');
		downloadUrls.push(IOS_URL);
	}
	if (ANDROID_AVAILABLE) {
		systems.push('Android');
		downloadUrls.push(ANDROID_URL);
	}
	return {
		...(systems.length ? { operatingSystem: systems.join(', ') } : {}),
		downloadUrls
	};
}

/**
 * SoftwareApplication — for the home page and /apps/scripture-mastery.
 * Tells Google "this is an app" so it can render rich app cards.
 *
 * Offers are listed as free with optional premium upgrade; we don't
 * embed real prices here (those live in the stores and shift over time).
 */
export function softwareApplication(overrides: Partial<JsonLd> = {}): JsonLd {
	const { operatingSystem, downloadUrls } = liveStoreListing();
	const primaryUrl = downloadUrls[0];
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: SITE_NAME,
		description: TAGLINE,
		applicationCategory: 'EducationalApplication',
		...(operatingSystem ? { operatingSystem } : {}),
		url: SITE_URL,
		...(primaryUrl ? { downloadUrl: primaryUrl, installUrl: primaryUrl } : {}),
		// Extra store URLs when both platforms are live (schema.org allows multi-value).
		...(downloadUrls.length > 1 ? { sameAs: downloadUrls } : {}),
		image: absolute(DEFAULT_OG_IMAGE),
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		...overrides
	};
}

/**
 * Article — for blog posts in /news/[slug].
 */
export function article(input: {
	headline: string;
	description?: string;
	image?: string;
	datePublished: string | Date;
	dateModified?: string | Date;
	author?: string;
	url?: string;
}): JsonLd {
	const datePublished =
		input.datePublished instanceof Date
			? input.datePublished.toISOString()
			: input.datePublished;
	const dateModified =
		input.dateModified instanceof Date ? input.dateModified.toISOString() : input.dateModified;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: input.headline,
		...(input.description ? { description: input.description } : {}),
		...(input.image ? { image: absolute(input.image) } : {}),
		datePublished,
		...(dateModified ? { dateModified } : {}),
		author: {
			'@type': 'Person',
			name: input.author ?? SITE_NAME
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
			logo: {
				'@type': 'ImageObject',
				url: absolute(DEFAULT_OG_IMAGE)
			}
		},
		...(input.url ? { mainEntityOfPage: absolute(input.url) } : {})
	};
}

/**
 * Organization — site-wide identity. Safe to emit once in the
 * root layout once the retrofit pass lands.
 */
export function organization(overrides: Partial<JsonLd> = {}): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		logo: absolute(DEFAULT_OG_IMAGE),
		email: CONTACT_EMAIL,
		...overrides
	};
}

/**
 * WebSite — gives Google the canonical site name + a
 * SearchAction stub. The search action is harmless if we
 * never wire up a /search route (Google just won't show it).
 */
export function webSite(overrides: Partial<JsonLd> = {}): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: TAGLINE,
		...overrides
	};
}
