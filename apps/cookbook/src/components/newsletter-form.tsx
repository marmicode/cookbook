import { useRef, useState, type React } from 'react';
import styles from './newsletter-form.module.css';

export function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);

  const handleChange = () => {
    setIsValid(formRef.current?.checkValidity() ?? false);
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
        <h2 id="footer-newsletter" className={styles.title}>
          <span role="img" aria-label="notification">
            🔔
          </span>
          <span> Want me to notify you when I drop new recipes?</span>
        </h2>
        <form
          action="https://marmicode.us3.list-manage.com/subscribe/post?u=915d6ba70c9c00912ba326214&id=71255f30c7&f_id=00dbc1e5f0"
          aria-label="Newsletter registration form"
          className={styles.form}
          method="post"
          ref={formRef}
          rel="noopener"
          target="_blank"
        >
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: '-5000px' }}
          >
            <input
              name="b_915d6ba70c9c00912ba326214_71255f30c7"
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
              value="10770715"
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
