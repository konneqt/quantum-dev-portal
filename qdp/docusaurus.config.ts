import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { getOpenApiPlugins } from "./openApiPlugins";

const config: Config = {
  title: "Quantum API DevPortal",
  tagline: "API DevPortal",
  favicon: "img/favicon.ico",

  onBrokenAnchors: "ignore",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",

  // Set the production url of your site here
  url: "https://konneqt.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/quantum-dev-portal/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "konneqt", // Usually your GitHub org/user name.
  projectName: "quantum-dev-portal", // Usually your repo name.
  deploymentBranch: "main",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Adicione customFields aqui, no mesmo nível que presets, themeConfig, etc.
 /*  customFields: {
    sidebarData: require('./sidebar-data.js'),
  }, */

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/", // Set this value to '/'.
          breadcrumbs: true,
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/just_q_blue.png",
    navbar: {
      title: "Quantum API-Devportal",
      logo: {
        alt: "QAP DevPortal",
        src: "img/just_q_blue.png",
      },
      items: [
        /*   {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Introduction",
        }, */
        {
          to: "/quantum-dev-portal/docs/",
          label: "Documentation",
          position: "left",
        },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} https://konneqt.io`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  markdown: {},
  themes: ["docusaurus-theme-openapi-docs"],
  stylesheets: [
    {
      href: "https://use.fontawesome.com/releases/v5.11.0/css/all.css",
      type: "text/css",
    },
  ],

  plugins: [
    ...getOpenApiPlugins(),
    function (context, options) {
      return {
        name: "custom-webpack-config",
        configureWebpack(config, isServer, utils) {
          return {
            module: {
              rules: [
                {
                  test: /\.(yaml|yml)$/,
                  use: "yaml-loader",
                },
              ],
            },
          };
        },
      };
    },
    require.resolve('./plugins/sidebar/index.js'),
  ],
};
export default config;