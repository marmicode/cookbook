const NEWSLETTER_STORAGE_KEYS = {
  dismissed: 'marmicode-newsletter-dismissed',
  subscribed: 'marmicode-newsletter-subscribed',
} as const;

export class UserPreferencesRepository {
  private canUseStorage(): boolean {
    return typeof window !== 'undefined';
  }

  isNewsletterDismissed(): boolean {
    if (!this.canUseStorage()) {
      return false;
    }

    return (
      window.localStorage.getItem(NEWSLETTER_STORAGE_KEYS.dismissed) === '1'
    );
  }

  isNewsletterSubscribed(): boolean {
    if (!this.canUseStorage()) {
      return false;
    }

    return (
      window.localStorage.getItem(NEWSLETTER_STORAGE_KEYS.subscribed) === '1'
    );
  }

  shouldShowNewsletterPrompt(): boolean {
    return !this.isNewsletterDismissed() && !this.isNewsletterSubscribed();
  }

  rememberNewsletterDismissed(): void {
    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.setItem(NEWSLETTER_STORAGE_KEYS.dismissed, '1');
  }

  rememberNewsletterSubscribed(): void {
    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.setItem(NEWSLETTER_STORAGE_KEYS.subscribed, '1');
  }

  clearNewsletterStorage(): void {
    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.removeItem(NEWSLETTER_STORAGE_KEYS.dismissed);
    window.localStorage.removeItem(NEWSLETTER_STORAGE_KEYS.subscribed);
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();
