import fs from "fs";
import path from "path";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

export function getOpenApiPlugins() {
  const apiFiles = fs
    .readdirSync(path.join(__dirname, "apis"))
    .filter(
      (file) =>
        file.endsWith(".yaml") ||
        file.endsWith(".yml") ||
        file.endsWith(".json")
    );

  const response = apiFiles.map((file) => {
    const apiName = path.basename(file, path.extname(file)); 

    return [
      "docusaurus-plugin-openapi-docs",
      {
        id: `${apiName}`,
        docsPluginId: `classic`,
        config: {
          [apiName]: {
            specPath: `apis/${file}`,
            outputDir: `docs/${apiName}`,
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            template: "api.mustache",
            downloadUrl: `/apis/${file}`,
            hideSendButton: false,
            showSchemas: true,
          },
        } satisfies OpenApiPlugin.Options,
      },
    ];
  });
  return response;
}
