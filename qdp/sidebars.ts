import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import path from 'path';
import fs from 'fs';
import { generateSidebarJson } from './utils/generateSidebar';


generateSidebarJson();
function findSidebar(directory: string): any[] {
  try {
    if (!fs.existsSync(directory)) {
      console.warn(`Directory ${directory} does not exist.`);
      return [];
    }

    const findInSubfolders = (dir: string): any[] => {
      let sidebars: any[] = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          const sidebarPath = path.join(itemPath, 'sidebar.ts');

          if (fs.existsSync(sidebarPath)) {
            const originalItems = require(sidebarPath);

            const category = {
              type: 'category',
              label: item.name,
              items: [
                ...originalItems,
                {
                  type: 'link',
                  label: 'OWASP API Security Report',
                  href: `/OWASPValidationPage?apiName=${encodeURIComponent(item.name)}`
                },
              ],
            };

            sidebars.push(category);
          }

          sidebars = sidebars.concat(findInSubfolders(itemPath));
        }
      }

      return sidebars;
    };

    return findInSubfolders(directory);
  } catch (error) {
    console.error('Error finding sidebar:', error);
    return [];
  }
}

const baseDirectory = path.resolve(__dirname, './docs');
const kcSideBar = findSidebar(baseDirectory);

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Quantum Admin Apis',
      link: {
        type: 'generated-index',
        title: 'Quantum Admin APIs',
        description:
          'Find the full documentation for all their APIs here, including details on endpoints, authentication and usage examples.',
        slug: '/docs/',
      },
      items: kcSideBar, 
    },
  ],
};

export default sidebars;

