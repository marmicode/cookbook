import { test, expect } from '@playwright/test';

for (const chapter of [
  'beyond-unit-vs-integration',
  'pragmatic-testing-strategy',
  'vitest',
  'why-vitest',
  'migrating-to-vitest',
  'fake-it-till-you-mock-it',
  'flushing-flusheffects',
  'tests-error-sensitivity',
]) {
  test(`should redirect /angular/${chapter}`, async ({ page }) => {
    await page.goto(`/angular/${chapter}`);
    await expect(page).toHaveURL(`/angular/testing/${chapter}`);
  });
}

test('should redirect trailing slash in /angular/:chapter/', async ({
  page,
}) => {
  await page.goto('/angular/beyond-unit-vs-integration/');
  await expect(page).toHaveURL('/angular/testing/beyond-unit-vs-integration');
});

test('should redirect /nx/intro', async ({ page }) => {
  await page.goto('/nx/intro');
  await expect(page).toHaveURL('/nx');
});

test('should redirect /nx/intro/', async ({ page }) => {
  await page.goto('/nx/intro/');
  await expect(page).toHaveURL('/nx');
});
