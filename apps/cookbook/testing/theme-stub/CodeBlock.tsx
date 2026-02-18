import React from 'react';

export default function CodeBlock({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-testid="CodeBlock" data-props={JSON.stringify(props)}>
      {children}
    </div>
  );
}
