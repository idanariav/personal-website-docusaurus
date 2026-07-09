import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import NewsletterForm from '../newsletter/NewsletterForm';
import styles from './FullFooter.module.css';

export default function FullFooter() {
  const { footer } = useThemeConfig();
  if (!footer) return null;

  const [exploreGroup, elsewhereGroup] = footer.links;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.about}>
            <div className={styles.wordmark}>Philosopher&apos;s Code</div>
            <p className={styles.tagline}>One idea, one sketch, straight to your inbox.</p>
            <NewsletterForm variant="footer" />
          </div>
          <div className={styles.group}>
            <span className={styles.groupTitle}>{exploreGroup?.title}</span>
            {exploreGroup?.items.map((item) => (
              <Link key={item.label} to={item.to} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className={styles.group}>
            <span className={styles.groupTitle}>{elsewhereGroup?.title}</span>
            {elsewhereGroup?.items.map((item) => (
              <a key={item.label} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.copyright}>{footer.copyright}</div>
      </div>
    </footer>
  );
}
