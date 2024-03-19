import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

/* Faking components as overriding `@theme/*` to import stuff from `@docusaurus/theme-classic`
 * doesn't seem to be enough. */
vi.mock('@theme/CodeBlock', createFake('CodeBlock'));
vi.mock('@theme/Tabs', createFake('Tabs'));
vi.mock('@theme/TabItem', createFake('TabItem'));

function createFake(name: string) {
  return () => ({
    default: ({ children, ...props }: { children: React.ReactNode }) => {
      return (
        <div data-testid={name} data-props={JSON.stringify(props)}>
          {children}
        </div>
      );
    },
  });
}
