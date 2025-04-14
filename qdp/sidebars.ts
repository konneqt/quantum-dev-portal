import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import path from 'path';
import fs from 'fs';

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
            const category = {
              type: 'category',
              label: item.name,
              items: require(sidebarPath), 
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
 /*    'intro',
    {
      type: 'category',
      label: 'Tutorial for DevPortal',
      items: ['tutorial-basics/create-a-document'],
    },
    'protect_apis', */
    {
      type: 'category',
      label: 'Quantum Admin Apis',
      link: {
        type: 'generated-index',
        title: 'Quantum Admin APIs',
        description: 'Find the full documentation for all their APIs here, including details on endpoints, authentication and usage examples.',
        slug: '/docs/',
      },
      items: kcSideBar, 
    },
  ],
};

export default sidebars;