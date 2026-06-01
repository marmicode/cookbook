import { expect, test } from '@playwright/test';

test('newsletter toast is displayed when the reader scrolls 200vh', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 2);
  });

  await expect(
    page.getByRole('complementary', { name: 'Newsletter signup' }),
  ).toBeVisible();
});

test('newsletter toast is hidden until the reader scrolls 200vh', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  await expect(
    page.getByRole('complementary', { name: 'Newsletter signup' }),
  ).toBeHidden();
});

test('newsletter toast hides within 100vh from the bottom', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  await page.evaluate(() => {
    window.scrollTo(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  });

  await expect(
    page.getByRole('complementary', { name: 'Newsletter signup' }),
  ).toBeHidden();
});
