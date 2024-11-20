import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import clsx from 'clsx';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
    </Layout>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img
          alt="Marmicode Pot"
          className={styles.heroLogo}
          src={useBaseUrl('/img/hero.png')}
          height="300"
        />
        <p className={clsx(styles.heroSubtitle)}>MARMICODE</p>
        <p className={clsx(styles.heroSubtitle, styles.heroSubtitleSecondary)}>
          COOKBOOK
        </p>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--lg" to="/angular/testing">
            Angular Testing
          </Link>
          <Link className="button button--lg" to="/nx/intro">
            Nx
          </Link>
        </div>
      </div>
    </header>
  );
}
