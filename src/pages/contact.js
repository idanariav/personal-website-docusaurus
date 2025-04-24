import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 👉 You can integrate with Formspree, EmailJS, etc. here
    console.log('Submitted data:', formData);
    setSubmitted(true);
  };

  return (
    <Layout title="Contact" description="Get in touch with Idan">
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
        <h1>Contact Me</h1>
        {submitted ? (
          <p>Thank you for reaching out! I'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Message</label>
              <textarea
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem' }}
              ></textarea>
            </div>
            <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
              Send
            </button>
          </form>
        )}
      </main>
    </Layout>
  );
}
