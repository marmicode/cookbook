import type { WrapperProps } from '@docusaurus/types';
import Layout from '@theme-original/Footer/Layout';
import React, { type JSX } from 'react';
import styles from './styles.module.css';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const { links, ...rest } = props;
  const content = (
    <>
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
