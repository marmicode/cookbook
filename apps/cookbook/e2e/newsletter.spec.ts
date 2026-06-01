import { test as base, expect, Locator } from '@playwright/test';

const test = base.extend<{
  setUp: () => {
    scrollViewportHeightTimes: (
      viewportHeightMultiplier: number,
    ) => Promise<void>;
    newsletterToast: Locator;
  };
}>({
  setUp: async ({ page }, use) => {
    await page.goto('/angular/testing/fake-it-till-you-mock-it');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(() => ({
      newsletterToast: page.getByRole('complementary', {
        name: 'Newsletter signup',
      }),
      scrollViewportHeightTimes: async (viewportHeightMultiplier: number) => {
        await page.evaluate(async (multiplier: number) => {
          const pageHeight = window.document.documentElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          window.scrollTo(
            0,
            multiplier >= 0
              ? viewportHeight * multiplier
              : pageHeight - viewportHeight * (Math.abs(multiplier) + 1),
          );
        }, viewportHeightMultiplier);
      },
    }));
  },
});

test('newsletter toast is displayed when the reader scrolls 200vh', async ({
  setUp,
}) => {
  const { newsletterToast, scrollViewportHeightTimes } = setUp();

  await scrollViewportHeightTimes(2.5);

  await expect(newsletterToast).toBeInViewport();
});

test('newsletter toast is hidden until the reader scrolls 200vh', async ({
  setUp,
}) => {
  const { newsletterToast, scrollViewportHeightTimes } = setUp();

  await scrollViewportHeightTimes(1.9);

  await expect(newsletterToast).toBeHidden();
});

test('newsletter toast is still bebore reaching the 100vh from the button', async ({
  setUp,
}) => {
  const { newsletterToast, scrollViewportHeightTimes } = setUp();

  await scrollViewportHeightTimes(-1.1);

  await expect(newsletterToast).toBeInViewport();
});

test('newsletter toast hides within 100vh from the bottom', async ({
  setUp,
}) => {
  const { newsletterToast, scrollViewportHeightTimes } = setUp();

  await scrollViewportHeightTimes(2.5);

  await expect(newsletterToast).toBeInViewport();

  await scrollViewportHeightTimes(-0.9);

  await expect(newsletterToast).toBeHidden();
});
