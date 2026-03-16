import { toUrlWithUtm } from './util/to-url-with-utm';

const WORKSHOP_EARLY_BIRD_END_DATE = new Date('2026-03-18');
const WORKSHOP_SALES_END_DATE = new Date('2026-03-31');

export function getCookbookConfig() {
  const workshopUrl =
    'https://marmicode.io/workshops/pragmatic-angular-testing';

  const now = new Date();
  const isEarlyBirdActive = now <= WORKSHOP_EARLY_BIRD_END_DATE;
  const earlyBirdEndDateString = _formatDateWithOrdinal(
    WORKSHOP_EARLY_BIRD_END_DATE,
  );
  const isWorkshopActive = now <= WORKSHOP_SALES_END_DATE;
  const workshopAnnouncementBarUrl = toUrlWithUtm(workshopUrl, {
    medium: 'announcement-bar',
    campaign: 'pragmatic-angular-testing',
  });

  return {
    courseUrl: 'https://courses.marmicode.io/courses/pragmatic-angular-testing',
    workshopUrl,
    announcement: isWorkshopActive
      ? {
          id: 'pragmatic-angular-testing-2026-04-01',
          content: `👨‍🍳 Vitest, zoneless, signals... Angular testing is changing fast. Join the <a href="${workshopAnnouncementBarUrl}" target="_blank" rel="noopener noreferrer"><b>Pragmatic Angular Testing</b></a> workshop on <b>April 1st</b>.${isEarlyBirdActive ? ` 🐣 Early bird pricing until <b>${earlyBirdEndDateString}!</b>` : ''}&nbsp;<a href="${workshopAnnouncementBarUrl}" target="_blank" rel="noopener noreferrer">Reserve your spot →</a>`,
        }
      : null,
    nextWorkshop: isWorkshopActive
      ? {
          inArticleUrl: toUrlWithUtm(workshopUrl, {
            campaign: 'pragmatic-angular-testing',
            medium: 'in-article',
          }),
        }
      : null,
  };
}

function _formatDateWithOrdinal(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const suffix =
    day > 3 && day < 21
      ? 'th'
      : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th';
  return `${month} ${day}${suffix}`;
}
