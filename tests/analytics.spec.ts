/**
 * Plausible — live seminarysidekick.com snippet is present.
 *
 * Pageviews are auto-captured by pa-*.js (History API). Custom events
 * go through `$lib/analytics/plausible.ts` and no-op when the stub is
 * missing (SSR / unit-less tests).
 */

import { test, expect } from '@playwright/test';

const PLAUSIBLE_SCRIPT_URL = 'https://plausible.io/js/pa-vYYRdw2uX4IsyGg8VCpY5.js';

test('homepage loads the live Plausible snippet', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator(`script[src="${PLAUSIBLE_SCRIPT_URL}"]`)).toHaveCount(1);
	await expect.poll(async () => page.evaluate(() => typeof window.plausible)).toBe('function');
});
