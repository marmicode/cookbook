import { render } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';
import NpmCommand from './npm-command';
import { getProps } from '../testing/utils';

test('should render pnpm, npm, and yarn commands', () => {
  const { getAllByTestId } = render(<NpmCommand args={'run test'} />);

  const tabItems = getAllByTestId('TabItem');

  expect(tabItems).toHaveLength(3);
  expect(getProps(tabItems[0])).toMatchObject({
    label: 'pnpm',
    value: 'pnpm',
  });
  expect(tabItems[0]).toHaveTextContent('pnpm run test');

  expect(getProps(tabItems[1])).toMatchObject({
    label: 'npm',
    value: 'npm',
  });
  expect(tabItems[1]).toHaveTextContent('npm run test');

  expect(getProps(tabItems[2])).toMatchObject({
    label: 'yarn',
    value: 'yarn',
  });
  expect(tabItems[2]).toHaveTextContent('yarn run test');
});

test('should set language to shell', () => {
  const { getAllByTestId } = render(<NpmCommand args={'run test'} />);

  expect(getProps(getAllByTestId('CodeBlock')[0])).toMatchObject({
    language: 'sh',
  });
});

test('should render commands with different arguments per package manager', () => {
  const { getAllByTestId } = render(
    <NpmCommand
      args={{ npm: 'install -g nx', pnpm: 'add -g nx', yarn: 'global add nx' }}
    />,
  );

  const codes = getAllByTestId('CodeBlock').map((el) => el.textContent.trim());

  expect(codes).toContain('pnpm add -g nx');
  expect(codes).toContain('npm install -g nx');
  expect(codes).toContain('yarn global add nx');
});
