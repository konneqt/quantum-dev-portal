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

const OPTIONS = [
  "Help",
  "Generate Docs based on OpenAPIs Files",
  "Generate from Open API URI",
  "Generate from QAP Control Plane Instance",
  "Choose a Template",
  "Exit"
];

const QAP_OPTIONS = [
  "Configure Access Info",
  "Clean stored Access Info",
  "Use configured stored Access Info",
  "Back"
];

const TEMPLATE_OPTIONS = [
  "List Templates", 
  "Use Templates",
  "Back"
];

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
      "3. Generate from QAP: Fetches API specs from Quantum Admin API."
    )
  );
  console.log(chalk.magenta("\nUse the tool wisely!\n"));
};

const validateOpenApiSpec = (apiData, fileName) => {
  const issues = [];

  // Check basic information
  if (!apiData.info) {
    issues.push("Missing required 'info' section");
  } else {
    if (!apiData.info.title) issues.push("Missing 'info.title'");
    if (!apiData.info.version) issues.push("Missing 'info.version'");
  }

  // Check servers
  if (!apiData.servers || apiData.servers.length === 0) {
    issues.push("Missing 'servers' section - No base URLs defined");
  } else {
    apiData.servers.forEach((server, index) => {
      if (!server.url) {
        issues.push(`'servers[${index}].url' not defined`);
      }
    });
  }

  // Check paths
  if (!apiData.paths || Object.keys(apiData.paths).length === 0) {
    issues.push("Missing 'paths' section or no endpoints defined");
  } else {
    for (const path in apiData.paths) {
      const pathItem = apiData.paths[path];
      // Check if there are HTTP methods in the path
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
      const hasMethod = methods.some(method => pathItem[method]);
      
      if (!hasMethod) {
        issues.push(`Path '${path}' doesn't contain any valid HTTP method`);
      } else {
        for (const method in pathItem) {
          if (methods.includes(method)) {
            const operation = pathItem[method];
            
            // Check if responses are defined
            if (!operation.responses || Object.keys(operation.responses).length === 0) {
              issues.push(`'${method.toUpperCase()} ${path}' has no defined responses`);
            }
            
            // Check required parameters
            if (operation.parameters) {
              operation.parameters.forEach((param, idx) => {
                if (param.required && !param.schema) {
                  issues.push(`'${method.toUpperCase()} ${path}' - required parameter '${param.name}' has no schema defined`);
                }
              });
            }
            
            // Check requestBody when applicable
            if (['post', 'put', 'patch'].includes(method) && !operation.requestBody) {
              issues.push(`'${method.toUpperCase()} ${path}' has no requestBody defined`);
            }
          }
        }
      }
    }
  }

  // Check components.schemas if referenced
  const hasRefs = JSON.stringify(apiData).includes('"$ref"');
  if (hasRefs && (!apiData.components || !apiData.components.schemas || Object.keys(apiData.components.schemas || {}).length === 0)) {
    issues.push("There are schema references ($ref), but 'components.schemas' is not properly defined");
  }

  return issues;
};

// Now, modify the generateDocsFromFiles function to use this validation:

