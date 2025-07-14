const fs = require("fs-extra");
const path = require("path");
const yaml = require("js-yaml");
const chalk = require("chalk");
const inquirer = require("inquirer");
const axios = require("axios");
const { userFeedback } = require("../utils/feedback");
const validateOpenAPISpec = require("../../utils/validateOpenApiFile.js");
const { runRebuildDocsScript } = require("../utils/docsScriptHelper");
const { resolveQdpRoot } = require("../utils/resolveQdpRoot");

// Função auxiliar que garante que a pasta local qdp existe
const ensureLocalQdpExists = async () => {
  const currentDir = process.cwd();
  const localQdpPath = path.join(currentDir, "qdp");
  const globalQdpPath = resolveQdpRoot();

  // Se o QDP global NÃO estiver dentro de node_modules, assume que veio de repositório (evita cópia)
  if (!globalQdpPath.includes("node_modules")) {
    return globalQdpPath;
  }

  // Se já existir localmente, não precisa copiar
  if (fs.existsSync(localQdpPath)) {
    return localQdpPath;
  }

  const { default: ora } = await import("ora");

  try {
    await fs.copy(globalQdpPath, localQdpPath, {
      filter: (src) => {
        const relativePath = path.relative(globalQdpPath, src);
        return (
          !relativePath.startsWith("node_modules") &&
          !relativePath.startsWith(".git") &&
          !relativePath.startsWith("build") &&
          !relativePath.startsWith(".next")
        );
      },
    });

    const necessaryDirs = ["cli/apis", "docs", "src/pages"];
    for (const dir of necessaryDirs) {
      await fs.ensureDir(path.join(localQdpPath, dir));
    }
  } catch (error) {
    userFeedback.error("Failed to setup local environment");
    throw error;
  }

  return localQdpPath;
};


const generateDocsFromFiles = async () => {
  const { default: ora } = await import("ora");

  // Garante que a pasta local existe
  const localQdpPath = await ensureLocalQdpExists();

  // Agora usa a pasta local para APIs
  const defaultFolder = path.join(localQdpPath, "cli", "apis");
  
  if (!fs.existsSync(defaultFolder)) {
    userFeedback.error("No OpenApis found at the default location.");
    userFeedback.tip(
      'Run the "Upload OpenAPI Files" command first to add OpenAPI files.'
    );
    return;
  }
  
  const files = fs.readdirSync(defaultFolder);

  if (files.length === 0) {
    userFeedback.error("No OpenAPI files found in the folder.");
    userFeedback.tip(
      "Upload some OpenAPI files before generating documentation."
    );
    return;
  }

  const processedFiles = [];
  const skippedFiles = [];
  const filesWithIssues = [];

  const processingSpinner = ora("Processing OpenAPI files...").start();

  files.forEach((file, index) => {
    processingSpinner.text = `Processing file ${index + 1}/${
      files.length
    }: ${file}`;
    const filePath = path.join(defaultFolder, file);

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let apiData;

      try {
        apiData = JSON.parse(fileContent);
      } catch (jsonError) {
        try {
          apiData = yaml.load(fileContent);
          if (!apiData) throw new Error("Empty or invalid YAML content");
        } catch (yamlError) {
          skippedFiles.push(`${file} (Parsing error: invalid format)`);
          return;
        }
      }

      const issues = validateOpenAPISpec(apiData, file);
      if (issues.length > 0) {
        filesWithIssues.push({ file, issues });
      }
      let summaryAdded = false;
      if (apiData.paths) {
        for (const path in apiData.paths) {
          for (const method in apiData.paths[path]) {
            if (
              [
                "get",
                "post",
                "put",
                "delete",
                "patch",
                "options",
                "head",
              ].includes(method)
            ) {
              const operation = apiData.paths[path][method];

              if (!operation.summary) {
                operation.summary = "No summary";
                summaryAdded = true;
              }
            }
          }
        }
      }

      if (summaryAdded) {
        if (file.endsWith(".yaml") || file.endsWith(".yml")) {
          fs.writeFileSync(filePath, yaml.dump(apiData), "utf-8");
        } else {
          fs.writeFileSync(filePath, JSON.stringify(apiData, null, 2), "utf-8");
        }
        processedFiles.push(file);
      }
    } catch (error) {
      console.error(chalk.red(`Error processing ${file}:`), error.message);
      skippedFiles.push(`${file} (${error.message})`);
    }
  });

  processingSpinner.succeed("File processing completed!");

  if (skippedFiles.length > 0) {
    console.log(chalk.yellow(`\nSkipped Files: ${skippedFiles.length}`));
    console.log(chalk.yellow("Skipped files:"));
    skippedFiles.forEach((file) => console.log(`- ${file}`));
  }

  if (filesWithIssues.length > 0) {
    userFeedback.warning(
      `Found validation issues in ${filesWithIssues.length} file(s)`
    );

    filesWithIssues.forEach(({ file, issues }, fileIndex) => {
      const issueText = issues.length === 1 ? "issue" : "issues";
      console.log(
        chalk.yellow(
          `\n  ${fileIndex + 1}. ${file} (${issues.length} ${issueText}):`
        )
      );
      const issuesArray = Array.isArray(issues)
        ? issues
        : issues.issues || [issues.message || "Unknown error"];
      issuesArray.forEach((issue, issueIndex) => {
        console.log(
          chalk.yellow(`     ${String.fromCharCode(97 + issueIndex)}. ${issue}`)
        );
      });
    });

    const { shouldContinue } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldContinue",
        message:
          "Continue despite specification issues? (This may affect the generated documentation)",
        default: false,
      },
    ]);

    if (!shouldContinue) {
      userFeedback.error("Process interrupted by user request");
      userFeedback.tip("Fix the issues identified above and try again");
      return;
    } else {
      userFeedback.warning(
        "Continuing with issues. Documentation quality may be affected"
      );
    }
  }
  userFeedback.success("Validation completed successfully!");

  // IMPORTANTE: Agora passa o caminho da pasta local para gerar docs
  await runRebuildDocsScript(localQdpPath);
};

