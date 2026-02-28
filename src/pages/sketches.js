import clsx from 'clsx';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './sketches.module.css';
import { Container, Grid, Card, CardMedia, CardActionArea } from "@mui/material";

function SketchesHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container text--center">
        <Heading as="h1" className={styles.title}>
          Idan Ariav
        </Heading>
        <p className={styles.tagline}>
          Bringing insight to life with simple visuals.
        </p>
      </div>
    </header>
  );
}

function SketchGallery() {
  // Portfolio items with thumbnail images
  const sketches = [
    {
      id: 1,
      title: "Clarity",
      image: useBaseUrl('/notes/clarity.webp'),
      link: "/docs/welcome"
    },
    {
      id: 2,
      title: "Deontology",
      image: useBaseUrl('/notes/deontology.webp'),
      link: "/blog"
    },
    {
      id: 3,
      title: "Curiosity",
      image: useBaseUrl('/notes/curiosity.webp'),
      link: "/docs"
    },
  ];

  return (
    <section className={styles.gallerySection}>
      <Container maxWidth="md">
        <Heading as="h2" className={styles.galleryTitle}>
          Recent Works
        </Heading>
        <Grid container spacing={3} justifyContent="center">
          {sketches.map((sketch) => (
            <Grid item xs={12} sm={sketch.id === 1 ? 12 : 6} md={sketch.id === 1 ? 12 : 6} key={sketch.id}>
              <Card className={styles.sketchCard}>
                <CardActionArea href={sketch.link}>
                  <CardMedia
                    component="img"
                    image={sketch.image}
                    alt={sketch.title}
                    className={styles.sketchImage}
                  />
                </CardActionArea>
              </Card>
              <p className={styles.sketchTitle}>{sketch.title}</p>
            </Grid>
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
