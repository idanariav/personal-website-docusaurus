// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Idan Ariav',
  tagline: 'Data Analyst, Knowledge Management, "Philosophers Code" Blog',
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

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
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
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // todo Replace with updated photo after finishing the webside
      image: "general/website-social-card.png",
      navbar: {
        title: 'Welcome',
        items: [{to: '/about', label: 'About me', position: 'left'}, // todo - create an about me page
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Knowledge Vault',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/idanariav/Idans_portfolio', 
            position: 'left',
            label: "Portfolio",
          },
          
          {href: 'https://docs.google.com/forms/d/e/1FAIpQLSegq_JHmtPSa7oXblPg4866E72IuEFVFZEeAKgGBqPQJo97RA/viewform?usp=sf_link', label: 'Contact', position: 'left'} 
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Knowledge Vault',
            items: [
              {
                label: 'Notes',
                to: '/docs/notes/intro', // todo - fix pointer
              },
              {
                label: 'Books',
                to: 'docs/books/test_book_summary', // todo - fix pointer
              },
              {
                label: 'Maps of Content',
                to: 'docs/mocs/stress_moc', // todo - fix pointer
              }
            ],
          },
          {
            title: 'Portfolio',
            items: [
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/in/idan-ariav/', 
              },
              {
                label: 'Github',
                href: 'https://github.com/idanariav/Idans_portfolio',
              },
              {
                label: 'Tableau',
                href: 'https://public.tableau.com/app/profile/idan.ariav', 
              },
            ],
          },
          {
            title: 'Newsletter',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Signup',
                href: 'https://philosophers-code.kit.com/76943a7d9d', 
              },
              {
                label: "Contact",
                href: 'https://docs.google.com/forms/d/e/1FAIpQLSegq_JHmtPSa7oXblPg4866E72IuEFVFZEeAKgGBqPQJo97RA/viewform?usp=sf_link'
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Idan Ariav. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github, // todo - how do I change a theme?
        darkTheme: prismThemes.dracula,
      },
    }),
    themes: [
      // ... Your other themes.
      [
        require.resolve("@easyops-cn/docusaurus-search-local"),
        /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
        ({
          // ... Your options.
          // `hashed` is recommended as long-term-cache of index file is possible.
          hashed: true,
        }),
      ],
    ],
};

export default config;
