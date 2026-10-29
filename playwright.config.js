import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30000,
	fullyParallel: true,
	retries: 0,
	reporter: [['list']],
	use: {
		baseURL: 'http://localhost:8000',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'python3 -m http.server 8000',
		url: 'http://localhost:8000',
		reuseExistingServer: !process.env.CI,
		timeout: 30000
	}
});
