import React from 'react';
import { expect, test } from 'vitest';
import { Stackblitz } from './stackblitz';
import { render } from '@testing-library/react';

test(`${Stackblitz.name} should render iframe`, async () => {
  const { container } = render(
    <Stackblitz
      title="Fake it till you mock it - Code Example"
      repo="marmicode/cookbook-demos"
      branch="angular-testing"
      file="apps/demo/src/app/fake-it-till-you-mock-it/cookbook-search.spec.ts"
      initialPath="/__vitest__/"
    />,
  );
  const iframeEl = container.querySelector('iframe');

  expect
    .soft(iframeEl)
    .toHaveAttribute(
      'src',
      'https://stackblitz.com/github/marmicode/cookbook-demos/tree/angular-testing?embed=1&terminalHeight=0&file=apps%2Fdemo%2Fsrc%2Fapp%2Ffake-it-till-you-mock-it%2Fcookbook-search.spec.ts&initialPath=%2F__vitest__%2F',
    );
  expect.soft(iframeEl.style.minHeight).toBe('500px');
  expect.soft(iframeEl.style.width).toBe('100%');
});

test(`${Stackblitz.name} should render github file link`, async () => {
  const { container } = render(
    <Stackblitz
      title="Fake it till you mock it - Code Example"
      repo="marmicode/cookbook-demos"
      branch="angular-testing"
      file="apps/demo/src/app/fake-it-till-you-mock-it/cookbook-search.spec.ts"
    />,
  );
  const githubEl = container.querySelector('a');

  expect
    .soft(githubEl)
    .toHaveTextContent('Fake it till you mock it - Code Example');

  expect
    .soft(githubEl)
    .toHaveAttribute(
      'href',
      'https://github.com/marmicode/cookbook-demos/blob/angular-testing/apps/demo/src/app/fake-it-till-you-mock-it/cookbook-search.spec.ts',
    );
  expect.soft(githubEl.target).toBe('_blank');
});

test(`${Stackblitz.name} should render github main branch file link`, async () => {
  const { container } = render(
    <Stackblitz
      title="Fake it till you mock it - Code Example"
      repo="marmicode/cookbook-demos"
      file="README.md"
    />,
  );
  const githubEl = container.querySelector('a');

  expect
    .soft(githubEl)
    .toHaveTextContent('Fake it till you mock it - Code Example');

  expect
    .soft(githubEl)
    .toHaveAttribute(
      'href',
      'https://github.com/marmicode/cookbook-demos/blob/main/README.md',
    );
});

test(`${Stackblitz.name} should render github branch link`, async () => {
  const { container } = render(
    <Stackblitz
      title="Fake it till you mock it - Code Example"
      repo="marmicode/cookbook-demos"
      branch="angular-testing"
    />,
  );
  const githubEl = container.querySelector('a');

  expect
    .soft(githubEl)
    .toHaveTextContent('Fake it till you mock it - Code Example');

  expect
    .soft(githubEl)
    .toHaveAttribute(
      'href',
      'https://github.com/marmicode/cookbook-demos/tree/angular-testing',
    );
});
