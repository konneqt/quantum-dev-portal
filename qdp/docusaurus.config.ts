import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { getOpenApiPlugins } from "./openApiPlugins";
import searchLocal from "@easyops-cn/docusaurus-search-local";

require("dotenv").config();

const config: Config = {
  title: "Quantum API DevPortal",
  tagline: "API DevPortal",
  favicon: "img/favicon.ico",
  onBrokenAnchors: "ignore",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "ignore",

  url: "https://konneqt.github.io",

  baseUrl: "/",
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
          breadcrumbs: true,
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
          routeBasePath: "docs",
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
      title: "Quantum API DevPortal",
      logo: {
        alt: "QAP DevPortal",
        src: "img/konneqt-black.png",
        srcDark: "img/konneqt-white.png",
      },
      items: [
        {
          to: "/docs/apis",
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
  themes: [
    "docusaurus-theme-openapi-docs",
    [
      searchLocal,
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        language: ["en"],
        docsRouteBasePath: "/docs", 
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        highlightSearchTermsOnTargetPage: true,
      }
    ]
  ],
  
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