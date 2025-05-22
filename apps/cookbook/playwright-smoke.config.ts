import { defineConfig } from '@playwright/test';
import defaultConfig from './playwright.config';
import { execSync } from 'child_process';

export default defineConfig(defaultConfig, {
  testMatch: /.*\.smoke\.ts/,
  use: {
    baseURL: maybeGetPreviewUrl() ?? 'https://cookbook.marmicode.io',
  },
});

function maybeGetPreviewUrl() {
  const branchName =
    process.env['GITHUB_REF_NAME'] ??
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const slug = branchName.replace(/[^a-zA-Z0-9]/g, '-');

  const channelRawLines = execSync(`firebase hosting:channel:list`)
    .toString()
    .split('\n');
  const channelRawLine = channelRawLines.find((channel) =>
    channel.includes(slug),
  );
  return channelRawLine?.split('│')[3]?.trim();
}
