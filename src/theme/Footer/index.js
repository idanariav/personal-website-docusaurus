import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) return null;

  const [exploreGroup, elsewhereGroup] = footer.links;
  const links = [
    { label: 'Home', to: '/' },
    ...(exploreGroup?.items ?? []),
    ...(elsewhereGroup?.items ?? []).slice(0, 2),
  ];

  return (
    <footer className={styles.footer}>
      <span>{footer.copyright}</span>
      <div className={styles.links}>
        {links.map((item) =>
          item.to ? (
            <Link key={item.label} to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ),
        )}
      </div>
    </footer>
  );
}
