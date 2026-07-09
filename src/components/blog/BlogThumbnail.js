import { useRef, useState, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { BlogPostProvider } from '@docusaurus/plugin-content-blog/client';
import styles from './BlogThumbnail.module.css';

// Blog post images live under inconsistent folders (/posts, /blogs, /notes) and
// their filenames don't reliably match the post's slug or source filename, so
// there's no reliable path to guess. Instead, render the post's own (already
// truncated) content and let CSS surface just its first image.
export default function BlogThumbnail({ item, size = 'md' }) {
  const Content = item.content;
  const ref = useRef(null);
  const [hasImage, setHasImage] = useState(true);

  useLayoutEffect(() => {
    if (ref.current && !ref.current.querySelector('img')) {
      setHasImage(false);
    }
  }, []);

  return (
    <div ref={ref} className={clsx(styles.thumb, styles[size], !hasImage && styles.placeholder)}>
      <BlogPostProvider content={item.content}>
        <Content />
      </BlogPostProvider>
    </div>
  );
}
