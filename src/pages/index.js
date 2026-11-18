import { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PageHero from '../components/common/PageHero';
import SketchFrame from '../components/common/SketchFrame';
import SketchLightbox from '../components/common/SketchLightbox';
import NewsletterForm from '../components/newsletter/NewsletterForm';
import FullFooter from '../components/footer/FullFooter';
import { sketches as sketchData } from '@site/src/data/sketches';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <PageHero
      eyebrow="Hi, I'm Idan — I draw ideas"
      title={<>Big ideas,<br />drawn simply.</>}
      subtitle={
        <>
          Sketches on who we are, peaceful living, and creative life.
        </>
      }
      visual={
        <SketchFrame
          src={useBaseUrl('/sketches/naming-a-phenomenon-gives-us-power-over-it-sketch.webp')}
          alt="Naming gives power — a hand-drawn sketch"
          caption="Naming Gives Power"
          captionInside
          rotate={1.5}
          size="lg"
          tape
        />
      }
    >
      <NewsletterForm variant="hero" />
      <div className={styles.finePrint}>
        Get <strong>Philosopher&apos;s Code</strong>, my newsletter: one idea, one sketch, straight to your inbox.{' '}
        <Link to="/blog" className={styles.finePrintLink}>Read past issues →</Link>
      </div>
    </PageHero>
  );
}

function FavoritesBand() {
  const featured = sketchData.slice(0, 3);
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className={styles.sketchbookSection}>
      <div className={styles.sketchbookInner}>
        <div className={styles.sketchbookHeader}>
          <h2 className={styles.sketchbookTitle}>Some of my favorites</h2>
          <Link to="/sketches" className={styles.seeAllLink}>See all visuals →</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((sketch, idx) => (
            <SketchFrame
              key={sketch.title}
              src={useBaseUrl(sketch.image)}
              alt={sketch.title}
              caption={sketch.title}
              onClick={() => setOpenIndex(idx)}
              rotate={idx % 2 === 0 ? -0.8 : 0.7}
            />
          ))}
        </div>
      </div>
      <SketchLightbox
        items={featured}
        index={openIndex}
        onNavigate={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}

function AboutStrip() {
  return (
    <section className={styles.aboutStrip}>
      <img src={useBaseUrl('/general/profile_photo.jpg')} alt="Idan Ariav" className={styles.aboutPhoto} />
      <div>
        <h2 className={styles.aboutTitle}>A curious person with a pen</h2>
        <p className={styles.aboutBody}>
          I turn complicated ideas into simple visuals — to spark new ways of thinking about
          life&apos;s challenges.
        </p>
        <div className={styles.aboutLinks}>
          <Link to="/about" className={styles.aboutLink}>More about me →</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Idan Ariav"
      description="Big ideas, drawn simply. Hand-drawn sketches on who we are, peaceful living, and creative life — plus Philosopher's Code, a newsletter with one idea and one sketch per issue."
      noFooter
    >
      <HomepageHero />
      <FavoritesBand />
      <AboutStrip />
      <FullFooter />
    </Layout>
  );
}
