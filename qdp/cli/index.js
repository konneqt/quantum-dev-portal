#!/usr/bin/env node

const fs = require("fs-extra");
const axios = require("axios");
const inquirer = require("inquirer");
const figlet = require("figlet");
const clear = require("clear");
const path = require("path");
const chalk = require("chalk");
const yaml = require("js-yaml");
const templates = require("./configureTemplates/listTemplates");
const configureTemplates = require("./configureTemplates/index");
const pjson = require("../package.json");
const validateOpenAPISpec = require("../utils/validateOpenApiFile");

const OPTIONS = [
  "Help",
  "Upload OpenAPI Files",
  "Generate Docs based on OpenAPIs Files",
  "Generate Docs from OpenAPI URI",
  "Generate Docs from QAP Control Plane Instance",
  "Choose a Template",
  "Exit",
];

const QAP_OPTIONS = [
  "Configure Access Info",
  "Clean stored Access Info",
  "Use configured stored Access Info",
  "Back",
];

const TEMPLATE_OPTIONS = ["List Templates", "Use Templates", "Back"];

const MENU_LOGO = `
===================================================================    
     Quantum API Dev Portal -  ${pjson.version} 
===================================================================
    `;

const init = () => {
  clear();
  console.log(chalk.magenta(figlet.textSync("Konneqt", { font: "Ogre" })));
  console.log(chalk.magenta(MENU_LOGO));
};

const askMenuOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: OPTIONS,
    },
  ]);
};

const askQapOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: QAP_OPTIONS,
    },
  ]);
};

const askTemplateOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: TEMPLATE_OPTIONS,
    },
  ]);
};

const handleHelp = () => {
  console.log(chalk.green("\nHelp Section:"));
  console.log(
    chalk.cyan(
      "1. Generate Docs: Creates documentation based on OpenAPI files."
    )
  );
  console.log(
    chalk.cyan(
      "2. Generate from URI: Fetches OpenAPI specs from a provided URI."
    )
  );
  console.log(
    chalk.cyan(
      "3. Generate from QAP: Fetches API specs from Quantum API Platform."
    )
  );
  console.log(chalk.magenta("\nUse the tool wisely!\n"));
};

const uploadOpenAPIFiles = async () => {
  const { default: ora } = await import("ora");
  const { default: chalk } = await import("chalk");
  const inquirer = require("inquirer");
  const fs = require("fs-extra");
  const path = require("path");

  const targetDir = path.join(__dirname, "apis");

  const { uploadMethod } = await inquirer.prompt([
    {
      type: "list",
      name: "uploadMethod",
      message: "How would you like to upload your OpenAPI files?",
      choices: [
        { name: "Upload from local file system", value: "local" },
        { name: "Upload from directory", value: "directory" },
        { name: "Back to main menu", value: "back" },
      ],
    },
  ]);

  if (uploadMethod === "back") return;

  let results = { success: [], failed: [] };

  if (uploadMethod === "local") {
    const { filePaths } = await inquirer.prompt([
      {
        type: "input",
        name: "filePaths",
        message:
          "Enter the path(s) to your OpenAPI file(s), separated by commas:",
        validate: (input) => {
          if (!input) return "Please enter at least one file path";

          const paths = input.split(",").map((p) => p.trim());
          for (const p of paths) {
            const validation = validateOpenAPIFile(p);
            if (validation !== true) {
              return `Invalid file at ${p}: ${validation}`;
            }
          }

          return true;
        },
      },
    ]);

    const files = filePaths.split(",").map((p) => p.trim());
    results = await processFiles(files, targetDir);
  } else if (uploadMethod === "directory") {
    const { directoryPath } = await inquirer.prompt([
      {
        type: "input",
        name: "directoryPath",
        message:
          "Enter the path to the directory containing your OpenAPI files:",
        validate: (input) => {
          if (!input) return "Please enter a directory path";

          try {
            const stats = fs.statSync(input);
            if (!stats.isDirectory()) {
              return "Path must be a directory";
            }
            return true;
          } catch (error) {
            return `Error accessing directory: ${error.message}`;
          }
        },
      },
    ]);

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => {
        const ext = path.extname(file);
        return [".json", ".yaml", ".yml"].includes(ext);
      })
      .map((file) => path.join(directoryPath, file));

    if (files.length === 0) {
      console.log(
        chalk.yellow("No valid OpenAPI files found in the directory")
      );
      return;
    }

    const { selectedFiles } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedFiles",
        message: "Select the files you want to import:",
        choices: files.map((file) => ({
          name: `${path.basename(file)} (${path.extname(file).substring(1)})`,
          value: file,
          checked: false,
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return "You must select at least one file";
          }
          return true;
        },
      },
    ]);

    results = await processFiles(selectedFiles, targetDir);
  }

  if (results.success.length === 0) {
    console.log(chalk.red("Interrupted Process"));
    return;
  }

  const { shouldGenerateDocs } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldGenerateDocs",
      message: "Do you want to generate the documentation now?",
      default: true,
    },
  ]);

  if (shouldGenerateDocs) {
    await generateDocsFromFiles();
  }

};

