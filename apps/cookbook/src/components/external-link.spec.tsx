import { render } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';
import { ExternalLink } from './external-link';

test(`${ExternalLink.name} renders correctly without UTM parameters`, () => {
  const { container } = render(
    <ExternalLink href="https://courses.marmicode.io">
      Let's cook some tests
    </ExternalLink>,
  );

  const linkEl = container.querySelector('a');

  expect
    .soft(linkEl)
    .toHaveAttribute(
      'href',
      'https://courses.marmicode.io/?utm_source=cookbook',
    );
  expect.soft(linkEl).toHaveTextContent(`Let's cook some tests`);
  expect.soft(linkEl).toHaveAttribute('target', '_blank');
  expect.soft(linkEl).toHaveAttribute('rel', 'noopener noreferrer');
});

test(`${ExternalLink.name} renders correctly with UTM parameters`, () => {
  const { container } = render(
    <ExternalLink
      href="https://courses.marmicode.io"
      medium="in-article"
      campaign="prep-station-v20"
      content="flushing-flusheffects"
    >
      Let's cook some tests
    </ExternalLink>,
  );

  const linkEl = container.querySelector('a');

  expect
    .soft(linkEl)
    .toHaveAttribute(
      'href',
      'https://courses.marmicode.io/?utm_source=cookbook&utm_medium=in-article&utm_campaign=prep-station-v20&utm_content=flushing-flusheffects',
    );
});
