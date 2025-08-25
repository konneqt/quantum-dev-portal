import * as fs from "fs";
import * as path from "path";

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
  
  return [
    [
      "docusaurus-plugin-openapi-docs",
      {
        docsPluginId: "classic",
        config: apiConfig,
      },
    ],
  ];
}