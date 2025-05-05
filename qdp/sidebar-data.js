const path = require('path');
const fs = require('fs');

function findSidebar(directory) {
  try {
    
    if (!fs.existsSync(directory)) {
      console.warn(`Directory ${directory} does not exist.`);
      return [];
    }

    const findInSubfolders = (dir) => {
      let sidebars = [];
      
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          const sidebarPath = path.join(itemPath, 'sidebar.ts');

          if (fs.existsSync(sidebarPath)) {
            try {
              const fileContent = fs.readFileSync(sidebarPath, 'utf8');

              const itemsMatch = fileContent.match(/export\s+default\s+(\[[\s\S]*?\]);?/);

              let originalItems = [];
              if (itemsMatch && itemsMatch[1]) {
                const jsContent = itemsMatch[1].replace(/:\s*[a-zA-Z<>\[\]|]+/g, '');
                
                try {
                  originalItems = eval(`(${jsContent})`);
                } catch (evalError) {
                  console.error(`Erro ao avaliar conteúdo do sidebar.ts (${sidebarPath}):`, evalError.message);
                  originalItems = [];
                }
              }

              const category = {
                type: 'category',
                label: path.basename(itemPath),
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
            } catch (error) {
              console.error(`Erro ao processar ${sidebarPath}:`, error);
            }
          }

          const subsidebars = findInSubfolders(itemPath);
          sidebars = sidebars.concat(subsidebars);
        }
      }

      return sidebars;
    };

    return findInSubfolders(directory);
  } catch (error) {
    return [];
  }
}

const baseDirectory = path.resolve(__dirname, './docs');

const kcSideBar = findSidebar(baseDirectory);

const sidebarData = {
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

module.exports = sidebarData;
