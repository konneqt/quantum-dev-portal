const fs = require("fs-extra");
const path = require("path");
const yaml = require("js-yaml");
const chalk = require("chalk");
const inquirer = require("inquirer");
const axios = require("axios");
const { userFeedback } = require("../utils/feedback");
const validateOpenAPISpec = require("../../utils/validateOpenApiFile.js");
const { runRebuildDocsScript } = require("../utils/docsScriptHelper");
const {
  createDynamicTags,
  createDynamicSummary,
} = require("../../utils/dynamicApiAnalyzer.js");

// Caminho fixo onde ficam os OpenAPI files
const defaultFolder = path.join(process.cwd(), "cli", "apis");

const generateDocsFromFiles = async () => {
  const { default: ora } = await import("ora");

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
    userFeedback.tip("Upload some OpenAPI files before generating documentation.");
    return;
  }

  const processedFiles = [];
  const skippedFiles = [];
  const filesWithIssues = [];

  const processingSpinner = ora("Processing OpenAPI files...").start();

  files.forEach((file, index) => {
    processingSpinner.text = `Processing file ${index + 1}/${files.length}: ${file}`;
    const filePath = path.join(defaultFolder, file);

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let apiData;

      try {
        apiData = JSON.parse(fileContent);
      } catch {
        try {
          apiData = yaml.load(fileContent);
          if (!apiData) throw new Error("Empty or invalid YAML content");
        } catch {
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
        for (const pathKey in apiData.paths) {
          for (const method in apiData.paths[pathKey]) {
            if (
              ["get", "post", "put", "delete", "patch", "options", "head"].includes(method)
            ) {
              const operation = apiData.paths[pathKey][method];

              if (!operation.summary) {
                operation.summary = createDynamicSummary(pathKey, method);
                summaryAdded = true;
              }

              if (!operation.tags || operation.tags.length === 0) {
                const generatedTags = createDynamicTags(pathKey);
                operation.tags = generatedTags;
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
    skippedFiles.forEach((file) => console.log(`- ${file}`));
  }

  if (filesWithIssues.length > 0) {
    userFeedback.warning(`Found validation issues in ${filesWithIssues.length} file(s)`);
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
      return;
    }
  }

  userFeedback.success("Validation completed successfully!");
  await runRebuildDocsScript(process.cwd()); 
};

const generateDocsFromURI = async () => {
  const { default: ora } = await import("ora");

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

  const fetchSpinner = ora("Downloading OpenAPI specification...").start();

  try {
    const response = await axios.get(uri);
    fetchSpinner.succeed("Downloaded!");

    const isJson = response.headers["content-type"].includes("application/json");
    const extension = isJson ? ".json" : ".yaml";

    const validation = validateOpenAPISpec(response.data, extension);
    if (!validation.valid) {
      userFeedback.error("Invalid OpenAPI specification");
      return;
    }

    if (!fs.existsSync(defaultFolder)) {
      fs.mkdirSync(defaultFolder, { recursive: true });
    }

    const fileName = "openapi" + extension;
    const filePath = path.join(defaultFolder, fileName);

    const content = isJson
      ? JSON.stringify(response.data, null, 2)
      : response.data;

    fs.writeFileSync(filePath, content, "utf-8");
    userFeedback.success(`Saved to: ${filePath}`);

    await generateDocsFromFiles();
  } catch (error) {
    fetchSpinner.fail("Failed to download API specification");
    console.error(chalk.red("Error:"), error.message);
  }
};

module.exports = { generateDocsFromFiles, generateDocsFromURI };
