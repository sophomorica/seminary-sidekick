import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration for Seminary Sidekick.
 *
 * Tests live in `./tests/`. They run against a local Vite dev server
 * that Playwright spins up automatically.
 *
 * Run modes:
 *   pnpm test:e2e          # Headless, all browsers
 *   pnpm test:e2e:ui       # Playwright UI mode (best for development)
 *   pnpm test:e2e:debug    # Debug mode with inspector
 *   pnpm test:e2e:report   # Open last run's HTML report
 *
 * First-time setup on a fresh checkout:
 *   pnpm install
 *   pnpm test:e2e:install  # Installs Chromium binary
 */
export default defineConfig({
	testDir: './tests',

	// Run files in parallel within a project. Each file runs serially internally
	// (the demo tests need that — state is sticky within a single play-through).
	fullyParallel: true,

	// Fail the CI build if test.only is left in source.
	forbidOnly: !!process.env.CI,

	// Retry flaky tests on CI; in dev surface them immediately.
	retries: process.env.CI ? 2 : 0,

	// Cap worker count on CI to avoid resource contention; let local use cores.
	workers: process.env.CI ? 2 : undefined,

	// HTML report is the human-readable "timestamp of things that work."
	// Open with `pnpm test:e2e:report`.
	reporter: process.env.CI ? [['html'], ['github']] : [['html'], ['list']],

	use: {
		baseURL: 'http://localhost:5173',

		// Capture trace + screenshot on first retry so debugging failures is easy.
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		// Treat console errors as test failures (caught per-test via page.on).
		// Globally, we set a reasonable timeout for actions.
		actionTimeout: 5_000,
		navigationTimeout: 15_000
	},

	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		stdout: 'pipe',
		stderr: 'pipe'
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
		// Add WebKit + Firefox later for cross-browser coverage:
		// { name: 'firefox',  use: { ...devices['Desktop Firefox']  } },
		// { name: 'webkit',   use: { ...devices['Desktop Safari']   } },
		// { name: 'iPhone',   use: { ...devices['iPhone 14']         } },
	]
});
