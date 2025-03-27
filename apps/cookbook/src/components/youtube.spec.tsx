import React from 'react';
import { expect, test } from 'vitest';
import { Youtube } from './youtube';
import { render } from '@testing-library/react';

test(`${Youtube.name} should render iframe`, async () => {
  const { container } = render(
    <Youtube title="Nx Implicit Libraries Video" videoId="aIAKlhrex8c" />,
  );
  const iframeEl = container.querySelector('iframe');

  expect
    .soft(iframeEl)
    .toHaveAttribute('src', 'https://www.youtube.com/embed/aIAKlhrex8c');
  expect.soft(iframeEl.style.aspectRatio).toBe('16 / 9');
  expect.soft(iframeEl.style.width).toBe('100%');
  expect.soft(iframeEl.title).toBe('Nx Implicit Libraries Video');
});
