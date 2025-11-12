import { test, expect } from '@playwright/test';

/**
 * This test is triggered manually in a headed browser.
 * Otherwise, it is blocked by Mailchimp.
 */
test('footer newsletter registration works', async ({ context, page }) => {
  await page.goto('/');
  await page.getByLabel('Email address').fill('kitchen@marmicode.io');
  await page.getByRole('button', { name: 'STAY UPDATED' }).click();
  await expect.poll(() => context.pages().length).toBe(2);
  const secondPage = context.pages()[1];
  await expect(
    secondPage.getByText('Your subscription to our list has been confirmed.'),
  ).toBeVisible();
});
