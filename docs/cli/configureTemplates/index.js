const inquirer = require("inquirer");
const listTemplatesModule = require("./listTemplates");
const chalk = require("chalk");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const atob = require("atob");

const configureTemplates = async () => {
  const templates = listTemplatesModule.templates;
  listTemplatesModule();

  const { templateName } = await inquirer.prompt([
    {
      type: "input",
      name: "templateName",
      message: "Enter the name of the template:",
    },
  ]);

  const normalizedTemplateName = templateName.trim();

  if (templates.includes(normalizedTemplateName)) {
    console.log(chalk.green(`✅ Template "${normalizedTemplateName}" found!`));

    try {
      await downloadTemplateFiles(normalizedTemplateName);
      console.log(
        chalk.green(
          `✅ Template "${normalizedTemplateName}" configured successfully!`
        )
      );
    } catch (error) {
      console.error(chalk.red(`Error configuring template: ${error.message}`));
    }
  } else {
    console.log(
      chalk.red(
        `The template '${normalizedTemplateName}' does not exist or is incorrect.`
      )
    );
    console.log(
      chalk.yellow(
        "Use the 'List Templates' command to see the available templates."
      )
    );
  }
};

async function downloadTemplateFiles(templateName) {
  const repoBaseUrl =
    "https://api.github.com/repos/konneqt/templates-dev-portal/contents/templates";
    
  let foldersToDownload;
  let filesToDownload;
  
  // Verificação do template escolhido
  if (templateName.toLowerCase() === "dyte") {
    foldersToDownload = ["static", "src", "plugins"];
    filesToDownload = [
      "package.json",
      "docusaurus.config.ts",
      "sidebars.ts",
      "tailwind.config.cjs",
      "tsconfig.ui-kit.json",
    ];
  } else if (templateName.toLowerCase() === "homarr") {
    foldersToDownload = ["static", "src"];
    filesToDownload = [
      "package.json",
      "docusaurus.config.ts",
      "sidebars.ts",
      "tailwind.config.js",
    ];
  } else {
    // Template padrão (caso não seja dyte nem hommar)
    console.log(
      chalk.yellow(`🗑️ Any template selected`)
    );
  }

  const templateDir = templateName.toLowerCase();
  const templateUrl = `${repoBaseUrl}/${templateDir}`;

  console.log(
    chalk.blue(`📦 Downloading template files from ${templateUrl}...`)
  );

  for (const folder of foldersToDownload) {
    const localFolderPath = path.join(process.cwd(), folder);

    // Se a pasta já existir, remover antes de baixar
    if (await fs.pathExists(localFolderPath)) {
      console.log(
        chalk.yellow(`🗑️ Removing existing folder: ${localFolderPath}`)
      );
      await fs.remove(localFolderPath);
    }

    await fs.ensureDir(localFolderPath);
  }

  for (const folder of foldersToDownload) {
    await downloadFolder(
      `${templateUrl}/${folder}`,
      path.join(process.cwd(), folder)
    );
  }

  for (const file of filesToDownload) {
    const localFilePath = path.join(process.cwd(), file);

    // Não remover package.json
    if (file !== "package.json" && (await fs.pathExists(localFilePath))) {
      console.log(chalk.yellow(`🗑️ Removing existing file: ${localFilePath}`));
      await fs.remove(localFilePath);
    }

    if (file === "package.json") {
      await mergePackageJson(`${templateUrl}/${file}`);
    } else {
      await downloadFile(`${templateUrl}/${file}`, localFilePath);
    }
  }
}

async function downloadFolder(folderUrl, localPath) {
  try {
    console.log(chalk.blue(`🔍 Checking folder ${folderUrl}...`));
    const response = await axios.get(folderUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    await fs.ensureDir(localPath);

    for (const item of response.data) {
      const localItemPath = path.join(localPath, item.name);

      if (item.type === "dir") {
        await downloadFolder(item.url, localItemPath);
      } else if (item.type === "file") {
        await downloadFile(item.download_url, localItemPath);
      }
    }
  } catch (error) {
    console.warn(
      chalk.yellow(`⚠️ Could not access ${folderUrl}: ${error.message}`)
    );
  }
}

async function downloadFile(fileUrl, localPath) {
  try {
    console.log(chalk.blue(`⬇️ Downloading ${fileUrl} to ${localPath}...`));

    // Verifica se é uma URL direta ou um endpoint da API
    if (fileUrl.includes("api.github.com")) {
      // É um endpoint da API, precisa obter o download_url
      const response = await axios.get(fileUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (response.data.encoding === "base64") {
        const decodedContent = Buffer.from(response.data.content, "base64");
        await fs.writeFile(localPath, decodedContent);
      } else if (response.data.download_url) {
        // Baixa diretamente da download_url para arquivos binários
        await downloadBinaryFile(response.data.download_url, localPath);
      }
    } else {
      // É uma URL direta de download, baixa como binário
      await downloadBinaryFile(fileUrl, localPath);
    }

    console.log(chalk.green(`✅ Downloaded ${path.basename(localPath)}`));
  } catch (error) {
    console.warn(
      chalk.yellow(`⚠️ Could not download ${fileUrl}: ${error.message}`)
    );
  }
}

async function downloadBinaryFile(url, localPath) {
  const response = await axios({
    method: "get",
    url: url,
    responseType: "arraybuffer",
  });
  await fs.writeFile(localPath, response.data);
}

async function mergePackageJson(packageJsonUrl) {
  try {
    console.log(
      chalk.blue(`🔄 Merging package.json from ${packageJsonUrl}...`)
    );

    const templatePackageResponse = await axios.get(packageJsonUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    let templatePackage;
    if (templatePackageResponse.data.content) {
      const decodedContent = Buffer.from(
        templatePackageResponse.data.content,
        "base64"
      ).toString("utf8");
      templatePackage = JSON.parse(decodedContent);
    } else {
      throw new Error("⚠️ package.json do template não contém dados válidos.");
    }

    const localPackagePath = path.join(process.cwd(), "package.json");
    let localPackage = {};

    if (await fs.pathExists(localPackagePath)) {
      const localContent = await fs.readFile(localPackagePath, "utf8");
      localPackage = JSON.parse(localContent);
    }

    const mergedPackage = {
      ...localPackage,
      dependencies: {
        ...(localPackage.dependencies || {}),
        ...(templatePackage.dependencies || {}),
      },
      devDependencies: {
        ...(localPackage.devDependencies || {}),
        ...(templatePackage.devDependencies || {}),
      },
    };

    await fs.writeFile(
      localPackagePath,
      JSON.stringify(mergedPackage, null, 2)
    );

    console.log(chalk.green(`✅ package.json mesclado com sucesso!`));
  } catch (error) {
    console.error(
      chalk.red(`❌ Erro ao mesclar package.json: ${error.message}`)
    );
  }
}

module.exports = configureTemplates;
