import { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import DocCardList from '@theme/DocCardList';
import React from 'react';

export function TestingPrepStationV20(): JSX.Element {
  const items: PropSidebarItem[] = [
    {
      type: 'link',
      href: '/angular/testing/flushing-flusheffects',
      label: 'Flushing "flushEffects"',
    },
    {
      type: 'link',
      href: '/angular/testing/tests-error-sensitivity',
      label: 'Tests Error Sensitivity',
    },
  ];
  return <DocCardList items={items} />;
}
