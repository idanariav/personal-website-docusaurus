import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Container } from '@mui/material';
import PageHero from '../components/common/PageHero';
import PillButton from '../components/common/PillButton';
import styles from './about.module.css';

const pillars = [
  {
    kicker: 'the pen',
    title: 'Visual Notes',
    body: 'I turn complicated ideas into simple, hand-drawn sketches — exploring who we are, peaceful living, and creative life.',
    linkLabel: 'See the sketchbook →',
    linkHref: '/sketches',
    external: false,
  },
  {
    kicker: 'the code',
    title: "Philosopher's Code",
    body: "Each sketch comes from somewhere — a newsletter exploring who we are, peaceful living, and creative life, translating timeless questions into practical insights.",
    linkLabel: 'Read the latest issue →',
    linkHref: '/blog',
    external: false,
  },
  {
    kicker: 'the system',
    title: 'Knowledge Management',
    body: 'Behind the scenes, I build PKM systems to capture, organize, and resurface ideas — the vault where these sketches and essays actually live and connect.',
    linkLabel: 'Explore the Knowledge Vault →',
    linkHref: '/docs/welcome',
    external: false,
  },
];

function PillarCard({ kicker, title, body, linkLabel, linkHref, external, rotate }) {
  return (
    <div className={styles.pillarCard} style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="eyebrow">{kicker}</div>
      <h3 className={styles.pillarTitle}>{title}</h3>
      <p className={styles.pillarBody}>{body}</p>
      {external ? (
        <a href={linkHref} className={styles.pillarLink} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      ) : (
        <Link to={linkHref} className={styles.pillarLink}>{linkLabel}</Link>
      )}
    </div>
  );
}

export default function About() {
  return (
    <Layout
      title="About Me"
      description="Learn more about Idan Ariav — data analyst, knowledge management consultant, and author of Philosopher's Code."
    >
      <PageHero
        eyebrow="nice to meet you"
        title="I'm Idan."
        subtitle="A curious thinker with a passion for bringing clarity to how we live, think, and act."
        columns="auto 1fr"
        gap="56px"
        reverse
        visual={
          <div className={styles.photoWrap}>
            <img src="/general/profile_photo.jpg" alt="Idan Ariav" className={styles.photo} />
            <div className={`caption ${styles.photoCaption}`}></div>
          </div>
        }
      />

      <section className={styles.pillarsSection}>
        <Container maxWidth="lg">
          <div className={styles.pillarsGrid}>
            {pillars.map((pillar, idx) => (
              <PillarCard key={pillar.title} {...pillar} rotate={idx % 2 === 0 ? -0.5 : 0.6} />
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.connectSection}>
        <Container maxWidth="sm">
          <h2 className={styles.connectTitle}>Let&apos;s connect</h2>
          <p className={styles.connectBody}>
            Exploring opportunities, setting up a knowledge system, or just want to talk about ideas — I&apos;d love to hear from you.
          </p>
          <div className={styles.ctaRow}>
            <PillButton variant="primary" to="/contactPage">Get in touch</PillButton>
            <PillButton variant="secondary" to="/blog">Read the newsletter</PillButton>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
