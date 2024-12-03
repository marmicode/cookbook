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
      <HeroBanner />
      <Authors />
    </Layout>
  );
}

function HeroBanner() {
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
          href: '/angular/beyond-unit-vs-integration',
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

function Authors() {
  const author = {
    name: 'Younes Jaaidi',
    subtitles: [
      <>
        <span role="img" aria-label="Cook">
          👨🏻‍🍳
        </span>
        <span>Software Cook</span>
      </>,
      <>
        <Angular width={15} />{' '}
        <Link href="https://g.dev/younes" target="about:blank">
          Angular GDE
        </Link>
      </>,
      <>
        <Nx width={15} />{' '}
        <Link
          href="https://nx.dev/community#:~:text=Younes%20Jaaidi"
          target="about:blank"
        >
          Nx Champion
        </Link>
      </>,
      <>
        <span role="img" aria-label="Sailboat">
          ⛵️
        </span>
        <span>Mediocre Sailor</span>
      </>,
    ],
  };

  return (
    <section className={clsx(styles.section, styles.authorsSection)}>
      <h2>AUTHORS</h2>
      <section className={styles.authorsContainer}>
        <article className={clsx('card shadow--lt', styles.authorCard)}>
          <div className="avatar avatar--vertical margin-bottom--sm">
            <div className="avatar__photo avatar__photo--xl">
              <img
                src="/img/younes.jpg"
                alt="Younes Jaaidi"
                width="100"
                height="100"
              />
            </div>
            <div className="avatar__intro padding-top--sm">
              <div className="avatar__name">{author.name}</div>
              {author.subtitles.map((subtitle, index) => (
                <small
                  className={clsx('avatar__subtitle', styles.authorSubtitle)}
                  key={index}
                >
                  {subtitle}
                </small>
              ))}
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}
