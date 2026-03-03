import React, { useRef, useState, type ReactNode } from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import { NewsletterForm } from '@site/src/components/newsletter-form';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      <NewsletterForm />

      <Footer {...props} />
    </>
  );
}
