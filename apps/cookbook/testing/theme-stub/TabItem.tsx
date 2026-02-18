import React from 'react';

export default function TabItem({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-testid="TabItem" data-props={JSON.stringify(props)}>
      {children}
    </div>
  );
}
