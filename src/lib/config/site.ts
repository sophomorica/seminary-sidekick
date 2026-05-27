/**
 * Site-level metadata. Edit here, not in components.
 *
 * Used by: <Seo> component (TASK-B-060), AppNav, AppFooter, contact page,
 * and anywhere else the brand name/tagline/contact info appears.
 */

export const SITE_NAME = 'Seminary Sidekick';

export const TAGLINE = 'Master all 100 doctrinal mastery scriptures.';

/**
 * Suite kicker — appears above the hero headline.
 * Removable in Tier 1 if owner prefers single-app framing.
 */
export const SUITE_KICKER = 'The Seminary Sidekick Suite — App 1 of more to come.';

/**
 * Domain — used for canonical URLs, sitemap, OG image origins.
 * TODO: Update when the real domain is registered (see open questions
 * in NEW_SITE_PLAN.md).
 */
export const SITE_URL = 'https://seminarysidekick.com';

/**
 * Default OG image — 1200×630 PNG. Per-page overrides via <Seo>.
 */
export const DEFAULT_OG_IMAGE = '/og/default.png';

/**
 * Contact email. Currently a placeholder — verify with owner before launch.
 */
export const CONTACT_EMAIL = 'hello@seminarysidekick.com';

/**
 * Social links. Set to undefined to hide that icon in nav/footer.
 */
export const SOCIAL_LINKS = {
	twitter: undefined as string | undefined, // e.g. 'https://x.com/seminarysidekick'
	instagram: undefined as string | undefined,
	facebook: undefined as string | undefined,
	youtube: undefined as string | undefined
} as const;

/**
 * Year baked into the footer copyright. Update annually or compute at build time.
 */
export const COPYRIGHT_YEAR = new Date().getFullYear();

/**
 * Formspree (or other waitlist provider) endpoint for the Class Play
 * teacher waitlist. Until owner signs up at formspree.io and pastes
 * the endpoint URL here, submissions are logged server-side only.
 *
 * Replace 'YOUR_ENDPOINT' with the real Formspree form id, e.g.
 * 'https://formspree.io/f/xkgwlqjy'.
 */
export const CLASS_PLAY_WAITLIST_ENDPOINT = 'https://formspree.io/f/YOUR_ENDPOINT';
