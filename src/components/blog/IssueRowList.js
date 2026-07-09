import Link from '@docusaurus/Link';
import BlogThumbnail from './BlogThumbnail';
import styles from './IssueRowList.module.css';

export default function IssueRowList({ items, heading = 'Earlier issues' }) {
  if (items.length === 0) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{heading}</h3>
      <div className={styles.list}>
        {items.map((item) => {
          const { metadata, frontMatter } = item.content;
          const { title, permalink, formattedDate, tags, description } = metadata;
          const excerpt = frontMatter.Description || description;
          return (
            <Link to={permalink} key={permalink} className={styles.row}>
              <BlogThumbnail item={item} size="sm" />
              <div>
                <div className={styles.rowTitle}>{title}</div>
                {excerpt && <div className={styles.rowExcerpt}>{excerpt}</div>}
              </div>
              <div className={styles.rowMeta}>
                {formattedDate}
                {tags?.[0] && (
                  <>
                    <br />
                    <span className={styles.tag}>{tags[0].label}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
