import React from 'react';
import BlogListPage from '@theme-original/BlogListPage';
import styles from '../../components/blog/Blog.module.css';

export default function BlogListPageWrapper(props) {
  return (
    <div className={styles['blog-list-page']}>
      <BlogListPage {...props} />
    </div>
  );
}