import Layout from '@theme/Layout';
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import PageHero from '../../components/common/PageHero';
import PillButton from '../../components/common/PillButton';
import FullFooter from '../../components/footer/FullFooter';
import FeaturedIssue from '../../components/blog/FeaturedIssue';
import IssueRowList from '../../components/blog/IssueRowList';
import styles from '../../components/blog/Blog.module.css';

export default function BlogListPage(props) {
  const { items, metadata } = props;
  const isFirstPage = metadata.page === 1;
  const [featured, ...rest] = items;
  const listItems = isFirstPage && featured ? rest : items;

  return (
    <HtmlClassNameProvider
      className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage}`}
    >
      <PageMetadata title={metadata.blogTitle} description={metadata.blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <Layout noFooter>
        <PageHero
          align="center"
          maxWidth={760}
          eyebrow="the newsletter archive"
          title="Philosopher's Code"
          subtitle="Short essays on who we are, peaceful living, and creative life — each with a sketch. Read a few, then get the next one in your inbox."
        />
        {isFirstPage && featured && <FeaturedIssue item={featured} />}
        <IssueRowList items={listItems} />
        {metadata.nextPage && (
          <div className={styles.paginationRow}>
            <PillButton variant="secondary" to={metadata.nextPage}>Browse all issues</PillButton>
          </div>
        )}
        <FullFooter />
      </Layout>
    </HtmlClassNameProvider>
  );
}
