const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { loadEnv, saveEnv, isTokenValid } = require("../utils/env");
const { userFeedback } = require("../utils/feedback");
const { generateDocsFromFiles } = require("./docsGenerator");

// Importa a função auxiliar do arquivo de upload
const { ensureLocalQdpExists } = require("./openApiUploader");

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
  const ENV_PATH = path.join(process.cwd(), ".env");
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

// MODIFICAÇÃO: Agora salva na pasta local
const fetchAndSaveApiSpecs = async (apiURI, companyName, token) => {
  const { default: ora } = await import("ora");
  
  // Garante que a pasta local existe
  const localQdpPath = await ensureLocalQdpExists();
  const apiFolder = path.join(localQdpPath, "cli", "apis");
  
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

    // MODIFICAÇÃO: Usa pasta local em vez da global
    if (!fs.existsSync(apiFolder)) {
      fs.mkdirSync(apiFolder, { recursive: true });
    }

    const apiSpecs = apiResponse.data.apiInformations;

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
            .replace(/\./g, "-")
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
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

      const fileName = `${apiName}.json`;
      const filePath = path.join(apiFolder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    }

    processSpinner.succeed(
      `Successfully processed ${processedCount} API specifications!`
    );
    

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

  await fetchAndSaveApiSpecs(API_URI, COMPANY_NAME, token);
  await generateDocsFromFiles();
};

module.exports = {
  configureAccessInfo,
  cleanAccessInfo,
  useConfiguredAccessInfo,
  generateAccessToken,
  fetchAndSaveApiSpecs
};