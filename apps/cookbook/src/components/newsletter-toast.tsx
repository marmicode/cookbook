import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getCookbookConfig } from '../cookbook.config';
import { NewsletterForm } from './newsletter-form';
import { userPreferencesRepository } from './user-preferences-repository';
import styles from './newsletter-toast.module.css';

export function NewsletterToast(): ReactNode {
  const { scrollThresholdVh, bottomHideThresholdVh } =
    getCookbookConfig().newsletter;

  const isVisibleForScroll = useToastScrollVisibility({
    minScrollVh: scrollThresholdVh,
    bottomHideVh: bottomHideThresholdVh,
  });
  const [isClosed, setIsClosed] = useState(false);

  if (
    !userPreferencesRepository.shouldShowNewsletterPrompt() ||
    !isVisibleForScroll ||
    isClosed
  ) {
    return null;
  }

  const handleDismiss = () => {
    userPreferencesRepository.rememberNewsletterDismissed();
    setIsClosed(true);
  };

  const handleSubmit = () => {
    userPreferencesRepository.rememberNewsletterSubscribed();
    setIsClosed(true);
  };

  return (
    <aside
      aria-label="Newsletter signup"
      aria-live="polite"
      className={styles.toast}
    >
      <button
        aria-label="Dismiss newsletter signup"
        className={styles.dismissButton}
        onClick={handleDismiss}
        type="button"
      >
        ×
      </button>
      <NewsletterForm onSubmit={handleSubmit} />
    </aside>
  );
}

function useToastScrollVisibility({
  minScrollVh,
  bottomHideVh,
}: {
  minScrollVh: number;
  bottomHideVh: number;
}): boolean {
  const [isVisible, setIsVisible] = useState(false);
  const updateVisibility = useCallback(() => {
    setIsVisible(_isWithinVisibleZone({ bottomHideVh, minScrollVh }));
  }, [minScrollVh, bottomHideVh]);

  useEffect(() => {
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
    };
  }, [updateVisibility]);

  return isVisible;
}

function _isWithinVisibleZone({
  bottomHideVh,
  minScrollVh,
}: {
  bottomHideVh: number;
  minScrollVh: number;
}): boolean {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const distanceFromBottom = scrollableHeight - window.scrollY;
  const bottomHideThresholdPx = (window.innerHeight * bottomHideVh) / 100;

  if (scrollableHeight <= 0) {
    return true;
  }

  const thresholdPx = (window.innerHeight * minScrollVh) / 100;

  return (
    window.scrollY >= thresholdPx && distanceFromBottom > bottomHideThresholdPx
  );
}
