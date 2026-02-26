import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const nextWorkshopUrl =
  'https://marmicode.io/workshops/pragmatic-angular-testing-full-course?utm_source=cookbook&utm_medium=announcement-bar&utm_campaign=pragmatic-angular-testing-2026-04-01';

const config: Config = {
  title: 'Marmicode Cookbook',
  tagline: 'Ingredients & Recipes for Cooking Delicious Apps',
  favicon: 'img/favicon.png',

  url: process.env.DEPLOY_URL || 'https://cookbook.marmicode.io',
  baseUrl: '/',

  organizationName: 'marmicode',
  projectName: 'cookbook',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-WHZK9HSRK6',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/marmicode/cookbook/tree/main/apps/cookbook',
          routeBasePath: '/',
        },
        blog: false,
        debug: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: 'pragmatic-angular-testing-2026-04-01',
      // 👨‍🍳 Vitest, zoneless, signals… Angular testing is changing fast. Join the Pragmatic Angular Testing workshop — April 1st. 🐣 Early bird ending soon! Reserve your spot →
      content: `👨‍🍳 Vitest, zoneless, signals... Angular testing is changing fast. Join the <a href="${nextWorkshopUrl}" target="_blank" rel="noopener noreferrer"><b>Pragmatic Angular Testing</b></a> workshop on <b>April 1st</b>. 🐣 Early bird ending soon! <a href="${nextWorkshopUrl}" target="_blank" rel="noopener noreferrer">Reserve your spot →</a>`,
      backgroundColor: '#380030',
      textColor: '#ffffff',
    },
    image: 'img/social-card.png',
    navbar: {
      title: 'Marmicode Cookbook',
      logo: {
        alt: 'Marmicode logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          label: 'Angular',
          position: 'left',
          sidebarId: 'angular',
        },
        {
          type: 'docSidebar',
          label: 'Angular Testing',
          position: 'left',
          sidebarId: 'angular-testing',
        },
        {
          type: 'docSidebar',
          label: 'Nx',
          position: 'left',
          sidebarId: 'nx',
        },
        {
          href: 'https://courses.marmicode.io/courses/pragmatic-angular-testing',
          label: '📺 Video Course',
          position: 'right',
        },
        {
          href: 'https://marmicode.io/workshops',
          label: '👨🏻‍🏫 Workshops',
          position: 'right',
        },
        {
          href: 'https://github.com/marmicode/cookbook/tree/main/apps/cookbook/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Need help?',
          items: [
            {
              label: '🚀 Audit, Coaching, Training',
              href: 'https://marmicode.io',
            },
            {
              label: '✉️ Contact Me',
              href: 'https://forms.gle/EAUNbXtXQFCapQCd8',
            },
          ],
        },
        {
          title: 'Learn',
          items: [
            {
              label: '✅ Pragmatic Angular Testing Course',
              href: 'https://courses.marmicode.io/courses/pragmatic-angular-testing?utm_source=cookbook&utm_medium=footer',
            },
            {
              label: '👨🏻‍🏫 Workshops',
              href: 'https://marmicode.io/workshops',
            },
            {
              label: '📚 Blog',
              href: 'https://marmicode.io/learn/everything',
            },
          ],
        },
        {
          title: 'Stay tuned',
          items: [
            {
              label: '📺 Youtube',
              href: 'https://www.youtube.com/marmicode',
            },
            {
              label: '🦋 Bluesky',
              href: 'https://bsky.app/profile/younes.marmico.de',
            },
            {
              label: 'X',
              href: 'https://x.com/yjaaidi',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/yjaaidi/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marmicode.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
