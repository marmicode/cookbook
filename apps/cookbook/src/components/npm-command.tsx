import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function NpmCommand({ args }: { args: string | ArgsRecord }) {
  const argsRecord: ArgsRecord =
    typeof args === 'string'
      ? {
          bun: args,
          npm: args,
          pnpm: args,
          yarn: args,
        }
      : args;

  return (
    <Tabs>
      {packageManagers.map((packageManager) => (
        <TabItem
          key={packageManager}
          label={packageManager}
          value={packageManager}
        >
          <CodeBlock language="sh">{`${packageManager} ${argsRecord[packageManager]}`}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

interface ArgsRecord {
  bun: string;
  npm: string;
  pnpm: string;
  yarn: string;
}
type PackageManager = keyof ArgsRecord;
const packageManagers: PackageManager[] = ['bun', 'pnpm', 'npm', 'yarn'];
