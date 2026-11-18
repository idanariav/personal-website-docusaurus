import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PageHero from '../components/common/PageHero';
import SketchFrame from '../components/common/SketchFrame';
import SketchLightbox from '../components/common/SketchLightbox';
import NewsletterForm from '../components/newsletter/NewsletterForm';
import { sketches as sketchData } from '@site/src/data/sketches';
import styles from './sketches.module.css';

const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Each open sketch gets its own shareable URL (/sketches#group-think).
function setHash(index) {
  const hash = index === null ? '' : `#${slugify(sketchData[index].title)}`;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
}

function SketchGallery() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    const idx = sketchData.findIndex((s) => slugify(s.title) === slug);
    if (idx >= 0) setOpenIndex(idx);
  }, []);

  const open = (idx) => {
    setOpenIndex(idx);
    setHash(idx);
  };
  const close = () => {
    setOpenIndex(null);
    setHash(null);
  };

  return (
    <section className={styles.gallerySection}>
      <div className={styles.grid}>
        {sketchData.map((sketch, idx) => (
          <SketchFrame
            key={sketch.title}
            src={useBaseUrl(sketch.image)}
            alt={sketch.title}
            caption={sketch.title}
            onClick={() => open(idx)}
            rotate={idx % 2 === 0 ? -0.7 : 0.7}
          />
        ))}
      </div>
      <SketchLightbox items={sketchData} index={openIndex} onNavigate={open} onClose={close} />
    </section>
  );
}

function ClosingSection() {
  return (
    <section id="subscribe" className={styles.closingSection}>
      <div className={styles.closingInner}>
        <img src={useBaseUrl('/general/profile_photo.jpg')} alt="Idan Ariav" className={styles.closingPhoto} />
        <p className={styles.closingBlurb}>
          I&apos;m Idan — I like turning complicated ideas into simple visuals that spark new ways
          of thinking. If one of these made you pause or smile, there&apos;s more in{' '}
          <strong>Philosopher&apos;s Code</strong>, my newsletter: one idea, one sketch, straight to your inbox.
        </p>
        <NewsletterForm variant="section" className={styles.closingForm} />
        <Link to="/blog" className={styles.pastIssues}>Read past issues →</Link>
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
        className={styles.hero}
      >
        <div className={styles.heroHint}>Tap any sketch to see it up close</div>
      </PageHero>
      <SketchGallery />
      <ClosingSection />
    </Layout>
  );
}
