import React from 'react';

export default function Highlight({children, color = 'var(--ifm-color-primary-darker)'}) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: '#fff',
        padding: '0.2rem',
        marginRight: '0.2rem',
      }}>
      {children}
    </span>
  );
}
