import React from 'react';
import { getCookbookConfig } from '../cookbook.config';
import { ExternalLink } from './external-link';

export function WorkshopSessions() {
  const { workshopUrl } = getCookbookConfig();
  return (
    <>
      <iframe
        title="Pragmatic Angular Testing Workshops"
        width="100%"
        height="650"
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        style={{ border: 0 }}
        src="https://luma.com/embed/calendar/cal-2eC1KNf0fJvuxXY/events?lt=light&tag=angular-testing"
      ></iframe>

      <center>
        <ExternalLink
          href={workshopUrl}
          medium="in-article"
          content="workshop-sessions-link"
        >
          <strong>
            <span role="img" aria-label="arrow">
              👉
            </span>
            SEE THE FULL PROGRAM
            <span role="img" aria-label="arrow">
              👈
            </span>
          </strong>
        </ExternalLink>
      </center>
    </>
  );
}
