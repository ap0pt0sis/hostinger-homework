import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv'

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {timeout: 5000},
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
    },
  ],
});
