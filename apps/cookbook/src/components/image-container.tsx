import { ReactNode } from 'react';
import styles from './image-container.module.css';
import clsx from 'clsx';

export function ImageContainer({
  children,
  size,
}: {
  children: ReactNode;
  size: Size;
}) {
  return (
    <div className={clsx(styles.container, getClassName(size))}>{children}</div>
  );
}

export type Size = 'small' | 'medium';

function getClassName(size: Size): string | undefined {
  switch (size) {
    case 'small':
      return styles.small;
    case 'medium':
      return styles.medium;
  }
}
