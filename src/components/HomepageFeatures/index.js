import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: 'How can I help you?',
    link: 'https://docs.google.com/forms/d/e/1FAIpQLSegq_JHmtPSa7oXblPg4866E72IuEFVFZEeAKgGBqPQJo97RA/viewform?usp=sf_link',
    Svg: require('@site/static/general/resume_illusration.svg').default,
    description: (
      <>
        My goal is to help you make sense of the information that matters most to you.<br />
        I specialize in knowledge management systems that transforms information into clear, actionable insights.<br />
        Feel free to reach out if you have any questions or need assistance.
      </>
    ),
  },
  {
    title: 'Knowledge is power',
    link: '/docs/welcome', // todo - fix pointer
    Svg: require('@site/static/general/knowledge_illusration.svg').default,
    description: (
      <>
        I believe in the power of sharing knowledge to create a positive impact.<br />
        My knowledge vault is a collection of resources, insights, and tools that I have found valuable.<br />
        I invite you to explore and learn from my experiences.
      </>
    ),
  },
  {
    title: 'Join the Journey',
    link: 'https://philosophers-code.kit.com/76943a7d9d',
    Svg: require('@site/static/general/newsletter_illusation.svg').default,
    description: (
      <>
      Practical philosophy for everyday life, turning complex ideas
      into tools for happiness, growth and clarity.<br />
      Expand your mind and join the journey of self-discovery.
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
