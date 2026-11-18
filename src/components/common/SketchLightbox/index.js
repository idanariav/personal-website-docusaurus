import { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * Full-size view of one sketch, with prev/next navigation.
 * Controlled: the parent owns `index` (null = closed) and passes `onNavigate(newIndex)` / `onClose()`.
 * `subscribeHref` points at the page's newsletter form (an in-page anchor).
 */
export default function SketchLightbox({ items, index, onNavigate, onClose, subscribeHref = '#subscribe' }) {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const isOpen = index !== null && index !== undefined;
  const item = isOpen ? items[index] : null;
  const imageUrl = useBaseUrl(item?.image ?? '/');
  const count = items.length;

  const go = (delta) => onNavigate((index + delta + count) % count);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  if (!isOpen) return null;

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
        ×
      </button>
      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous sketch">
        ←
      </button>

      <figure className={styles.figure}>
        <img src={imageUrl} alt={item.title} className={styles.image} />
        <figcaption className={styles.caption}>
          <span className={styles.title}>{item.title}</span>
          {item.idea && <span className={styles.idea}>{item.idea}</span>}
          <span className={styles.actions}>
            {item.link && (
              <Link to={item.link} className={styles.secondaryLink}>
                Read the full idea →
              </Link>
            )}
            <a href={subscribeHref} className={styles.subscribeLink} onClick={onClose}>
              Get the next sketch in your inbox →
            </a>
          </span>
          <span className={styles.counter}>
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>

      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Next sketch">
        →
      </button>
    </div>
  );
}
