import React from 'react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  medium?: 'footer' | 'in-article' | 'toc';
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
  const url = new URL(href);
  url.searchParams.set('utm_source', 'cookbook');
  if (medium) {
    url.searchParams.set('utm_medium', medium);
  }
  if (campaign) {
    url.searchParams.set('utm_campaign', campaign);
  }
  if (content) {
    url.searchParams.set('utm_content', content);
  }

  return (
    <a
      className={className}
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
