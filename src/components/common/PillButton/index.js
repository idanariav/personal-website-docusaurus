import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function PillButton({
  variant = 'primary',
  href,
  to,
  type,
  onClick,
  children,
  className,
  ...rest
}) {
  const cls = clsx(styles.pill, variant === 'primary' ? styles.primary : styles.secondary, className);
  const target = to || href;

  if (target) {
    if (/^https?:\/\//.test(target) || target.startsWith('mailto:')) {
      return (
        <a href={target} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link to={target} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type || 'button'} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}
