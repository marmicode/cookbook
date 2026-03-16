import { JSX, type ReactNode } from 'react';
import styles from './callout-banner.module.css';
import { ExternalLink } from './external-link';
import { getCookbookConfig } from '../cookbook.config';
import { toUrlWithUtm } from '../util/to-url-with-utm';

export function CalloutBanner({ intro }: { intro: string }): JSX.Element {
  const { description, image, alt, href } = getCourseOrWorkshopInfo({
    intro,
  });

  return (
    <div>
      <p className={styles.paragraph}>{description}</p>
      <ExternalLink href={href} medium="in-article">
        <img className={styles.image} src={image} alt={alt} />
      </ExternalLink>
    </div>
  );
}

function getCourseOrWorkshopInfo({ intro }: { intro: string }): {
  description: ReactNode;
  image: string;
  alt: string;
  href: string;
} {
  const { courseUrl, nextWorkshop } = getCookbookConfig();

  const commonDescription = (
    <>
      {intro} See how this fits into a{' '}
      <b>Full Pragmatic Angular Testing Strategy</b>
    </>
  );

  if (nextWorkshop) {
    return {
      description: (
        <>{commonDescription} — with hands-on exercises and live guidance.</>
      ),
      image: '/img/banner-workshop.webp',
      alt: 'Pragmatic Angular Testing Workshop',
      href: nextWorkshop.inArticleUrl,
    };
  }

  /* Fallback to course. */
  return {
    description: (
      <>
        {commonDescription} — with hands-on exercises and an AI tutor that
        nudges you forward, one hint at a time.
      </>
    ),
    image: '/img/banner-course.webp',
    alt: 'Pragmatic Angular Testing Course',
    href: toUrlWithUtm(courseUrl, { medium: 'in-article' }),
  };
}
