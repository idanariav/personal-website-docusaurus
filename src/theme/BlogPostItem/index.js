import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import styles from '../../components/blog/Blog.module.css';

function TagsRow({tags}) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={styles.blogTags}>
      <span style={{marginRight: '0.5em', fontWeight: 500}}>Tags:</span>
      {tags.map(tag => (
        <Link
          key={tag.label}
          className={styles.blogTag}
          to={tag.permalink}
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogPostItem({children, className}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {title, formattedDate, date, readingTime, tags, permalink} = metadata;

  // Use formattedDate if available, otherwise format the raw date
  const displayDate = formattedDate || formatDate(date);

  const cardClass = !isBlogPostPage ? styles.blogCard : undefined;

  return (
    <BlogPostItemContainer className={clsx(cardClass, className)}>
      <div className={styles.blogCardContent} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
          {/* Centered title only */}
          <div className={styles.blogCardTitle}>
            <h1>
              <Link to={permalink}>{title}</Link>
            </h1>
          </div>
          {/* Meta and tags row */}
          <div className={styles.blogMetaRow}>
            <div className={styles.blogMeta} style={{justifyContent: 'flex-start'}}>
              <span>{displayDate}</span>
              {readingTime && (
                <span style={{marginLeft: '0.25em'}}>
                  · {Math.ceil(readingTime)} min read
                </span>
              )}
            </div>
            <TagsRow tags={tags} />
          </div>
          <BlogPostItemContent>{children}</BlogPostItemContent>
        </div>
        {/* "Read More" button at bottom center (always on list page) */}
        {!isBlogPostPage && (
          <div className={styles.readMoreWrapper}>
            <Link className={styles.readMoreButton} to={permalink}>
              Read More
            </Link>
          </div>
        )}
      </div>
      {/* Only show footer (with tags) on the blog post page */}
      {isBlogPostPage && <BlogPostItemFooter />}
    </BlogPostItemContainer>
  );
}
