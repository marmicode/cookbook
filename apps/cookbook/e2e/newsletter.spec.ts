import { test as base, expect, Locator } from '@playwright/test';

const test = base.extend<{
  setUp: () => {
    scrollViewportHeightTimes: (
      viewportHeightMultiplier: number,
    ) => Promise<void>;
    newsletterFooterForm: Locator;
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
      newsletterFooterForm: page.getByRole('form', {
        name: 'Newsletter registration form',
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

test('footer newsletter registration submit button is disabled', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  await expect(page.getByRole('button', { name: 'NOTIFY ME' })).toBeDisabled();
});

test('footer newsletter registration submit button is enabled when email is valid', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');
  await page.getByLabel('Email address').fill('kitchen@marmicode.io');

  await expect
    .soft(page.getByRole('form', { name: 'Newsletter registration form' }))
    .toHaveAttribute(
      'action',
      'https://marmicode.us3.list-manage.com/subscribe/post?u=915d6ba70c9c00912ba326214&id=71255f30c7&f_id=00dbc1e5f0',
    );
  await expect
    .soft(page.getByRole('button', { name: 'NOTIFY ME' }))
    .toBeEnabled();
});

/**
 * This test is triggered manually in a headed browser.
 * Otherwise, it is blocked by Mailchimp.
 */
test(
  'newsletter toast subscribes user',
  { tag: ['@manual'] },
  async ({ context, setUp }) => {
    const { newsletterToast, scrollViewportHeightTimes } = setUp();

    await scrollViewportHeightTimes(2.5);

    await expect(newsletterToast).toBeInViewport();

    await newsletterToast
      .getByLabel('Email address')
      .fill('kitchen@marmicode.io');
    await newsletterToast.getByRole('button', { name: 'NOTIFY ME' }).click();

    await expect.poll(() => context.pages().length).toBe(2);
    const secondPage = context.pages()[1];
    await expect(
      secondPage.getByText('Your subscription to our list has been confirmed.'),
    ).toBeVisible();
  },
);

/**
 * This test is triggered manually in a headed browser.
 * Otherwise, it is blocked by Mailchimp.
 */
test(
  'footer newsletter registration works',
  { tag: ['@manual'] },
  async ({ context, setUp }) => {
    const { newsletterFooterForm } = setUp();
    await newsletterFooterForm
      .getByLabel('Email address')
      .fill('kitchen@marmicode.io');
    await newsletterFooterForm
      .getByRole('button', { name: 'NOTIFY ME' })
      .click();

    await expect.poll(() => context.pages().length).toBe(2);
    const secondPage = context.pages()[1];
    await expect(
      secondPage.getByText('Your subscription to our list has been confirmed.'),
    ).toBeVisible();
  },
);
