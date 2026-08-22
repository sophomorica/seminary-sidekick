/**
 * Navigation structure — single source of truth for header and footer links.
 *
 * Edit here to add/remove links. The AppNav and AppFooter components
 * consume these arrays directly.
 */

export type NavLink = {
	label: string;
	href: string;
	/** Show in mobile menu and main nav. Hide via this flag if the section isn't ready yet. */
	visible?: boolean;
	/** External link (open in new tab, show indicator). */
	external?: boolean;
};

/**
 * Primary navigation — appears in the sticky header.
 * Order matters; it's the reading order on mobile too.
 */
export const MAIN_NAV: NavLink[] = [
	{ label: 'How it works', href: '/#how-it-works' },
	{ label: 'Join a room', href: '/join' },
	{ label: 'Premium', href: '/premium' },
	{ label: 'For teachers', href: '/for-teachers' },
	{ label: 'Library', href: '/teachers' },
	{ label: 'News', href: '/news' }
];

/**
 * Footer link groups. Each group renders as a column on desktop,
 * stacked on mobile.
 */
export type FooterGroup = {
	heading: string;
	links: NavLink[];
};

export const FOOTER_NAV: FooterGroup[] = [
	{
		heading: 'Apps',
		links: [
			{ label: 'Scripture Mastery', href: '/apps/scripture-mastery' },
			{ label: 'All apps', href: '/apps' }
		]
	},
	{
		heading: 'Discover',
		links: [
			{ label: 'How it works', href: '/#how-it-works' },
			{ label: 'Premium AI', href: '/premium' },
			{ label: 'For teachers', href: '/for-teachers' },
			{ label: 'Teacher library', href: '/teachers' }
		]
	},
	{
		heading: 'Try it',
		links: [
			{ label: 'Join a room', href: '/join' },
			{ label: 'Quick Quiz', href: '/quick-quiz' },
			{ label: 'Scripture Match', href: '/scripture-match' }
		]
	},
	{
		heading: 'Read',
		links: [
			{ label: 'News & devotionals', href: '/news' },
			{ label: 'About', href: '/about' }
		]
	},
	{
		heading: 'Legal',
		links: [
			{ label: 'Privacy', href: '/privacy' },
			{ label: 'Terms', href: '/terms' },
			{ label: 'Contact', href: '/contact' }
		]
	}
];