// Function to process the files
const processFiles = async (files, targetDir) => {
  const { default: ora } = await import("ora");
  const { default: chalk } = await import("chalk");
  const fs = require("fs-extra");
  const path = require("path");
  const yaml = require("js-yaml");

  const spinner = ora("Processing OpenAPI files...").start();
  const results = { success: [], failed: [] };

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const targetPath = path.join(targetDir, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const extension = path.extname(filePath).toLowerCase();
      const validation = validateOpenAPISpec(fileContent, extension);

      if (validation.valid) {
        fs.copySync(filePath, targetPath);
        results.success.push({ name: fileName, path: targetPath });
        spinner.text = `Processed: ${fileName} (valid OpenAPI spec)`;
      } else {
        results.failed.push({ name: fileName, error: validation.message });
        spinner.text = `Skipped: ${fileName} (not a valid OpenAPI spec)`;
      }
    } catch (error) {
      results.failed.push({ name: fileName, error: error.message });
      spinner.text = `Error processing: ${fileName}`;
    }
  }

  spinner.stop();

  if (results.success.length > 0) {
    console.log(
      chalk.green(
        `\nSuccessfully imported ${results.success.length} OpenAPI files:`
      )
    );
    results.success.forEach((file) => {
      console.log(chalk.green(`  - ${file.name}`));
    });
  }

  if (results.failed.length > 0) {
    console.log(
      chalk.red(
        `\nFailed to import ${results.failed.length} files (not valid OpenAPI specs):`
      )
    );
    results.failed.forEach((file) => {
      console.log(chalk.red(`  - ${file.name}: ${file.error}`));
    });
  }

  if (results.success.length === 0 && results.failed.length > 0) {
    console.log(
      chalk.yellow("\nNo valid OpenAPI specifications were imported.")
    );
  }

  return results;
};

const userFeedback = {
  info: (message) => console.log(chalk.blue(`ℹ️`), message),
  success: (message) => console.log(chalk.green(`✔`), message),
  warning: (message) => console.log(chalk.yellow(`⚠️`), message),
  error: (message) => console.log(chalk.red(`❌`), message),
  tip: (message) => console.log(chalk.cyan(`💡`), message),
  section: (title) => console.log(chalk.magenta(`\n== ${title} ==`)),
  list: (items, prefix = "-") =>
    items.forEach((item) => console.log(`  ${prefix} ${item}`)),
};

