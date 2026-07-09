import Link from '@docusaurus/Link';
import BlogThumbnail from './BlogThumbnail';
import styles from './FeaturedIssue.module.css';

export default function FeaturedIssue({ item }) {
  const { metadata, frontMatter } = item.content;
  const { title, permalink, formattedDate, readingTime, description } = metadata;
  const excerpt = frontMatter.Description || description;

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div>
          <div className={styles.metaRow}>
            <span className={styles.chip}>Latest issue</span>
            <span>
              {formattedDate}
              {readingTime ? ` · ${Math.ceil(readingTime)} min read` : ''}
            </span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
          <Link to={permalink} className={styles.readLink}>Read the issue →</Link>
        </div>
        <div className={styles.thumbSlot}>
          <BlogThumbnail item={item} size="md" />
        </div>
      </div>
    </section>
  );
}
