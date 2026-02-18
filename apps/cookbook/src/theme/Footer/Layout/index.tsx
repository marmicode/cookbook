import React, { useRef, useState } from 'react';
import Layout from '@theme-original/Footer/Layout';
import type { WrapperProps } from '@docusaurus/types';
import styles from './styles.module.css';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { links, ...rest } = props;
  const content = (
    <>
      <NewsletterForm />
      {links}
      <LegalLinks />
    </>
  );
  return <Layout links={content} {...rest} />;
}

function LegalLinks() {
  const legalLinks = [
    { label: 'Legal Info', href: 'https://courses.marmicode.io/pages/legal' },
    {
      label: 'Terms',
      href: 'https://courses.marmicode.io/pages/terms-and-conditions',
    },
    {
      label: 'Privacy',
      href: 'https://courses.marmicode.io/pages/privacy-policy',
    },
  ];

  return (
    <div className={styles.legalLinks}>
      {legalLinks.map((link, index) => {
        return (
          <React.Fragment key={index}>
            {index > 0 && <span aria-hidden="true">·</span>}
            <a href={link.href}>{link.label}</a>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);

  const handleChange = () => {
    setIsValid(formRef.current?.checkValidity() ?? false);
  };

  return (
    <section className={styles.container} aria-labelledby="footer-newsletter">
      <div className={styles.content}>
        <h2 id="footer-newsletter" className={styles.title}>
          <span role="img" aria-label="email">
            ✉️
          </span>
          <span> Fresh testing recipes, delivered right to your inbox.</span>
        </h2>
        <form
          action="https://marmicode.us3.list-manage.com/subscribe/post?u=915d6ba70c9c00912ba326214&id=71255f30c7&f_id=00dbc1e5f0"
          aria-label="Newsletter registration form"
          className={styles.form}
          method="post"
          ref={formRef}
          rel="noopener"
          target="_blank"
        >
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-5000px' }}
          >
            <input
              name="b_915d6ba70c9c00912ba326214_71255f30c7"
              readOnly
              tabIndex={-1}
              type="text"
              value=""
            />
            <input
              name="tags"
              readOnly
              tabIndex={-1}
              type="hidden"
              value="10770715"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              aria-label="Email address"
              autoComplete="email"
              className={styles.input}
              name="EMAIL"
              onChange={handleChange}
              placeholder="i-am@curious.dev"
              required
              type="email"
            />
            <button className={styles.button} disabled={!isValid} type="submit">
              STAY UPDATED
            </button>
          </div>
          <p className={styles.helperText}>
            ~1 email per month. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
