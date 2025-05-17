import type { WrapperProps } from '@docusaurus/types';
import { SpecialOffers } from '@site/src/components/special-offers';
import Tree from '@theme-original/TOCItems/Tree';
import type TreeType from '@theme/TOCItems/Tree';
import React, { ReactElement } from 'react';

type Props = WrapperProps<typeof TreeType>;

export default function TreeWrapper(props: Props): ReactElement {
  return (
    <>
      <Tree {...props} />
      <SpecialOffers />
    </>
  );
}
