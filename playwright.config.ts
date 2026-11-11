import { defineConfig, devices } from '@playwright/test';

const mockSupabaseEnv = {
	PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54329',
	PUBLIC_SUPABASE_ANON_KEY: 'e2e-mock-anon-key'
};

const ci = !!process.env.CI;
const appOrigin = 'http://127.0.0.1:4173';
const appCommand = ci
	? 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort'
	: 'pnpm dev --host 127.0.0.1 --port 4173 --strictPort';

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
		baseURL: appOrigin,

		// Capture trace + screenshot on first retry so debugging failures is easy.
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		// Treat console errors as test failures (caught per-test via page.on).
		// Globally, we set a reasonable timeout for actions.
		actionTimeout: 5_000,
		navigationTimeout: 15_000
	},

	webServer: [
		{
			command: 'node tests/mocks/supabase-posts.mjs',
			url: 'http://127.0.0.1:54329/health',
			reuseExistingServer: !ci,
			timeout: 30_000
		},
		{
			command: appCommand,
			url: appOrigin,
			reuseExistingServer: false,
			timeout: 180_000,
			stdout: 'pipe',
			stderr: 'pipe',
			env: mockSupabaseEnv
		}
	],

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