const generateDocsFromFiles = async () => {
  const defaultFolder = path.join(process.cwd(), "apis");
  console.log(
    chalk.green(`Getting APIs from default folder: ${defaultFolder}`)
  );

  if (!fs.existsSync(defaultFolder)) {
    console.error(chalk.red("No APIs folder found at the default location."));
    return;
  }

  const files = fs.readdirSync(defaultFolder);

  if (files.length === 0) {
    console.error(chalk.red("No OpenAPI files found in the folder."));
    return;
  }

  const processedFiles = [];
  const skippedFiles = [];
  const filesWithIssues = [];

  files.forEach((file, index) => {
    const filePath = path.join(defaultFolder, file);

    try {
      // Load file content
      const fileContent = fs.readFileSync(filePath, "utf-8");
      let apiData;
      
      // Try to parse the file
      try {
        apiData = JSON.parse(fileContent);
      } catch (jsonError) {
        // If JSON parse fails, try YAML
        try {
          apiData = yaml.load(fileContent);
          if (!apiData) throw new Error("Empty or invalid YAML content");
        } catch (yamlError) {
          skippedFiles.push(`${file} (Parsing error: invalid format)`);
          return;
        }
      }

      // Validate OpenAPI specification
      const issues = validateOpenApiSpec(apiData, file);
      
      if (issues.length > 0) {
        console.log(chalk.yellow(`\n⚠️  Issues found in ${file}:`));
        issues.forEach(issue => {
          console.log(chalk.yellow(`  - ${issue}`));
        });
        filesWithIssues.push({ file, issues });
      }

      // Check and add 'summary' to methods in 'paths'
      let summaryAdded = false;
      if (apiData.paths) {
        for (const path in apiData.paths) {
          for (const method in apiData.paths[path]) {
            if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
              const operation = apiData.paths[path][method];
              
              // Check if 'summary' field exists, if not, add default
              if (!operation.summary) {
                operation.summary = "No summary";
                summaryAdded = true;
              }
            }
          }
        }
      }

      // If any summary was added or if there were issues to fix, save the file
      if (summaryAdded) {
        // Decide whether to save as JSON or YAML based on file extension
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
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

  // Log summary of processed files
  console.log(chalk.magenta("\nProcessing Summary:"));
  console.log(chalk.green(`Processed Files: ${processedFiles.length}`));
  if (processedFiles.length > 0) {
    console.log(chalk.green("Files processed:"));
    processedFiles.forEach((file) => console.log(`- ${file}`));
  }

  if (skippedFiles.length > 0) {
    console.log(chalk.yellow(`\nSkipped Files: ${skippedFiles.length}`));
    console.log(chalk.yellow("Skipped files:"));
    skippedFiles.forEach((file) => console.log(`- ${file}`));
  }

  if (filesWithIssues.length > 0) {
    console.log(chalk.yellow(`\nFiles with OpenAPI specification issues: ${filesWithIssues.length}`));
    console.log(chalk.yellow("These files may not work correctly in the developer portal:"));
    filesWithIssues.forEach(({ file, issues }) => {
      console.log(chalk.yellow(`- ${file} (${issues.length} issues)`));
    });
    
    // Ask if user wants to continue despite issues
    const { shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldContinue',
        message: 'Issues were found in OpenAPI specifications. Do you want to continue anyway?',
        default: false
      }
    ]);
    
    if (!shouldContinue) {
      console.log(chalk.magenta("Process interrupted by user. Please fix the issues and try again."));
      return;
    }
  }

  console.log(chalk.magenta("Validation completed successfully!"));
  console.log(chalk.green(`Generating docs...`));

  // Call the rebuildDocs.sh script after validating the files
  const { exec } = require("child_process");
  exec("./rebuildDocs.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error executing rebuildDocs.sh: ${error.message}`));
      return;
    }
    
    console.log(
      chalk.green("\nAll operations completed successfully! Please run 'npm start' to start the application.")
    );
  });
};


