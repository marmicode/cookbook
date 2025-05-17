import React, { JSX } from 'react';

import styles from './special-offers.module.css';
import { ExternalLink } from './external-link';

export function SpecialOffers(): JSX.Element {
  const medium = 'toc';
  return (
    <section className={styles.container}>
      <ExternalLink
        href="https://courses.marmicode.io/courses/pragmatic-angular-testing"
        medium={medium}
        content="course_image"
      >
        <img
          src="/img/course.png"
          alt="Pragmatic Angular Testing"
          height={140}
          width={200}
          className={styles.image}
        />
      </ExternalLink>
      <div>
        <span role="img" aria-label="cook">
          👨🏻‍🍳{' '}
        </span>
        <ExternalLink
          className={[styles.primary, styles.link].join(' ')}
          href="https://courses.marmicode.io/courses/pragmatic-angular-testing"
          medium={medium}
          content="course_link"
        >
          Let's cook some tests →
        </ExternalLink>

        <p className={styles.priceInfo}>
          💰 80€ · <s>170€</s> ·{' '}
          <span className={styles.lifetimeAccess}>Lifetime access</span>
        </p>

        <p className={styles.description}>
          Learn how to write reliable tests that survive upgrades and
          refactorings.
        </p>

        <hr className={styles.separator} />

        <div className={styles.moreSeasoning}>
          <strong className={styles.moreSeasoningTitle}>
            <span role="img" aria-label="salt">
              🧂
            </span>
            Need more seasoning?
          </strong>
          <ExternalLink
            className={styles.link}
            href="https://courses.marmicode.io/bundles/ginger-review"
            medium={medium}
            content="code_review_link"
          >
            See code review/Q&A plans →
          </ExternalLink>

          <span>
            <ExternalLink
              className={styles.link}
              href="https://courses.marmicode.io"
              medium={medium}
              content="coaching_link"
            >
              Let's talk coaching →
            </ExternalLink>
          </span>
        </div>
      </div>
    </section>
  );
}
