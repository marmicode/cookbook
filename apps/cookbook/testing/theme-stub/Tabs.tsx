import React from 'react';

export default function Tabs({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-testid="Tabs" data-props={JSON.stringify(props)}>
      {children}
    </div>
  );
}
