import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getCookbookConfig } from '../cookbook.config';
import { NewsletterForm } from './newsletter-form';
import { userPreferencesRepository } from './user-preferences-repository';
import styles from './newsletter-toast.module.css';

const { scrollThresholdVh, bottomHideThresholdVh } =
  getCookbookConfig().newsletter;

export function hasReachedScrollThreshold(
  minScrollVh = scrollThresholdVh,
): boolean {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return true;
  }

  const thresholdPx = (window.innerHeight * minScrollVh) / 100;

  return window.scrollY >= thresholdPx;
}

export function isWithinBottomHideZone(
  bottomHideVh = bottomHideThresholdVh,
): boolean {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableHeight <= 0) {
    return true;
  }

  const distanceFromBottom = scrollableHeight - window.scrollY;
  const hideThresholdPx = (window.innerHeight * bottomHideVh) / 100;

  return distanceFromBottom <= hideThresholdPx;
}

export function NewsletterToast(): ReactNode {
  const isVisibleForScroll = useToastScrollVisibility({
    minScrollVh: scrollThresholdVh,
    bottomHideVh: bottomHideThresholdVh,
  });
  const [isDismissed, setIsDismissed] = useState(false);

  if (
    !userPreferencesRepository.shouldShowNewsletterPrompt() ||
    !isVisibleForScroll ||
    isDismissed
  ) {
    return null;
  }

  const handleDismiss = () => {
    userPreferencesRepository.rememberNewsletterDismissed();
    setIsDismissed(true);
  };

  const handleSubmit = () => {
    userPreferencesRepository.rememberNewsletterSubscribed();
    setIsDismissed(true);
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
    setIsVisible(
      hasReachedScrollThreshold(minScrollVh) &&
        !isWithinBottomHideZone(bottomHideVh),
    );
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
