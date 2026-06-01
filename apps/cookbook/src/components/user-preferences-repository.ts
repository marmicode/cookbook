const NEWSLETTER_STATUS_KEY = 'marmicode-newsletter-status';

type NewsletterStatus = 'subscribed' | 'dismissed';

export class UserPreferencesRepository {
  shouldShowNewsletterPrompt(): boolean {
    return this._getNewsletterStatus() === null;
  }

  rememberNewsletterDismissed(): void {
    this._rememberNewsletterStatus('dismissed');
  }

  rememberNewsletterSubscribed(): void {
    this._rememberNewsletterStatus('subscribed');
  }

  clearNewsletterPreferences(): void {
    if (!this._canUseStorage()) {
      return;
    }

    window.localStorage.removeItem(NEWSLETTER_STATUS_KEY);
  }

  private _rememberNewsletterStatus(status: NewsletterStatus): void {
    if (!this._canUseStorage()) {
      return;
    }

    window.localStorage.setItem(NEWSLETTER_STATUS_KEY, status);
  }

  private _canUseStorage(): boolean {
    return typeof window !== 'undefined';
  }

  private _getNewsletterStatus(): NewsletterStatus | null {
    if (!this._canUseStorage()) {
      return null;
    }

    const status = window.localStorage.getItem(NEWSLETTER_STATUS_KEY);
    return status === 'subscribed' || status === 'dismissed' ? status : null;
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();
