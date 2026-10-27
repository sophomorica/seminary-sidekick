import { ANDROID_URL, IOS_URL } from '../config/store';

export type StorePlatform = 'ios' | 'android' | 'other';

/**
 * Map a User-Agent header to the store the visitor should land on.
 *
 * iPadOS 13+ Safari reports a desktop "Macintosh" UA. A plain Mac UA is
 * ambiguous server-side, so we only treat Macintosh as iOS when the UA
 * itself carries a touch/mobile marker (in-app web views often add
 * "Mobile/…"). Real desktop Macs fall through to the fallback page,
 * which also lists the App Store.
 */
export function platformForUserAgent(userAgent: string | null | undefined): StorePlatform {
	const ua = userAgent ?? '';
	if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
	// Android before Macintosh: some Android UAs mention neither, none mention both.
	if (/Android/i.test(ua)) return 'android';
	if (/Macintosh/i.test(ua) && /\bMobile\/|Touch/i.test(ua)) return 'ios';
	return 'other';
}

/** Store URL for a platform, or null when the visitor should see both links. */
export function storeUrlForPlatform(platform: StorePlatform): string | null {
	if (platform === 'ios') return IOS_URL;
	if (platform === 'android') return ANDROID_URL;
	return null;
}