const generateDocsFromFiles = async () => {
  const { default: ora } = await import("ora");

  const defaultFolder = path.join(__dirname, "apis");
  if (!fs.existsSync(defaultFolder)) {
    userFeedback.error("No APIs folder found at the default location.");
    userFeedback.tip("Run the upload command first to add OpenAPI files.");
    return;
  }
  console.log(defaultFolder);
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

  // Spinner for file processing
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

      issues.forEach((issue, issueIndex) => {
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

  // Spinner for docs generation
  const docsSpinner = ora({
    text: "Generating documentation...",
    spinner: "dots",
  }).start();

  const { exec } = require("child_process");
  exec("./rebuildDocs.sh", (error, stdout, stderr) => {
    if (error) {
      docsSpinner.fail("Documentation generation failed");
      userFeedback.error(`Error executing: ${error.message}`);
      return;
    }

    docsSpinner.succeed("Documentation generated successfully!");
    console.log(
      chalk.green(
        "\nAll operations completed successfully! Please run 'npm start' to start the application."
      )
    );
  });
};

const generateDocsFromURI = async () => {
  const { default: ora } = await import("ora");
  const inquirer = require("inquirer");
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const yaml = require("js-yaml");
  const chalk = require("chalk");

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

  // Create a spinner for URI fetch
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

      // Create spinner for parsing and processing
      const processingSpinner = ora({
        text: "Processing API specification...",
        spinner: "dots",
      }).start();

      // Determine file extension for validation
      const extension = isJson ? ".json" : ".yaml";

      // Validate if it's actually an OpenAPI specification
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

      // Get a suitable filename
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

      // Prepare content to save
      let fileContent;
      if (isJson) {
        fileContent =
          typeof response.data === "object"
            ? JSON.stringify(response.data, null, 2)
            : response.data;
      } else {
        fileContent = response.data;
      }

      // Save the file
      const apiFolder = path.join(__dirname, "apis");
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

      await generateDocsFromFiles();
    }
  } catch (error) {
    // Make sure to stop the spinner with a fail state if there's an error
    if (fetchSpinner) fetchSpinner.fail("Failed to download API specification");

    console.error(
      chalk.red("Failed to fetch OpenAPI Specification. Please check the URI."),
      error.message || error
    );

    // Provide more specific error messages for common issues
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

const ENV_PATH = path.join(process.cwd(), ".env.local");

const loadEnv = () => {
  if (fs.existsSync(ENV_PATH)) {
    const envFile = fs.readFileSync(ENV_PATH, "utf-8");
    const envVars = envFile
      .split("\n")
      .filter((line) => line.trim() !== "")
      .reduce((acc, line) => {
        const [key, value] = line.split("=");
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
    return envVars;
  }
  return null;
};

const saveEnv = (envVars) => {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(ENV_PATH, envContent);
};

const configureAccessInfo = async () => {
  const {
    apiURI,
    clientID,
    clientSecret,
    username,
    password,
    companyName,
    oauthURL,
  } = await inquirer.prompt([
    {
      type: "input",
      name: "oauthURL",
      message: "Inform OAUTH URL:",
    },
    {
      type: "input",
      name: "clientID",
      message: "Inform your Client ID:",
    },
    {
      type: "input",
      name: "clientSecret",
      message: "Inform your Client Secret:",
    },
    { type: "input", name: "username", message: "Inform your Username:" },
    { type: "input", name: "password", message: "Inform your Password:" },
    {
      type: "input",
      name: "apiURI",
      message: "Inform Quantum Admin API URI:",
    },
    {
      type: "input",
      name: "companyName",
      message: "Inform Company Name:",
    },
  ]);

  const envVars = {
    API_URI: apiURI,
    CLIENT_ID: clientID,
    CLIENT_SECRET: clientSecret,
    USERNAME: username,
    PASSWORD: password,
    COMPANY_NAME: companyName,
    OAUTH_URL: oauthURL,
    SCOPE: "openid",
  };

  saveEnv(envVars);
  console.log(chalk.green("Access info saved successfully."));

  const token = await generateAccessToken(
    clientID,
    clientSecret,
    username,
    password,
    oauthURL
  );
  envVars.ACCESS_TOKEN = token;
  saveEnv(envVars);

  await fetchAndSaveApiSpecs(apiURI, companyName, token);
  await generateDocsFromFiles();
};

const cleanAccessInfo = async () => {
  if (fs.existsSync(ENV_PATH)) {
    fs.unlinkSync(ENV_PATH);
    console.log(chalk.green("Access info cleaned successfully."));
  } else {
    console.log(chalk.yellow("No access info found to clean."));
  }
};

const generateAccessToken = async (
  clientID,
  clientSecret,
  username,
  password,
  oauthURL
) => {
  const { default: ora } = await import("ora");
  // Create a spinner for token generation
  const tokenSpinner = ora({
    text: "Generating access token...",
    spinner: "dots",
  }).start();

  try {
    const options = {
      method: "POST",
      url: oauthURL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        client_id: clientID,
        client_secret: clientSecret,
        username: username,
        password: password,
        grant_type: "password",
        scope: "openid",
      },
    };

    const response = await axios.request(options);
    tokenSpinner.succeed("Access token successfully generated!");
    return response.data.access_token;
  } catch (error) {
    tokenSpinner.fail("Failed to generate access token");
    console.error(chalk.red("Failed to generate access token:"), error);
    throw error;
  }
};

const jwt = require("jsonwebtoken");
const { env } = require("process");

const isTokenValid = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload) {
      console.log(chalk.yellow("Invalid token format."));
      return false;
    }

    const { exp } = decoded.payload;

    if (exp && Date.now() >= exp * 1000) {
      console.log(chalk.yellow("Token has expired."));
      return false;
    }

    console.log(chalk.green("Token is valid."));
    return true;
  } catch (error) {
    console.error(chalk.red("Error decoding token:"), error);
    return false;
  }
};
const fetchAndSaveApiSpecs = async (apiURI, companyName, token) => {
  const { default: ora } = await import("ora");
  // Create a spinner for API fetching
  const fetchSpinner = ora({
    text: `Fetching API specs from QAP for ${companyName}...`,
    spinner: "dots",
  }).start();

  try {
    const newApiUri = `${apiURI}/preview?companyName=${companyName}`;
    fetchSpinner.text = `Fetching OpenAPI specs from: ${newApiUri}`;

    const apiResponse = await axios.get(newApiUri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (apiResponse.status !== 200) {
      fetchSpinner.fail("Failed to access the API specifications");
      throw new Error("Failed to access the API specifications.");
    }

    fetchSpinner.succeed("API specifications successfully retrieved!");

    const apiFolder = path.join(__dirname, "apis");
    if (!fs.existsSync(apiFolder)) {
      fs.mkdirSync(apiFolder);
    }

    const apiSpecs = apiResponse.data.apiInformations;
    const filesWithIssues = [];

    // Create a spinner for processing the specs
    const processSpinner = ora({
      text: `Processing ${apiSpecs.length} API specifications...`,
      spinner: "line",
    }).start();

    let processedCount = 0;

    for (const apiSpec of apiSpecs) {
      processedCount++;
      processSpinner.text = `Processing API ${processedCount}/${
        apiSpecs.length
      }: ${apiSpec.apiName || "Unnamed API"}`;

      const apiName = apiSpec.apiName
        ? apiSpec.apiName
            .replace(/\s+/g, "-")
            .replace(/[^\w.-]/g, "")
            .replace(/-+$/, "")
        : `spec-${apiSpecs.indexOf(apiSpec) + 1}`;

      let jsonData;

      if (!apiSpec.swaggerFile) {
        console.warn(
          chalk.yellow(
            `⚠️  Missing swaggerFile for API: ${
              apiSpec.apiName || `spec-${apiSpecs.indexOf(apiSpec) + 1}`
            }`
          )
        );
        continue;
      }

      if (typeof apiSpec.swaggerFile === "string") {
        if (apiSpec.swaggerFile.startsWith("http")) {
          console.warn(
            chalk.yellow(
              `⚠️  URL format not supported in swaggerFile for API: ${apiSpec.apiName}`
            )
          );
          continue;
        }

        try {
          jsonData = JSON.parse(apiSpec.swaggerFile);
        } catch (parseError) {
          console.warn(
            chalk.yellow(
              `⚠️  Invalid JSON string in swaggerFile for API: ${apiSpec.apiName}`
            )
          );
          continue;
        }
      } else if (typeof apiSpec.swaggerFile === "object") {
        jsonData = apiSpec.swaggerFile;
      } else {
        console.warn(
          chalk.yellow(
            `⚠️  Unsupported swaggerFile format for API: ${apiSpec.apiName}`
          )
        );
        continue;
      }

      const issues = validateOpenAPISpec(jsonData, apiName);

      if (issues.length > 0) {
        filesWithIssues.push({ api: apiName, issues });
      }

      const fileName = `${apiName}.json`;
      const filePath = path.join(apiFolder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    }

    processSpinner.succeed(
      `Successfully processed ${processedCount} API specifications!`
    );

    if (filesWithIssues.length > 0) {
      console.log(
        chalk.yellow(
          `\nAPIs with OpenAPI specification issues: ${filesWithIssues.length}`
        )
      );
      console.log(
        chalk.yellow("These APIs may not work correctly in the dev portal:")
      );
      filesWithIssues.forEach(({ api, issues }) => {
        console.log(chalk.yellow(`- ${api} (${issues.length} issues)`));
        issues.forEach((issue) => {
          console.log(chalk.yellow(`  - ${issue}`));
        });
      });

      const { shouldContinue } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldContinue",
          message:
            "Issues were found in OpenAPI specifications. Do you want to continue anyway?",
          default: false,
        },
      ]);

      if (!shouldContinue) {
        console.log(
          chalk.magenta(
            "Process interrupted by user. Please fix the issues and try again."
          )
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    // Make sure to fail the spinner if there's an error
    if (fetchSpinner && fetchSpinner.isSpinning) {
      fetchSpinner.fail("Error fetching OpenAPI specs");
    }

    // Display the specific error message from the API if available
    if (error.response && error.response.data && error.response.data.message) {
      console.error(chalk.red(`${error.response.data.message}`));
    } else {
      console.error(
        chalk.red("Error fetching or saving OpenAPI specs:"),
        error
      );
    }
    throw error;
  }
};

const useConfiguredAccessInfo = async () => {
  const envVars = loadEnv();
  if (!envVars) {
    console.log(
      chalk.red("No access info found. Please configure access first.")
    );
    return;
  }

  const {
    API_URI,
    CLIENT_ID,
    CLIENT_SECRET,
    USERNAME,
    PASSWORD,
    COMPANY_NAME,
    ACCESS_TOKEN,
    OAUTH_URL,
    SCOPE,
  } = envVars;

  // Verifica se o token é válido
  let token = ACCESS_TOKEN;
  if (!isTokenValid(token)) {
    console.log(chalk.yellow("Token expired. Generating a new one..."));
    token = await generateAccessToken(
      CLIENT_ID,
      CLIENT_SECRET,
      USERNAME,
      PASSWORD,
      OAUTH_URL,
      SCOPE
    );
    envVars.ACCESS_TOKEN = token;
    saveEnv(envVars);
  }

  // Acessa as APIs e salva as especificações
  await fetchAndSaveApiSpecs(API_URI, COMPANY_NAME, token);
  await generateDocsFromFiles();
};

const handleTemplate = async () => {
  try {
    init();
    const { option } = await askTemplateOptions();

    switch (option) {
      case "List Templates":
        await templates();
        break;
      case "Use Templates":
        await configureTemplates();
        break;
      case "Back":
        await run();
        break;
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(
      chalk.red("An error occurred when configuring the template"),
      error
    );
  }
};
// Função principal do QAP
const generateDocsFromQAP = async () => {
  try {
    init();
    const { option } = await askQapOptions();

    switch (option) {
      case "Configure Access Info":
        await configureAccessInfo();
        break;
      case "Clean stored Access Info":
        await cleanAccessInfo();
        break;
      case "Use configured stored Access Info":
        await useConfiguredAccessInfo();
        break;
      case "Back":
        await run();
        break;
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred"));
  }
};

const run = async () => {
  try {
    init();
    const { option } = await askMenuOptions();

    switch (option) {
      case "Help":
        handleHelp();
        break;
      case "Upload OpenAPI Files":
        await uploadOpenAPIFiles();
        break;
      case "Generate Docs based on OpenAPIs Files":
        await generateDocsFromFiles();
        break;
      case "Generate Docs from OpenAPI URI":
        await generateDocsFromURI();
        break;
      case "Generate Docs from QAP Control Plane Instance":
        await generateDocsFromQAP();
        break;
      case "Choose a Template":
        await handleTemplate();
        break;
      case "Exit":
        console.log(chalk.green("Exiting application!"));
        process.exit(0);
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(chalk.red(`${error.response.data.message}`));
    } else {
      console.error(chalk.red("An error ocurred", error));
    }
  }
};

run();
