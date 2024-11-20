import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import clsx from 'clsx';
import { Angular } from '../components/logos/angular';
import { Nx } from '../components/logos/nx';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      wrapperClassName={styles.wrapper}
      title={siteConfig.tagline}
      description={
        'Ingredients & Recipes for Cooking Delicious Apps with Angular & Nx'
      }
    >
      <HomepageHeader />
    </Layout>
  );
}

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={clsx('container', styles.container)}>
        <Hero />
        <Buttons />
      </div>
    </header>
  );
}

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <section>
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
    </section>
  );
}

function Buttons() {
  return (
    <div className={styles.buttons}>
      {[
        {
          href: '/angular/why-vitest',
          content: (
            <>
              <Angular />
              <p>Angular Testing</p>
            </>
          ),
        },
        {
          href: '/nx/intro',
          content: (
            <>
              <Nx />
              <p>Nx Cookbook</p>
            </>
          ),
        },
      ].map(({ href, content }) => (
        <Link
          className={clsx('button button--secondary button--lg', styles.button)}
          key={href}
          to={href}
        >
          {content}
        </Link>
      ))}
    </div>
  );
}
