import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './NewsletterForm.module.css';

const DEFAULT_LABELS = {
  hero: 'Subscribe',
  section: 'Get the next sketch',
  footer: 'Join',
};

export default function NewsletterForm({ variant = 'hero', buttonLabel, className }) {
  const { siteConfig } = useDocusaurusContext();
  const { action, method, emailFieldName, submitButtonName } = siteConfig.customFields.newsletter;

  return (
    <form
      action={action}
      method={method}
      target="_blank"
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
      <button type="submit" name={submitButtonName} className={styles.button}>
        {buttonLabel || DEFAULT_LABELS[variant]}
      </button>
    </form>
  );
}
