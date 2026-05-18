import clsx from 'clsx';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './sketches.module.css';
import { Container, Grid, Card, CardMedia, CardActionArea } from "@mui/material";
import { sketches as sketchData } from '@site/src/data/sketches';

function SketchesHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container text--center">
        <Heading as="h1" className={styles.title}>
          Visual Notes
        </Heading>
        <p className={styles.tagline}>
          Bringing insight to life with simple visuals.
        </p>
      </div>
    </header>
  );
}

function SketchCard({ title, image, link }) {
  const resolvedImage = useBaseUrl(image);
  const cardContent = (
    <CardMedia
      component="img"
      image={resolvedImage}
      alt={title}
      className={styles.sketchImage}
    />
  );
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={styles.sketchCard}>
        {link ? (
          <CardActionArea href={link}>{cardContent}</CardActionArea>
        ) : (
          cardContent
        )}
      </Card>
      <h3 className={styles.sketchTitle}>{title}</h3>
    </Grid>
  );
}

function SketchGallery() {
  return (
    <section className={styles.gallerySection}>
      <Container maxWidth="lg">
        <Heading as="h2" className={styles.galleryTitle}>
          Recent Works
        </Heading>
        <Grid container spacing={3} justifyContent="center">
          {sketchData.map((sketch, idx) => (
            <SketchCard key={idx} {...sketch} />
          ))}
        </Grid>
      </Container>
    </section>
  );
}

function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <Container maxWidth="sm">
        <div className={styles.aboutContent}>
          <p>
            I’m Idan - a curious person who likes turning complicated ideas into simple visuals.
            My goal has always been to spark new ways of thinking about life's challenges,
            and what better way is there than through visuals? 
            I hope you'll find something here that resonates with you,
            that piques your curiosity, or simply makes you smile.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default function Sketches() {
  return (
    <Layout
      title="Visuals & Sketches"
      description="Bringing insight to life with simple visuals"
    >
      <SketchesHeader />
      <SketchGallery />
      <AboutSection />
    </Layout>
  );
}
