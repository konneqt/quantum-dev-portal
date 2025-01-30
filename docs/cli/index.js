#!/usr/bin/env node

const fs = require("fs-extra");
const axios = require("axios");
const inquirer = require("inquirer");
const figlet = require("figlet");
const clear = require("clear");
const path = require("path");
const chalk = require("chalk");
const yaml = require("js-yaml");

const pjson = require("../package.json");

const OPTIONS = [
  "Help",
  "Generate Docs based on OpenAPIs Files",
  "Generate from Open API URI",
  "Generate from QAP Control Plane Instance",
];

const QAP_OPTIONS = [
  "Configure Access Info",
  "Clean stored Access Info",
  "Use configured stored Access Info",
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

  files.forEach((file) => {
    const filePath = path.join(defaultFolder, file);

    try {
      // Carregar o conteúdo do arquivo
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const apiData = JSON.parse(fileContent);

      // Verificar e adicionar 'summary' aos métodos em 'paths'
      let summaryAdded = false;
      for (const path in apiData.paths) {
        for (const method in apiData.paths[path]) {
          const operation = apiData.paths[path][method];

          // Verificar se o campo 'summary' existe, se não, adicionar o padrão
          if (!operation.summary) {
            operation.summary = operation.tags || operation.description;
            summaryAdded = true;
          }
        }
      }

      // Se algum summary foi adicionado, salvar o arquivo
      if (summaryAdded) {
        fs.writeFileSync(filePath, JSON.stringify(apiData, null, 2), "utf-8");
      }
    } catch (error) {
      console.warn(chalk.yellow(`Skipping file ${file}: ${error.message}`));
    }
  });

  console.log(chalk.magenta("Validation completed successfully!"));

  // Chama o script rebuildDocs.sh após validar os arquivos
  const { exec } = require("child_process");
  exec("./rebuildDocs.sh", (error, stdout) => {
    if (error) {
      console.error(
        chalk.red(`Error executing rebuildDocs.sh: ${error.message}`)
      );
      return;
    }
    //console.log(chalk.green(`rebuildDocs.sh output: ${stdout}`));
    console.log(
      chalk.green(
        "\nAll operations completed successfully! Please run 'npm start' to start the application."
      )
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
      if (isJson) {
        const openApiData = response.data;
        if (openApiData.info && openApiData.info.title) {
          // Usando o título da OpenAPI
          fileName = openApiData.info.title;
        } else if (openApiData.host) {
          // Usando o host como fallback
          fileName = new URL(uri).hostname;
        } else {
          fileName = "openapi";
        }
      } else {
        // Para YAML, assumimos que o título vem de info.title
        const openApiData = yaml.load(response.data);
        if (openApiData.info && openApiData.info.title) {
          fileName = openApiData.info.title;
        } else if (openApiData.host) {
          fileName = new URL(uri).hostname;
        } else {
          fileName = "openapi";
        }
      }

      // Sanitizar o nome do arquivo
      fileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const extension = isJson ? ".json" : ".yaml";
      const filePath = path.join(apiFolder, `${fileName}${extension}`);

      fs.writeFileSync(filePath, response.data);
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
    scope,
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
    { type: "input", name: "scope", message: "Inform the scope:" },

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
    SCOPE: scope
  };

  saveEnv(envVars);
  console.log(chalk.green("Access info saved successfully."));

  // Gera o token e salva no .env
  const token = await generateAccessToken(clientID, clientSecret, username, password, oauthURL, scope);
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
const generateAccessToken = async (clientID, clientSecret, username, password, oauthURL, scope) => {
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
        scope: scope
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
// Função para buscar e salvar as especificações da API
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
    apiSpecs.forEach((apiSpec, index) => {
      const apiName = apiSpec.apiName
        ? apiSpec.apiName
            .replace(/\s+/g, "-")
            .replace(/[^\w.-]/g, "")
            .replace(/-+$/, "")
        : `spec-${index + 1}`;

      const fileName = `${apiName}.json`;
      const filePath = path.join(apiFolder, fileName);

      const jsonData = JSON.parse(apiSpec.swaggerFile);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    });

    return apiSpecs;
  } catch (error) {
    console.error(chalk.red("Error fetching or saving API specs:"), error);
    throw error;
  }
};

// Função principal para usar os dados configurados
const useConfiguredAccessInfo = async () => {
  const envVars = loadEnv();
  if (!envVars) {
    console.log(chalk.red("No access info found. Please configure access first."));
    return;
  }

  const { API_URI, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD, COMPANY_NAME, ACCESS_TOKEN, OAUTH_URL, SCOPE } = envVars;

  // Verifica se o token é válido
  let token = ACCESS_TOKEN;
  if (!(await isTokenValid(token))) {
    console.log(chalk.yellow("Token expired. Generating a new one..."));
    token = await generateAccessToken(CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD, OAUTH_URL, SCOPE);
    envVars.ACCESS_TOKEN = token;
    saveEnv(envVars);
  }

  // Acessa as APIs e salva as especificações
  await fetchAndSaveApiSpecs(API_URI, COMPANY_NAME, token);
  await generateDocsFromFiles();
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
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred in generateDocsFromQAP:"), error);
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
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
  }
};

run();
