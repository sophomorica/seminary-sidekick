/**
 * Store URLs and platform availability.
 *
 * Launch-day update is a single-file change here. Every CTA on the
 * site reads from these constants — App Store badge in nav, "Get the
 * app" buttons throughout, hero CTAs, footer links.
 */

/**
 * Apple App Store listing URL. Use the long `https://apps.apple.com/...`
 * format with UTM tags so we can track web→install conversion.
 */
export const IOS_URL = 'https://apps.apple.com/us/app/seminary-sidekick/id6780003239';

/**
 * Google Play Store listing URL. Use UTM tags. Empty `#` until Android
 * launches; the buttons check `ANDROID_AVAILABLE` before linking.
 */
export const ANDROID_URL = '#'; // TODO: real Play Store URL on Android launch

/**
 * Toggle this when the Android build is live in the Play Store.
 * When false, the Play Store button renders as a disabled "Coming
 * soon to Android" pill instead of a link.
 */
export const ANDROID_AVAILABLE = false;

/** Whether the iOS app is in the App Store. Almost always true once we launch. */
export const IOS_AVAILABLE = true;
