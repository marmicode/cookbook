import { test, expect } from '@playwright/test';

test('doc link card navigates to the correct page', async ({ page }) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  const recipeLinkCard = page.getByRole('link', {
    name: '📄️ How to Cook a Fake A step',
  });

  await expect(recipeLinkCard).toContainText(
    'A step-by-step recipe for building and using Fakes in Angular tests.',
  );

  await recipeLinkCard.click();

  await expect(page.locator('h1')).toContainText('How to Cook a Fake');
});
