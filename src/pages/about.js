import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { Container, Grid } from '@mui/material';
import styles from './about.module.css';

const pillars = [
  {
    icon: '🤖',
    title: 'AI Systems & Data Engineering',
    body: 'I create, evaluate, and integrate AI-powered systems — from data pipelines and dashboards to LLM-native CLI tools. Recent work includes building PKM tools for LLM agents: qmd (semantic document search), qnode (knowledge graph), qvoid (vector store), and qimg (image search).',
    linkLabel: 'My Portfolio →',
    linkHref: 'https://github.com/idanariav/Idans_portfolio',
    external: true,
  },
  {
    icon: '🧠',
    title: 'Knowledge Management',
    body: 'I design systems to capture, organize, and resurface ideas. Whether developing PKM workflows or helping teams retain institutional wisdom, I believe how we manage knowledge shapes what we can create.',
    linkLabel: 'Free Obsidian Starter Kit →',
    linkHref: 'https://ko-fi.com/s/8e6f6ccefc',
    external: true,
  },
  {
    icon: '🎨',
    title: "Philosopher's Code",
    body: "I write a newsletter exploring ideas at the intersection of philosophy, productivity, and personal growth — translating timeless questions into practical insights, often brought to life through visual sketches.",
    linkLabel: 'Read the latest issue →',
    linkHref: '/blog',
    external: false,
  },
];

function PillarCard({ icon, title, body, linkLabel, linkHref, external }) {
  return (
    <Grid item xs={12} md={4}>
      <div className={styles.pillarCard}>
        <div className={styles.pillarIcon}>{icon}</div>
        <Heading as="h3" className={styles.pillarTitle}>{title}</Heading>
        <p className={styles.pillarBody}>{body}</p>
        {external ? (
          <a href={linkHref} className={styles.pillarLink} target="_blank" rel="noopener noreferrer">
            {linkLabel}
          </a>
        ) : (
          <Link to={linkHref} className={styles.pillarLink}>{linkLabel}</Link>
        )}
      </div>
    </Grid>
  );
}

export default function About() {
  return (
    <Layout
      title="About Me"
      description="Learn more about Idan Ariav — data analyst, knowledge management consultant, and author of Philosopher's Code."
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container text--center">
          <Heading as="h1" className={styles.title}>About Me</Heading>
          <p className={styles.tagline}>
            Hey, I'm Idan — a curious thinker with a passion for bringing clarity to how we work, think, and act.
          </p>
        </div>
      </header>

      <section className={styles.pillarsSection}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {pillars.map((pillar, idx) => (
              <PillarCard key={idx} {...pillar} />
            ))}
          </Grid>
        </Container>
      </section>

      <section className={styles.connectSection}>
        <Container maxWidth="sm">
          <Heading as="h2" className={styles.connectTitle}>Let's Connect</Heading>
          <p className={styles.connectBody}>
            Whether you're exploring job opportunities, looking for help setting up a knowledge management system, or just want to have a conversation — I'd love to hear from you.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/contactPage" className={styles.ctaButton}>Get in Touch</Link>
            <Link to="/blog" className={styles.ctaButtonOutline}>Read the Newsletter</Link>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
