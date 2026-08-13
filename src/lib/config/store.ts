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
 * Google Play Store listing URL. Use UTM tags when available.
 * Buttons check `ANDROID_AVAILABLE` before linking.
 */
export const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.seminarysidekick.app';

/**
 * Android is live on Google Play (package com.seminarysidekick.app).
 * Keep true. If ever flipped false, StoreButtons shows a non-link
 * "Coming to Android" pill instead of the Play Store CTA.
 */
export const ANDROID_AVAILABLE = true;

/** iOS is live on the App Store. Keep true. */
export const IOS_AVAILABLE = true;
