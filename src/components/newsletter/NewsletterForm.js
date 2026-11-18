import { useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './NewsletterForm.module.css';

const DEFAULT_LABELS = {
  hero: 'Subscribe',
  section: 'Get the next sketch',
  footer: 'Join',
};

/**
 * Submits to Kit in place (Kit's endpoint allows cross-origin JSON requests) so the visitor stays on the site.
 * Kit answers `status: "success"` for a normal signup; when it wants a bot check (`status: "quarantined"`)
 * it returns a guard-page `url`, which we follow. Any other failure falls back to a plain form post.
 */
export default function NewsletterForm({ variant = 'hero', buttonLabel, className }) {
  const { siteConfig } = useDocusaurusContext();
  const { action, method, emailFieldName, submitButtonName } = siteConfig.customFields.newsletter;
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStatus('done');
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      throw new Error(`Unexpected Kit response: ${data.status}`);
    } catch {
      form.target = '_self';
      form.submit();
    }
  };

  if (status === 'done') {
    return (
      <div className={clsx(styles.success, styles[variant], className)} role="status">
        Almost there — check your inbox to confirm your subscription.
      </div>
    );
  }

  return (
    <form
      action={action}
      method={method}
      onSubmit={onSubmit}
      className={clsx(styles.form, styles[variant], className)}
    >
      <input
        name={emailFieldName}
        type="email"
        placeholder="Your email"
        required
        className={styles.input}
      />
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input
          type="text"
          name="b_4ed0fd1909674fddee53ac3e7_dfdcae99f5"
          tabIndex={-1}
          value=""
          readOnly
        />
      </div>
      <button type="submit" name={submitButtonName} className={styles.button} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : buttonLabel || DEFAULT_LABELS[variant]}
      </button>
    </form>
  );
}
