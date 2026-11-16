import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.VERIFY_PORT ?? 4400);
const evidence = process.env.VERIFY_EVIDENCE ?? '/tmp/verify-sidekick-evidence';

export default defineConfig({
	testDir: '.',
	testMatch: 'verify.spec.ts',
	outputDir: `${evidence}/pw-output`,
	workers: 1,
	reporter: [['list'], ['json', { outputFile: `${evidence}/result.json` }]],
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		trace: 'retain-on-failure',
		actionTimeout: 5_000,
		navigationTimeout: 15_000
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
