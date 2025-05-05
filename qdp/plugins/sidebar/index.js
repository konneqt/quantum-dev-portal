module.exports = function(context, options) {
    return {
      name: 'docusaurus-sidebar-plugin',
      
      // Estendendo a configuração do webpack para expor os componentes da sidebar
      configureWebpack(config, isServer, utils) {
        return {
          resolve: {
            alias: {
              '@docusaurus-sidebar': '@docusaurus/theme-classic/lib/theme/DocSidebar',
            },
          },
        };
      },
      
      // Injetando o componente de sidebar nas páginas customizadas
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'script',
              attributes: {
                type: 'text/javascript',
              },
              innerHTML: `
                window.DocusaurusSidebarData = {};
                document.addEventListener('DOMContentLoaded', function() {
                  if (window.__DOCUSAURUS__ && window.__DOCUSAURUS__.docsSidebars) {
                    window.DocusaurusSidebarData = window.__DOCUSAURUS__.docsSidebars;
                  }
                });
              `,
            },
          ],
        };
      },
    };
  };