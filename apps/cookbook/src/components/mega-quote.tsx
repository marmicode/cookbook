import { ReactNode } from 'react';
import styles from './mega-quote.module.css';

export function MegaQuote({ children }: { children: ReactNode }) {
  return <blockquote className={styles.important}>{children}</blockquote>;
}
