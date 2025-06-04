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
    experimental_faster: true,
    v4: true
  },
  title: 'Idan Ariav',
  tagline: 'Helping you convert information into actionable knowledge',
  favicon: 'general/favicon.ico',

  // Set the production url of your site here
  url: 'https://idanariav.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/personal-website-docusaurus/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'idanariav', // Usually your GitHub org/user name.
  projectName: 'personal-website-docusaurus', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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
        { name: 'keywords', content: 'personal website, knowledge management, data analyst, practical philosophy' },
        { name: 'description', content: 'A site about self growth, practical philosophy, and knowledge management.' },
        { name: 'author', content: 'Idan Ariav' },
        { name: 'robots', content: 'index, follow' }, // Allow indexing
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, // Helps with responsive design
        { name: 'og:title', content: 'Philosopher\'s Code – Practical Philosophy for everyday life' },
        { name: 'og:description', content: 'Turning complex ideas into tools for happiness, growth, and clarity.' },
        //{ name: 'og:image', content: 'https://yoursite.com/social-preview.png' },
        { name: 'og:url', content: 'https://idanariav.github.io/personal-website-docusaurus/' },
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
        url: 'https://idanariav.github.io/personal-website-docusaurus/',     // Your personal website or portfolio
        sameAs: [                        // Other web profiles associated with you
          'https://www.linkedin.com/in/idan-ariav/',
          'https://github.com/idanariav/Idans_portfolio'
        ],
        jobTitle: 'Data Analyst, Knowledge Management Consultant',        // Your role or profession
      })
    }],
      image: "general/website-social-card.png",
      navbar: {
        hideOnScroll: true,
        title: 'Welcome',
        items: [
          {
            to: '/about', 
            label: 'About me', 
            position: 'left'
          }, 
          {
            to: '/docs/welcome',
            label: 'Knowledge Vault',
            position: 'left',
          },
          {
            to: '/blog', 
            label: 'Newsletter', 
            position: 'left'
          },
          {
            to: '/contactPage', 
            label: 'Contact', 
            position: 'left'},
          {
            href: 'https://github.com/idanariav/Idans_portfolio', 
            label: "Portfolio",
            position: 'left',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Into my "Second Brain"',
            items: [
              {
                label: 'Free Obsidian Starter Kit',
                href: 'https://ko-fi.com/s/8e6f6ccefc', 
              },
            ],
          },
          {
            title: 'Lets connect',
            items: [
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/idan-ariav/', 
              },
              {
                label: 'Threads',
                href: 'https://www.threads.com/@idan_ariav',
              },
              {
                label: "Contact",
                to: '/contactPage',
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Idan Ariav. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false, // Allow users to switch between light and dark mode
      respectPrefersColorScheme: false, // Respect user's system preference
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