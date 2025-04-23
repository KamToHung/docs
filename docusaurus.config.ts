import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'MCP Gateway',
  tagline: 'Turn APIs into MCP endpoints, without changing a line of code',
  favicon: 'img/favicon.ico',

  url: 'https://mcp.ifuryst.com',
  baseUrl: '/',

  organizationName: 'mcp-ecosystem',
  projectName: 'mcp-gateway',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localeConfigs: {
      zh: { label: '中文' },
      en: { label: 'English' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/mcp-ecosystem/docs/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/mcp-ecosystem/docs/edit/main/blog/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'MCP Gateway',
      logo: {
        alt: 'MCP Gateway Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        { to: '/blog', label: '博客', position: 'left' },
        { type: 'localeDropdown', position: 'right' },
        {
          href: 'https://github.com/mcp-ecosystem/mcp-gateway',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            { label: '快速开始', to: '/docs/intro' },
          ],
        },
        {
          title: '社区',
          items: [
            { label: '讨论区', href: 'https://github.com/mcp-ecosystem/mcp-gateway/discussions' },
          ],
        },
        {
          title: '更多',
          items: [
            { label: 'GitHub', href: 'https://github.com/mcp-ecosystem/docs' },
          ],
        },
      ],
      copyright: `版权所有 © ${new Date().getFullYear()} MCP Gateway。由 <a href="https://www.ifuryst.com/" target="_blank" rel="noopener noreferrer">Leo</a> 创建。`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
