import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
    },
    {
      type: 'category',
      label: '快速开始',
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/examples',
      ],
    },
    {
      type: 'category',
      label: '核心功能',
      items: [
        'core-features/rest-conversion',
      ],
    },
  ],
};

export default sidebars;
