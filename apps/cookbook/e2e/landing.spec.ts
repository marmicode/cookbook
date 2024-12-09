import { test, expect } from '@playwright/test';

test('landing layout', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot({
    fullPage: true,
  });
});
