// src/utils/generateSidebar.ts
import path from 'path';
import fs from 'fs';

export function generateSidebarJson() {
  const findInSubfolders = (dir: string): any[] => {
    let sidebars: any[] = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        const sidebarPath = path.join(itemPath, 'sidebar.ts');
        if (fs.existsSync(sidebarPath)) {
          const originalItems = require(sidebarPath).default;

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

  const docsPath = path.resolve(__dirname, '../docs');
  const sidebarData = findInSubfolders(docsPath);

  // Gerar arquivo JS/TS com exportação nomeada
  const exportFilePath = path.resolve(__dirname, '../static/sidebarData.ts'); // ou .js
  const exportContent = `// Este arquivo é gerado automaticamente.\n\nexport const sidebarData = ${JSON.stringify(sidebarData, null, 2)};\n`;

  fs.writeFileSync(exportFilePath, exportContent, 'utf8');
}
