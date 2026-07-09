import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PageHero from '../components/common/PageHero';
import SketchFrame from '../components/common/SketchFrame';
import NewsletterForm from '../components/newsletter/NewsletterForm';
import { sketches as sketchData } from '@site/src/data/sketches';
import styles from './sketches.module.css';

function SketchGallery() {
  return (
    <section className={styles.gallerySection}>
      <div className={styles.grid}>
        {sketchData.map((sketch, idx) => (
          <SketchFrame
            key={sketch.title}
            src={useBaseUrl(sketch.image)}
            alt={sketch.title}
            caption={sketch.title}
            href={sketch.link}
            rotate={idx % 2 === 0 ? -0.7 : 0.7}
          />
        ))}
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className={styles.closingSection}>
      <div className={styles.closingInner}>
        <img src={useBaseUrl('/general/profile_photo.jpg')} alt="Idan Ariav" className={styles.closingPhoto} />
        <p className={styles.closingBlurb}>
          I&apos;m Idan — I like turning complicated ideas into simple visuals that spark new ways
          of thinking. If one of these made you pause or smile, there&apos;s more where that came from:
        </p>
        <NewsletterForm variant="section" className={styles.closingForm} />
      </div>
    </section>
  );
}

export default function Sketches() {
  return (
    <Layout
      title="Visual Notes"
      description="Life's big questions, answered with a pen — sketches about who we are, peaceful living, and creative life."
    >
      <PageHero
        align="center"
        maxWidth={820}
        title="Visual Notes"
        subtitle="Life's big questions, answered with a pen — sketches about who we are, peaceful living, and creative life."
      >
        <div className={`eyebrow ${styles.scrollCue}`}>↓ scroll, wander, smile ↓</div>
      </PageHero>
      <SketchGallery />
      <ClosingSection />
    </Layout>
  );
}
