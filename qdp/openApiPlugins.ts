import * as fs from "fs";
import * as path from "path";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const apiDir = path.resolve(__dirname, "./cli/apis");

export function getOpenApiPlugins() {
  if (!fs.existsSync(apiDir)) {
    console.error(`Directory does not exist: ${apiDir}`);
    return [];
  }
  
  const apiFiles = fs
    .readdirSync(apiDir)
    .filter(file => 
      file.endsWith(".yaml") || 
      file.endsWith(".yml") || 
      file.endsWith(".json")
    );

  
  // Cria um objeto de configuração com todas as APIs
  const apiConfig = {};
  
  apiFiles.forEach(file => {
    const apiName = path.basename(file, path.extname(file));
    
    apiConfig[apiName] = {
      specPath: path.join("cli/apis", file),
      outputDir: `docs/${apiName}`,
      sidebarOptions: {
        groupPathsBy: "tag",
        categoryLinkSource: "tag",
      },
      hideSendButton: false,
      showSchemas: true,
    };
  });
  
  // Retorna um único plugin com todas as APIs configuradas
  return [
    [
      "docusaurus-plugin-openapi-docs",
      {
        // Note que o ID é passado como a segunda propriedade
        // na configuração do plugin, não dentro das opções
        docsPluginId: "classic",
        config: apiConfig,
      },
    ],
  ];
}