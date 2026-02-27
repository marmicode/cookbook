import { test, expect } from '@playwright/test';

test('landing layout', async ({ page }) => {
  await page.goto('/');

  /* Close the announcement bar if any before taking a screenshot. */
  await page.addLocatorHandler(
    page.getByRole('banner').getByRole('button', { name: 'Close' }),
    (btn) => btn.click(),
  );

  await expect(page).toHaveScreenshot({
    fullPage: true,
  });
});
