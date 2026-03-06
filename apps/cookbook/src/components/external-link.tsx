import React from 'react';
import { toUrlWithUtm, type UtmMedium } from '../util/to-url-with-utm';

interface ExternalLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  medium?: UtmMedium;
  campaign?: string;
  content?: string;
}

export function ExternalLink({
  href,
  children,
  className,
  medium,
  campaign,
  content,
}: ExternalLinkProps) {
  return (
    <a
      className={className}
      href={toUrlWithUtm(href, { medium, campaign, content })}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
