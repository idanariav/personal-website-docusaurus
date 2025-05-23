import React from 'react';
import Layout from '@theme/Layout';
import Contact from '../components/contact/Contact'; // Import the Contact component

export default function ContactPage() {
  return (
    <Layout title="Contact" description="Let's get in touch!">
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        <Contact /> {/* Use the Contact component here */}
      </main>
    </Layout>
  );
}