const generateDocsFromURI = async () => {
  const { uri } = await inquirer.prompt([
    {
      type: "input",
      name: "uri",
      message:
        "Inform the URI Location (e.g., https://sample.com/api.yaml or .json):",
    },
  ]);

  console.log(chalk.green(`Fetching OpenAPI specification from: ${uri}`));
  try {
    const response = await axios.get(uri);
    if (response.status === 200) {
      const contentType = response.headers["content-type"];
      const isJson = contentType.includes("application/json");
      const isYaml =
        contentType.includes("application/x-yaml") ||
        contentType.includes("text/yaml");

      if (!isJson && !isYaml) {
        throw new Error(
          "The fetched content is neither JSON nor YAML. Please check the URI."
        );
      }

      const apiFolder = path.join(process.cwd(), "apis");
      if (!fs.existsSync(apiFolder)) {
        fs.mkdirSync(apiFolder);
      }

      // Extração do título da OpenAPI ou host da URL
      let fileName = "";
      let openApiData;
      
      if (isJson) {
        openApiData = response.data;
        if (openApiData.info && (openApiData.info.name || openApiData.info.title)) {
          // Usando o título da OpenAPI
          fileName = openApiData.info.name || openApiData.info.title;
        } else if (openApiData.host) {
          // Usando o host como fallback
          fileName = openApiData.host;
        } else {
          // Extrair hostname da URI
          try {
            fileName = new URL(uri).hostname;
          } catch (e) {
            fileName = "openapi";
          }
        }
      } else {
        // Para YAML, precisamos fazer o parse
        try {
          openApiData = yaml.load(response.data);
          if (openApiData.info && openApiData.info.title) {
            fileName = openApiData.info.title;
          } else if (openApiData.host) {
            fileName = openApiData.host;
          } else {
            // Extrair hostname da URI
            try {
              fileName = new URL(uri).hostname;
            } catch (e) {
              fileName = "openapi";
            }
          }
        } catch (e) {
          // Se falhar o parse, use um nome padrão baseado na URI
          try {
            fileName = new URL(uri).hostname;
          } catch (e) {
            fileName = "openapi";
          }
        }
      }

      // Sanitizar o nome do arquivo
      fileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const extension = isJson ? ".json" : ".yaml";
      const filePath = path.join(apiFolder, `${fileName}${extension}`);

      // Correção: Serializar o objeto antes de salvar
      if (typeof response.data === 'object') {
        // Se for objeto, converte para string
        fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2), 'utf-8');
      } else {
        // Se já for string, salva diretamente
        fs.writeFileSync(filePath, response.data, 'utf-8');
      }
      
      console.log(chalk.green(`File saved locally at: ${filePath}`));

      await generateDocsFromFiles();
    }
  } catch (error) {
    console.error(
      chalk.red("Failed to fetch OpenAPI Specification. Please check the URI."),
      error
    );
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

// Função para salvar variáveis no .env
const saveEnv = (envVars) => {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(ENV_PATH, envContent);
};

// Função para configurar o acesso
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

  // Gera o token e salva no .env
  const token = await generateAccessToken(
    clientID,
    clientSecret,
    username,
    password,
    oauthURL
  );
  envVars.ACCESS_TOKEN = token;
  saveEnv(envVars);

  // Acessa as APIs e salva as especificações
  await fetchAndSaveApiSpecs(apiURI, companyName, token);
  await generateDocsFromFiles();
};

// Função para limpar o acesso
const cleanAccessInfo = async () => {
  if (fs.existsSync(ENV_PATH)) {
    fs.unlinkSync(ENV_PATH);
    console.log(chalk.green("Access info cleaned successfully."));
  } else {
    console.log(chalk.yellow("No access info found to clean."));
  }
};

// Função para gerar o token de acesso
const generateAccessToken = async (
  clientID,
  clientSecret,
  username,
  password,
  oauthURL
) => {
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
    return response.data.access_token;
  } catch (error) {
    console.error(chalk.red("Failed to generate access token:"), error);
    throw error;
  }
};

const jwt = require("jsonwebtoken");
const { env } = require("process");

