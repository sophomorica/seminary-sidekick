/**
 * Store URLs and platform availability.
 *
 * Launch-day update is a single-file change here. Every CTA on the
 * site reads from these constants — App Store badge in nav, "Get the
 * app" buttons throughout, hero CTAs, footer links.
 *
 * TODO: Replace placeholders with real URLs before TASK-C-110.
 */

/**
 * Apple App Store listing URL. Use the long `https://apps.apple.com/...`
 * format with UTM tags so we can track web→install conversion.
 */
export const IOS_URL = '#'; // TODO: real App Store URL on launch

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
export const IOS_AVAILABLE = false; // flip to true the moment we go live
