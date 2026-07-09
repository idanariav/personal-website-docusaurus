// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
require('dotenv').config();
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  future: {
    faster: true,
    v4: true
  },
  title: 'Idan Ariav',
  tagline: 'Helping you convert information into actionable knowledge',
  favicon: 'general/favicon.ico',

  // Set the production url of your site here
  url: 'https://idanariav.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'idanariav', // Usually your GitHub org/user name.
  projectName: 'personal-website-docusaurus', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
    { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossorigin: 'anonymous' },
    {
      href: 'https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@600;700&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Caveat:wght@500;600&display=swap',
      rel: 'stylesheet',
    },
  ],

  customFields: {
    newsletter: {
      action:
        "https://app.kit.com/forms/7368246/subscriptions",
      method: "post",
      emailFieldName: "email_address",
      firstNameFieldName: "first_name",
      submitButtonName: "subscribe",
    },
    formAPI: process.env.FORM_SPREE
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './scripts/sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
        gtag: {
          trackingID: 'G-G5X7Y587HZ',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Declare some <meta> tags
      metadata: [
        { name: 'keywords', content: 'personal website, visual notes, practical philosophy, who we are, peaceful living, creative life' },
        { name: 'description', content: 'Sketches and essays on who we are, peaceful living, and creative life — practical philosophy for everyday life.' },
        { name: 'author', content: 'Idan Ariav' },
        { name: 'robots', content: 'index, follow' }, // Allow indexing
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, // Helps with responsive design
        { name: 'og:title', content: 'Philosopher\'s Code – Practical Philosophy for everyday life' },
        { name: 'og:description', content: 'Sketches and essays on who we are, peaceful living, and creative life.' },
        { name: 'og:image', content: 'https://idanariav.com/general/website-social-card.png' },
        { name: 'og:url', content: 'https://idanariav.com/' },
        { name: 'og:type', content: 'website' }],
      headTags: [
        // Declare some json-ld structured data
        {
      tagName: 'script', // Tells Docusaurus to create a <script> tag
      attributes: {
        type: 'application/ld+json', // Specifies this is JSON-LD (structured data, not executable JS)
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org', // Tells the parser to use Schema.org's vocabulary
        '@type': 'Person',               // You're describing a "Person" type (vs Organization, Article, etc.)
        name: 'Idan Ariav',               // Your full name
        url: 'https://idanariav.com/',     // Your personal website or portfolio
        sameAs: [                        // Other web profiles associated with you
          'https://www.linkedin.com/in/idan-ariav/',
          'https://github.com/idanariav'
        ],
        jobTitle: 'Data Analyst, Knowledge Management Consultant',        // Your role or profession
      })
    }],
      image: "general/website-social-card.png",
      navbar: {
        hideOnScroll: false,
        title: 'Philosopher\'s Code',
        items: [
          {
            to: '/sketches',
            label: 'Visuals',
            position: 'left',
          },
          {
            to: '/blog',
            label: 'Newsletter',
            position: 'left',
          },
          {
            to: '/docs/welcome',
            label: 'Knowledge Vault',
            position: 'left',
            className: 'navbar__link--muted',
          },
          {
            to: '/about',
            label: 'About',
            position: 'left',
            className: 'navbar__link--muted',
          },
          {
            to: '/contactPage',
            label: 'Say hi',
            position: 'left',
            className: 'navbar__link--cta',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Explore',
            items: [
              {
                label: 'Visuals',
                to: '/sketches',
              },
              {
                label: 'Newsletter',
                to: '/blog',
              },
              {
                label: 'Knowledge Vault',
                to: '/docs/welcome',
              },
              {
                label: 'Contact',
                to: '/contactPage',
              },
            ],
          },
          {
            title: 'Elsewhere',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/idan-ariav/',
              },
              {
                label: 'X (Twitter)',
                href: 'https://x.com/ariav_idan',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/idanariav',
              },
              {
                label: 'Medium',
                href: 'https://medium.com/@idanariav',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Idan Ariav`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    }}),
    themes: [
      [
        "@easyops-cn/docusaurus-search-local",
        /** @type {Partial<import("@easyops-cn/docusaurus-search-local").PluginOptions>} */
        ({
          hashed: true,
        }),
      ],
    ],
};

export default config;