// Função para verificar se o token é válido
const isTokenValid = (token) => {
  try {
    // Decodifica o token sem validar a assinatura
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload) {
      console.log(chalk.yellow("Invalid token format."));
      return false;
    }

    const { exp } = decoded.payload;

    // Verifica se o token expirou
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
  try {
    const newApiUri = `${apiURI}/preview?companyName=${companyName}`;
    console.log(chalk.green(`Fetching OpenAPI specs from: ${newApiUri}`));

    const apiResponse = await axios.get(newApiUri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (apiResponse.status !== 200) {
      throw new Error("Failed to access the API specifications.");
    }

    const apiFolder = path.join(process.cwd(), "apis");
    if (!fs.existsSync(apiFolder)) {
      fs.mkdirSync(apiFolder);
    }

    const apiSpecs = apiResponse.data.apiInformations;
    const filesWithIssues = [];
    
    for (const apiSpec of apiSpecs) {
      const apiName = apiSpec.apiName
        ? apiSpec.apiName
            .replace(/\s+/g, "-")
            .replace(/[^\w.-]/g, "")
            .replace(/-+$/, "")
        : `spec-${apiSpecs.indexOf(apiSpec) + 1}`;

      let jsonData;
      
      // Check if swaggerFile exists and is valid
      if (!apiSpec.swaggerFile) {
        console.warn(chalk.yellow(`⚠️  Missing swaggerFile for API: ${apiSpec.apiName || `spec-${apiSpecs.indexOf(apiSpec) + 1}`}`));
        continue; // Skip this item and go to the next one
      }

      // Handle different swaggerFile formats
      if (typeof apiSpec.swaggerFile === "string") {
        // Case 1: swaggerFile is a string - try to parse as JSON
        if (apiSpec.swaggerFile.startsWith("http")) {
          console.warn(chalk.yellow(`⚠️  URL format not supported in swaggerFile for API: ${apiSpec.apiName}`));
          continue;
        }
        
        try {
          jsonData = JSON.parse(apiSpec.swaggerFile);
        } catch (parseError) {
          console.warn(chalk.yellow(`⚠️  Invalid JSON string in swaggerFile for API: ${apiSpec.apiName}`));
          continue;
        }
      } else if (typeof apiSpec.swaggerFile === "object") {
        // Case 2: swaggerFile is already a JSON object
        jsonData = apiSpec.swaggerFile;
      } else {
        console.warn(chalk.yellow(`⚠️  Unsupported swaggerFile format for API: ${apiSpec.apiName}`));
        continue;
      }
      
      // Validate OpenAPI specification
      const issues = validateOpenApiSpec(jsonData, apiName);
      
      if (issues.length > 0) {
        console.log(chalk.yellow(`\n⚠️  Issues found in API ${apiName}:`));
        issues.forEach(issue => {
          console.log(chalk.yellow(`  - ${issue}`));
        });
        filesWithIssues.push({ api: apiName, issues });
      }

      const fileName = `${apiName}.json`;
      const filePath = path.join(apiFolder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log(chalk.green(`✅ API spec saved: ${filePath}`));
    }
    
    if (filesWithIssues.length > 0) {
      console.log(chalk.yellow(`\nAPIs with OpenAPI specification issues: ${filesWithIssues.length}`));
      console.log(chalk.yellow("These APIs may not work correctly in the dev portal:"));
      filesWithIssues.forEach(({ api, issues }) => {
        console.log(chalk.yellow(`- ${api} (${issues.length} issues)`));
      });
      
      // Ask if user wants to continue despite issues
      const { shouldContinue } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldContinue',
          message: 'Issues were found in OpenAPI specifications. Do you want to continue anyway?',
          default: false
        }
      ]);
      
      if (!shouldContinue) {
        console.log(chalk.magenta("Process interrupted by user. Please fix the issues and try again."));
        return false;
      }
    }
    
    return true;

  } catch (error) {
    console.error(chalk.red("Error fetching or saving API specs:"), error);
    throw error;
  }
};


// Função principal para usar os dados configurados
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
    console.error(
      chalk.red("An error occurred in generateDocsFromQAP:"),
      error
    );
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
      case "Generate Docs based on OpenAPIs Files":
        await generateDocsFromFiles();
        break;
      case "Generate from Open API URI":
        await generateDocsFromURI();
        break;
      case "Generate from QAP Control Plane Instance":
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
    console.error(chalk.red("An error occurred:"), error);
  }
};

run();
