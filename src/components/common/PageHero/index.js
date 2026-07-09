import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  align = 'split',
  maxWidth,
  columns = '1.05fr 0.95fr',
  gap = '72px',
  alignItems = 'center',
  reverse = false,
  visual,
  children,
  className,
}) {
  const isSplit = align === 'split';
  const style = {
    ...(maxWidth ? { maxWidth } : {}),
    ...(isSplit ? { gridTemplateColumns: columns, gap, alignItems } : {}),
  };

  return (
    <header
      className={clsx(styles.hero, isSplit ? styles.split : styles.center, className)}
      style={style}
    >
      {isSplit && reverse && visual && <div className={styles.visual}>{visual}</div>}
      <div className={styles.text}>
        {eyebrow && <div className={clsx('eyebrow', styles.eyebrow)}>{eyebrow}</div>}
        {title && (
          <Heading as="h1" className={styles.title}>
            {title}
          </Heading>
        )}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      {isSplit && !reverse && visual && <div className={styles.visual}>{visual}</div>}
    </header>
  );
}
