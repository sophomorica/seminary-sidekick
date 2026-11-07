/**
 * Store URLs and platform availability.
 *
 * Launch-day update is a single-file change here. Every CTA on the
 * site reads from these constants — App Store badge in nav, "Get the
 * app" buttons throughout, hero CTAs, footer links.
 */

/**
 * Apple App Store listing. Bare on purpose. Clicks go through `withPromo`
 * so each placement can be told apart. Apple drops `utm_*`. The helper sets `ct`.
 */
export const IOS_URL = 'https://apps.apple.com/us/app/seminary-sidekick/id6780003239';

/**
 * Google Play listing. Bare on purpose. `withPromo` puts the tags in `referrer`,
 * which is what Play Install Referrer reads. Buttons check `ANDROID_AVAILABLE`.
 */
export const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.seminarysidekick.app';

/**
 * Android is live on Google Play (package com.seminarysidekick.app).
 * Keep true. If ever flipped false, StoreButtons shows a non-link
 * "Coming soon" pill instead of the Play Store CTA.
 */
export const ANDROID_AVAILABLE = true;

/** iOS is live on the App Store. Keep true. */
export const IOS_AVAILABLE = true;
