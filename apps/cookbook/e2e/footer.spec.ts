import { test, expect } from '@playwright/test';

test('footer newsletter registration submit button is disabled', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: 'JOIN THE KITCHEN' }),
  ).toBeDisabled();
});

test('footer newsletter registration submit button is enabled when email is valid', async ({
  context,
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Email address').fill('kitchen@marmicode.io');

  await expect
    .soft(page.getByRole('form', { name: 'Newsletter registration form' }))
    .toHaveAttribute(
      'action',
      'https://marmicode.us3.list-manage.com/subscribe/post?u=915d6ba70c9c00912ba326214&id=71255f30c7&f_id=00dbc1e5f0',
    );
  await expect
    .soft(page.getByRole('button', { name: 'JOIN THE KITCHEN' }))
    .toBeEnabled();
});

test('footer newsletter registration works', async ({ context, page }) => {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(
    !!process.env['CI'],
    'Skipping newsletter registration test in CI as it is blocked by Mailchimp',
  );

  await page.goto('/');
  await page.getByLabel('Email address').fill('kitchen@marmicode.io');
  await page.getByRole('button', { name: 'JOIN THE KITCHEN' }).click();
  await expect.poll(() => context.pages().length).toBe(2);
  const secondPage = context.pages()[1];
  await expect(
    secondPage.getByText('Your subscription to our list has been confirmed.'),
  ).toBeVisible();
});
