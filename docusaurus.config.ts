import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';

const createConfig = async function (): Promise<Config> {
  const locale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'zh';

  const title = locale === 'en' ? 'MCP Gateway' : 'MCP网关';
  const tagline =
    locale === 'en'
      ? 'Turn APIs into MCP endpoints, without changing a line of code'
      : '无需Coding，通过配置轻松将API转成MCP Server';

  return {
    title,
    tagline,
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
        zh: { label: '中文', htmlLang: 'zh-CN', direction: 'ltr' },
        en: { label: 'English', htmlLang: 'en-US', direction: 'ltr' },
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
        title: title,
        logo: {
          alt: 'MCP Gateway Logo',
          src: 'img/logo.svg',
        },
        items: [
          { type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: locale === 'en' ? 'Docs' : '文档' },
          { to: '/blog', label: locale === 'en' ? 'Blog' : '博客', position: 'left' },
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
            title: locale === 'en' ? 'Docs' : '文档',
            items: [
              {
                label: locale === 'en' ? 'Getting Started' : '快速开始',
                to: '/getting-started/quick-start',
              },
            ],
          },
          {
            title: locale === 'en' ? 'Community' : '社区',
            items: [
              {
                label: locale === 'en' ? 'Discussions' : '讨论区',
                href: 'https://github.com/mcp-ecosystem/mcp-gateway/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/udf69cT9TY',
              },
            ],
          },
          {
            title: locale === 'en' ? 'More' : '更多',
            items: [
              {
                label: 'GitHub - MCP Gateway',
                href: 'https://github.com/mcp-ecosystem/mcp-gateway',
              },
              {
                label: 'GitHub - Docs',
                href: 'https://github.com/mcp-ecosystem/docs',
              },
            ],
          },
        ],
        copyright:
          locale === 'en'
            ? `Copyright © ${new Date().getFullYear()} MCP Gateway. Created by Leo.`
            : `版权所有 © ${new Date().getFullYear()} MCP Gateway。由 <a href="https://www.ifuryst.com/" target="_blank" rel="noopener noreferrer">Leo</a> 创建。`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash'],
      },
    },
  };
};

export default createConfig;
