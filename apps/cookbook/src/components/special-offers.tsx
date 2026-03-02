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
          src="/img/course-small.webp"
          alt="Pragmatic Angular Testing"
          className={styles.image}
        />
      </ExternalLink>
      <div>
        <div className={styles.courseLink}>
          <span role="img" aria-label="cook">
            👨🏻‍🍳{' '}
          </span>
          <ExternalLink
            className={[styles.primary, styles.link].join(' ')}
            href="https://courses.marmicode.io/courses/pragmatic-angular-testing"
            medium={medium}
            content="course_link"
          >
            Start the course →
          </ExternalLink>
        </div>

        <p className={styles.priceInfo}>
          <span>
            💰 <s>170€</s> → 80€ ·{' '}
          </span>
          <span className={styles.launchPrice}>Launch Price</span>
        </p>

        <p className={styles.description}>
          Stop rewriting tests every time you refactor.
        </p>
      </div>
    </section>
  );
}
