import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';

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
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img
          alt="Marmicode Pot"
          className={styles.heroLogo}
          src={useBaseUrl('/img/hero.png')}
          height="300"
        />
        <p className={styles.heroSubtitle}>MARMICODE</p>
        <p className={styles.heroSubtitleSecondary}>COOKBOOK</p>
      </div>
    </header>
  );
}
