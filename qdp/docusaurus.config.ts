import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { getOpenApiPlugins } from "./openApiPlugins";

require("dotenv").config();
const config: Config = {
  title: "Quantum API DevPortal",
  tagline: "API DevPortal",
  favicon: "img/favicon.ico",
  onBrokenAnchors: "ignore",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",

  url: "https://konneqt.github.io",

  baseUrl: "/quantum-dev-portal/",
  organizationName: "konneqt", 
  projectName: "quantum-dev-portal",
  deploymentBranch: "main",
  
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/", 
          breadcrumbs: true,
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
        },
        blog: {
          showReadingTime: false,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    customSidebar: {
      defaultDocsPath: '/docs',
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
  ],
  
};
export default config;