import { afterEach, expect, test } from 'vitest';
import { userPreferencesRepository } from './user-preferences-repository';

afterEach(() => {
  userPreferencesRepository.clearNewsletterStorage();
});

test('shouldShowNewsletterPrompt is true by default', () => {
  expect(userPreferencesRepository.shouldShowNewsletterPrompt()).toBe(true);
});

test('rememberNewsletterDismissed hides future prompts', () => {
  userPreferencesRepository.rememberNewsletterDismissed();

  expect(userPreferencesRepository.isNewsletterDismissed()).toBe(true);
  expect(userPreferencesRepository.shouldShowNewsletterPrompt()).toBe(false);
});

test('rememberNewsletterSubscribed hides future prompts', () => {
  userPreferencesRepository.rememberNewsletterSubscribed();

  expect(userPreferencesRepository.isNewsletterSubscribed()).toBe(true);
  expect(userPreferencesRepository.shouldShowNewsletterPrompt()).toBe(false);
});
