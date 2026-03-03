import { test, expect } from '@playwright/test';

/**
 * This test is triggered manually in a headed browser.
 * Otherwise, it is blocked by Mailchimp.
 */
test('footer newsletter registration works', async ({ context, page }) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');
  await page.getByLabel('Email address').fill('kitchen@marmicode.io');
  await page.getByRole('button', { name: 'NOTIFY ME' }).click();
  await expect.poll(() => context.pages().length).toBe(2);
  const secondPage = context.pages()[1];
  await expect(
    secondPage.getByText('Your subscription to our list has been confirmed.'),
  ).toBeVisible();
});
