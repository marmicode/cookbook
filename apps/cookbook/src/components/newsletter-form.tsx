import React, { useRef, useState } from 'react';
import { getCookbookConfig } from '../cookbook.config';
import styles from './newsletter-form.module.css';

type NewsletterFormProps = {
  onSubmit?: () => void;
};

export function NewsletterForm({ onSubmit }: NewsletterFormProps) {
  const { formAction, honeypotName, tag } = getCookbookConfig().newsletter;
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);

  const handleChange = () => {
    setIsValid(formRef.current?.checkValidity() ?? false);
  };

  const handleSubmit = () => {
    if (!formRef.current?.checkValidity()) {
      return;
    }

    onSubmit?.();
  };

  return (
    <section className={styles.container} aria-labelledby="footer-newsletter">
      <img
        className={styles.avatar}
        src="/img/younes-small.webp"
        alt="Younes Jaaidi"
        width="120"
        height="120"
      />
      <div className={styles.content}>
        <h2 className={styles.title}>
          <span aria-label="notification" role="img">
            🔔
          </span>
          <span> Want me to notify you when I drop new recipes?</span>
        </h2>
        <form
          action={formAction}
          aria-label="Newsletter registration form"
          className={styles.form}
          method="post"
          onSubmit={handleSubmit}
          ref={formRef}
          rel="noopener"
          target="_blank"
        >
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-5000px' }}
          >
            <input
              name={honeypotName}
              readOnly
              tabIndex={-1}
              type="text"
              value=""
            />
            <input
              name="tags"
              readOnly
              tabIndex={-1}
              type="hidden"
              value={tag}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              aria-label="Email address"
              autoComplete="email"
              className={styles.input}
              name="EMAIL"
              onChange={handleChange}
              placeholder="i-am@curious.dev"
              required
              type="email"
            />
            <button className={styles.button} disabled={!isValid} type="submit">
              NOTIFY ME
            </button>
          </div>
          <p className={styles.helperText}>
            ~1 email per month. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
