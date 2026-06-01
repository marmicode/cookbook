import type { WrapperProps } from '@docusaurus/types';
import { NewsletterForm } from '@site/src/components/newsletter-form';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import { type ReactNode } from 'react';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      <div style={{ height: '20px' }} />
      <NewsletterForm />
      <Footer {...props} />
    </>
  );
}
