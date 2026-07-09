import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import PageHero from '../components/common/PageHero';
import SketchFrame from '../components/common/SketchFrame';
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
          src={useBaseUrl('/notes/clarity.webp')}
          alt="Clarity — a hand-drawn map sketch"
          caption="Clarity"
          captionInside
          rotate={1.5}
          size="lg"
          tape
        />
      }
    >
      <NewsletterForm variant="hero" />
      <div className={styles.finePrint}>
        Join the journey. Starts with the <em>Five Quests for a Philosophical Life</em> guide.
      </div>
    </PageHero>
  );
}

function SketchbookBand() {
  const featured = sketchData.slice(0, 3);
  return (
    <section className={styles.sketchbookSection}>
      <div className={styles.sketchbookInner}>
        <div className={styles.sketchbookHeader}>
          <h2 className={styles.sketchbookTitle}>Fresh from the sketchbook</h2>
          <Link to="/sketches" className={styles.seeAllLink}>See all visuals →</Link>
        </div>
        <div className={styles.grid}>
          {featured.map((sketch, idx) => (
            <SketchFrame
              key={sketch.title}
              src={useBaseUrl(sketch.image)}
              alt={sketch.title}
              caption={sketch.title}
              href={sketch.link}
              rotate={idx % 2 === 0 ? -0.8 : 0.7}
            />
          ))}
        </div>
      </div>
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
          life&apos;s challenges. Off the canvas, I build pkm systems to convert thinking into creating.
        </p>
        <div className={styles.aboutLinks}>
          <Link to="/about" className={styles.aboutLink}>More about me →</Link>
          <Link to="/docs/welcome" className={styles.aboutLink}>Explore the Knowledge Vault →</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Idan Ariav"
      description="Sketches and essays on who we are, peaceful living, and creative life — practical philosophy for everyday life."
      noFooter
    >
      <HomepageHero />
      <SketchbookBand />
      <AboutStrip />
      <FullFooter />
    </Layout>
  );
}
