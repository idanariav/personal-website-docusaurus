import Layout from '@theme/Layout';
import { useThemeConfig } from '@docusaurus/theme-common';
import PageHero from '../components/common/PageHero';
import Contact from '../components/contact/Contact';
import styles from './contactPage.module.css';

const REASONS = [
  'Exploring collaborations or opportunities',
  'Setting up a personal or team knowledge system',
  'Sharing feedback, questions, or just starting a conversation',
];

export default function ContactPage() {
  const { footer } = useThemeConfig();
  const elsewhere = footer?.links?.[1]?.items ?? [];

  return (
    <Layout title="Contact" description="Let's get in touch!">
      <PageHero
        eyebrow="don't be a stranger"
        title="Say hi."
        subtitle="I read everything that lands in my inbox. Write me if you're:"
        columns="0.9fr 1.1fr"
        gap="72px"
        alignItems="start"
        visual={<Contact />}
      >
        <ul className={styles.reasons}>
          {REASONS.map((reason) => (
            <li key={reason}>
              <span className="eyebrow">→</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
        <div className={styles.socials}>
          {elsewhere.map((item) => (
            <a key={item.label} href={item.href} className={styles.socialLink}>
              {item.label}
            </a>
          ))}
        </div>
      </PageHero>
    </Layout>
  );
}
