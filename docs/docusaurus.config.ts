import { themes as prismThemes } from "prism-react-renderer";
import { getOpenApiPlugins } from "./openApiPlugins";
import { webpackPlugin } from "./plugins/webpack-plugin.cjs";
import tailwindPlugin from "./plugins/tailwind-plugin.cjs";

const meta = {
  title: "Quantum API Dev Portal",
  tagline:
    "Explore comprehensive documentation for Dyte, including guides, references, and best practices.",
  url: "https://docs.dyte.io",
  baseUrl: "/quantum-dev-portal/",
  favicon: "/logo/just_q_blue.png",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
};

const plugins = [...getOpenApiPlugins()];

const config = {
  ...meta,
  plugins,
  future: {
    experimental_faster: true,
  },
  staticDirectories: ["static"],
  trailingSlash: false,
  themes: [
    "@docusaurus/theme-live-codeblock",
    "@docusaurus/theme-mermaid",
    "docusaurus-theme-openapi-docs",
  ],
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/", // Set this value to '/'.
          breadcrumbs: true,
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("./src/css/api-reference.css"),
          ],
        },
        sitemap: {
          ignorePatterns: ["**/tags/**", "/api/*"],
        },
        googleTagManager: {
          containerId: "GTM-5FDFFSS",
        },
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "/img/dyte-docs-card.png",
    colorMode: {
      defaultMode: "dark",
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    navbar: {
      title: "Quantum API Dev Portal",
      logo: {
        href: "/",
        src: "/logo/just_q_blue.png",
        alt: "Quantum API Dev Portal",
        height: "40px",
        width: "40px",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Introduction",
        },
        {
          label: "Documentation",
          to: "/quantum-dev-portal/docs/",
        },
        {
          href: "https://github.com/konneqt/quantum-dev-portal",
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
  },
};

export default config;