const generateDocsFromURI = async () => {
  const { default: ora } = await import("ora");
  const inquirer = require("inquirer");

  const { uri } = await inquirer.prompt([
    {
      type: "input",
      name: "uri",
      message: "Enter the URI of your OpenAPI specification:",
      validate: (input) => {
        if (!input) return "URI cannot be empty";
        if (!input.startsWith("http"))
          return "URI should start with http:// or https://";
        return true;
      },
    },
  ]);

  userFeedback.info(`Fetching specification from: ${uri}`);

  const fetchSpinner = ora({
    text: "Downloading OpenAPI specification...",
    spinner: "dots",
  }).start();

  try {
    const response = await axios.get(uri);
    if (response.status === 200) {
      fetchSpinner.succeed("OpenAPI specification successfully downloaded!");

      const contentType = response.headers["content-type"];
      const isJson = contentType.includes("application/json");
      const isYaml =
        contentType.includes("application/x-yaml") ||
        contentType.includes("text/yaml");

      if (!isJson && !isYaml) {
        userFeedback.error("The fetched content is neither JSON nor YAML");
        userFeedback.tip(
          "Check that the URI points to a valid OpenAPI specification"
        );
        return;
      }

      const processingSpinner = ora({
        text: "Processing API specification...",
        spinner: "dots",
      }).start();

      const extension = isJson ? ".json" : ".yaml";

      const validation = validateOpenAPISpec(response.data, extension);

      if (!validation.valid) {
        processingSpinner.fail(
          "The content is not a valid OpenAPI specification"
        );
        userFeedback.error(validation.message);
        userFeedback.tip(
          "Check that the URI points to a valid OpenAPI/Swagger specification"
        );
        return;
      }

      let fileName = "";
      const openApiData = validation.parsedContent;

      if (openApiData.info && openApiData.info.title) {
        fileName = openApiData.info.title;
      } else if (openApiData.host) {
        fileName = openApiData.host;
      } else {
        try {
          fileName = new URL(uri).hostname;
        } catch (e) {
          fileName = "openapi";
        }
      }

      fileName = fileName.replace(/[^a-z0-9]/gi, "-").toLowerCase();

      let fileContent;
      if (isJson) {
        fileContent =
          typeof response.data === "object"
            ? JSON.stringify(response.data, null, 2)
            : response.data;
      } else {
        fileContent = response.data;
      }

      // MODIFICAÇÃO: Garante que a pasta local existe e salva lá
      const localQdpPath = await ensureLocalQdpExists();
      const apiFolder = path.join(localQdpPath, "cli", "apis");
      
      if (!fs.existsSync(apiFolder)) {
        fs.mkdirSync(apiFolder, { recursive: true });
        userFeedback.info(`Created new API directory at ${apiFolder}`);
      }

      const filePath = path.join(apiFolder, `${fileName}${extension}`);
      fs.writeFileSync(filePath, fileContent, "utf-8");

      processingSpinner.succeed(
        `API specification validated and saved as ${fileName}${extension}!`
      );
      userFeedback.success(`Saved to: ${filePath}`);
      userFeedback.info(
        `OpenAPI Version: ${
          validation.specVersion === "openapi3" ? "3.x" : "2.x"
        }`
      );

      // Chama a geração de docs que agora usa a pasta local
      await generateDocsFromFiles();
    }
  } catch (error) {
    if (fetchSpinner) fetchSpinner.fail("Failed to download API specification");

    console.error(
      chalk.red("Failed to fetch OpenAPI Specification. Please check the URI."),
      error.message || error
    );

    if (error.code === "ENOTFOUND") {
      userFeedback.error(
        "Host not found. Check the URL and your internet connection."
      );
    } else if (error.code === "ETIMEDOUT") {
      userFeedback.error(
        "Connection timed out. The server might be down or unresponsive."
      );
    } else if (error.response && error.response.status) {
      userFeedback.error(
        `Server returned HTTP ${error.response.status} ${error.response.statusText}`
      );
    }
  }
};

module.exports = {
  generateDocsFromFiles,
  generateDocsFromURI,
};