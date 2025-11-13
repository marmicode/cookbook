import { ExternalLink } from './external-link';

export function WorkshopSessions() {
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
          href="https://marmicode.io/workshops/pragmatic-angular-testing-full-course"
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
