import { test, expect } from '@playwright/test';

test('footer newsletter registration submit button is disabled', async ({
  page,
}) => {
  await page.goto('/angular/testing/fake-it-till-you-mock-it');

  await expect(page.getByRole('button', { name: 'NOTIFY ME' })).toBeDisabled();
});

test('footer newsletter registration submit button is enabled when email is valid', async ({
  context,
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
