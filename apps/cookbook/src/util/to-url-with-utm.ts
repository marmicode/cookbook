export function toUrlWithUtm(
  url: string,
  {
    medium,
    campaign,
    content,
  }: {
    medium?: UtmMedium;
    campaign?: string;
    content?: string;
  },
) {
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm_source', 'cookbook');
  if (medium) {
    urlObj.searchParams.set('utm_medium', medium);
  }
  if (campaign) {
    urlObj.searchParams.set('utm_campaign', campaign);
  }
  if (content) {
    urlObj.searchParams.set('utm_content', content);
  }
  return urlObj.toString();
}

export type UtmMedium =
  | 'announcement-bar'
  | 'footer'
  | 'in-article'
  | 'navbar'
  | 'toc';
