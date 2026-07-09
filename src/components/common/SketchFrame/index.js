import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function SketchFrame({
  src,
  alt,
  caption,
  captionInside = false,
  rotate = 0,
  size = 'md',
  tape = false,
  href,
  className,
}) {
  const frame = (
    <div className={styles.wrapper}>
      {tape && <div className={styles.tape} />}
      <div className={clsx(styles.frame, styles[size])} style={{ transform: `rotate(${rotate}deg)` }}>
        <img src={src} alt={alt} className={styles.image} />
        {caption && captionInside && <div className={clsx('caption', styles.captionInside)}>{caption}</div>}
      </div>
      {caption && !captionInside && <div className={clsx('caption', styles.caption)}>{caption}</div>}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={clsx(styles.link, className)}>
        {frame}
      </Link>
    );
  }

  return <div className={className}>{frame}</div>;
}
