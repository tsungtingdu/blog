module.exports = {
  title: `TD's Note`,
  tagline: 'Why is the sky dark at night?',
  url: 'https://tsungtingdu.github.io',
  baseUrl: '/site/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'tsungtingdu', 
  projectName: 'site',            
  themeConfig: {
    hideableSidebar: true,
    algolia: {
      apiKey: '606da1962cced6cc9d91b3c807e529b6',
      indexName: 'tsungtingdu',
      contextualSearch: true,
    },
      colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: `TD's Note`,
      logo: {
        alt: 'My Site Logo',
        src: 'img/favicon.ico',
      },
      items: [
        // {
        //   to: '/docs',
        //   activeBasePath: 'docs',
        //   label: 'docs',
        //   position: 'left',
        // },
        {to: '/blog', label: 'blog', position: 'left'},
        {
          href: 'https://github.com/tsungtingdu',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'My Links',
          items: [
            {
              label: 'LinkedIn',
              to: 'https://www.linkedin.com/in/tsung-ting-tu/',
            },
            {
              label: 'Github',
              to: 'https://github.com/tsungtingdu',
            },
            {
              label: 'Portfolio',
              to: 'https://tsungtingdu.github.io/profile/',
            },
          ],
        },
        {
          title: 'Useful Links',
          items: [
            {
              label: 'PJCHENder 那些沒告訴你的小細節',
              to: 'https://pjchender.blogspot.com/',
            },
            {
              label: 'Schaos’s Blog',
              to: 'https://medium.com/schaoss-blog',
            },
            {
              label: 'Huli',
              to: 'https://blog.huli.tw/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tu Tsung Ting (Tim). Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl: 'https://github.com/tsungtingdu/blog/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // path: './blog/blog',
          // routeBasePath: '/',
          // blogDescription: 'Why is the night sky dark?',
          // postsPerPage: 5,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  // plugins: [
  //   [
  //     '@docusaurus/plugin-content-blog',
  //     {
  //       id: 'recipes',
  //       routeBasePath: '/recipes',
  //       path: './recipes',
  //       postsPerPage: 3,
  //       include: ['*.md', '*.mdx'],
  //       feedOptions: {
  //         type: 'all',
  //         copyright: `Copyright © ${new Date().getFullYear()} Tu Tsung Ting (Tim). Built with Docusaurus.`,
  //       },
  //     },
  //   ],
  // ],
  themes: ['@docusaurus/theme-live-codeblock']
};
