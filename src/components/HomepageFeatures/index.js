import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: 'How can I help you?',
    link: '/contactPage',
    Svg: require('@site/static/general/mind_map_illustration.svg').default,
    description: (
      <>
        I specialize in knowledge management systems that convert information into clear, valuable insights  - reach out anytime
      </>
    ),
  },
  {
    title: 'Knowledge is power',
    link: '/docs/welcome',
    Svg: require('@site/static/general/knowledge_illustration.svg').default,
    description: (
      <>
        Dive into my knowledge vault - a collection of valuable resources and insights, from philosophy to productivity
      </>
    ),
  },
  {
    title: 'Join the Journey',
    link: '/blog',
    Svg: require('@site/static/general/newsletter_illustration.svg').default,
    description: (
      <>
      "Philosopher's Code" newsletter explores practical philosophy - join me on the journey of happiness, growth, and clarity
      </>
    ),
  },
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
      <Link to={link}>
          <Heading as="h3">{title}</Heading>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
