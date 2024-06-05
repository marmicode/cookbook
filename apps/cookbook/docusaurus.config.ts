import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Marmicode Cookbook',
  tagline: 'Opinionated cookbook to build apps that scale',
  favicon: 'img/favicon.png',

  url: process.env.DEPLOY_URL || 'https://cookbook.marmicode.io',
  baseUrl: '/',

  organizationName: 'marmicode',
  projectName: 'cookbook',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  headTags: [
    {
      tagName: 'script',
      attributes: {
        'data-domain': 'cookbook.marmicode.io',
        src: 'https://plausible.io/js/script.js',
      },
    },
    {
      tagName: 'script',
      attributes: {},
      /* HACK: make sure default consent is set before config is added by plugin. */
      innerHTML: `
      function gtag(){dataLayer.unshift(arguments)}
      window.dataLayer = window.dataLayer || [];
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
      `,
    },
  ],

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
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
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
          label: 'Nx',
          position: 'left',
          sidebarId: 'nx',
        },
        {
          href: 'https://github.com/marmicode/cookbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/marmicode',
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
