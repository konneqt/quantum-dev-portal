const inquirer = require("inquirer");
const listTemplatesModule = require("./listTemplates");
const chalk = require("chalk");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { spawn } = require('child_process');

// Importa a função auxiliar do arquivo de upload (se disponível)
let ensureLocalQdpExists;
try {
  ensureLocalQdpExists = require("./openApiUploader").ensureLocalQdpExists;
} catch (error) {
  // Se não conseguir importar, define uma versão local
  ensureLocalQdpExists = async () => {
    const currentDir = process.cwd();
    const localQdpPath = path.join(currentDir, 'qdp');
    
    if (!fs.existsSync(localQdpPath)) {
      const { default: ora } = await import("ora");
      const setupSpinner = ora("Setting up local qdp environment...").start();
      
      try {
        console.log(chalk.blue('Setting up local qdp environment...'));
        
        const globalQdpPath = path.dirname(require.resolve('qdp/package.json'));
        
        await fs.copy(globalQdpPath, localQdpPath, {
          filter: (src) => {
            const relativePath = path.relative(globalQdpPath, src);
            return !relativePath.startsWith('node_modules') && 
                   !relativePath.startsWith('.git') &&
                   !relativePath.startsWith('build') &&
                   !relativePath.startsWith('.next');
          }
        });

        // Garante que as pastas necessárias existem
        const necessaryDirs = ['cli/apis', 'docs', 'src/pages'];
        for (const dir of necessaryDirs) {
          await fs.ensureDir(path.join(localQdpPath, dir));
        }
        
        setupSpinner.succeed("Local qdp environment ready!");
        console.log(chalk.green('Local environment ready!'));
        
      } catch (error) {
        setupSpinner.fail("Failed to setup local environment");
        throw error;
      }
    }
    
    return localQdpPath;
  };
}

// Função para executar comandos npm/yarn
const runInstallCommand = (command, args, workingDir) => {
  return new Promise((resolve, reject) => {
    console.log(chalk.gray(`Running: ${command} ${args.join(' ')} in ${workingDir}`));
    
    const child = spawn(command, args, {
      cwd: workingDir,
      shell: true,
      stdio: 'inherit'
    });
    
    child.on('error', (error) => {
      reject(error);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
};

const configureTemplates = async () => {
  // Garante que a pasta local existe
  const localQdpPath = await ensureLocalQdpExists();
  
  const templates = listTemplatesModule.templates;
  const currentTemplateInfo = await getCurrentTemplateInfo(localQdpPath);

  const templatesGalleryUrl =
    "https://konneqt.github.io/qdp-documentation/docs/templates/";

    const choices = [
      { name: "0. Exit", value: "exit" },
      ...templates.map((template, index) => ({
        name: `${index + 1}. ${template}${template.toLowerCase() === currentTemplateInfo.name.toLowerCase() ? ' (Current)' : ''}`,
        value: template,
      })),
      new inquirer.Separator(), 
      new inquirer.Separator("🖼️  View templates: https://konneqt.github.io/qdp-documentation/docs/templates/"),
    
    ];

  const { selectedTemplate } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTemplate",
      message: "Select a template (or 0 to go back):",
      choices: choices,
      default: "exit",
    },
  ]);

  if (selectedTemplate === "exit") {
    console.log(chalk.yellow("Exiting..."));
    return;
  }

  console.log(chalk.green(`✅ Template "${selectedTemplate}" selected!`));

  try {
    await downloadTemplateFiles(selectedTemplate, localQdpPath);
    console.log(
      chalk.green(`✅ Template "${selectedTemplate}" configured successfully!`)
    );

    const templateInfoPath = path.join(localQdpPath, '.template-info.json');
    await fs.writeJson(templateInfoPath, {
      name: selectedTemplate,
      installed: new Date().toISOString()
    }, { spaces: 2 });

    await installDependencies(localQdpPath);

    console.log(
      chalk.green("🎉 Template configured and dependencies installed successfully!")
    );
    console.log(
      chalk.blue("🚀 You can now run 'qdp-start' to start the documentation server.")
    );

  } catch (error) {
    console.error(chalk.red(`Error configuring template: ${error.message}`));
  }
};

async function getCurrentTemplateInfo(localQdpPath) {
  const templateInfoPath = path.join(localQdpPath, ".template-info.json");

  try {
    if (await fs.pathExists(templateInfoPath)) {
      return await fs.readJson(templateInfoPath);
    }
  } catch (error) {
    console.warn(
      chalk.yellow(`⚠️ Error reading template info: ${error.message}`)
    );
  }

  // Valor padrão se o arquivo não existir ou não puder ser lido
  const defaultInfo = {
    name: "default",
    installed: null,
  };

  // Criar o arquivo com valor padrão
  await fs.writeJson(templateInfoPath, defaultInfo, { spaces: 2 });

  return defaultInfo;
}

async function downloadTemplateFiles(templateName, localQdpPath) {
  const repoBaseUrl =
    "https://api.github.com/repos/konneqt/templates-dev-portal/contents/templates";

  let foldersToDownload;
  let filesToDownload;
  let templateDir;

  if (templateName.toLowerCase() === "dyte") {
    foldersToDownload = ["static", "src"];
    filesToDownload = [
      "package.json",
      "docusaurus.config.ts",
      "sidebars.ts",
      "tsconfig.ui-kit.json",
    ];
    templateDir = "dyte";
  } else if (
    templateName.toLowerCase() === "chaos mesh" ||
    templateName.toLowerCase() === "chaos-mesh"
  ) {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts"];
    templateDir = "chaos-mesh";
  } else if (templateName.toLowerCase() === "homarr") {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts"];
    templateDir = "homarr";
  } else {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts"];
    templateDir = "default";
  }

  const templateUrl = `${repoBaseUrl}/${templateDir}`;

  console.log(
    chalk.blue(`📦 Downloading template files from ${templateUrl}...`)
  );

  // MODIFICAÇÃO: Trabalha na pasta local
  for (const folder of foldersToDownload) {
    const localFolderPath = path.join(localQdpPath, folder);

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
      path.join(localQdpPath, folder)
    );
  }

  for (const file of filesToDownload) {
    const localFilePath = path.join(localQdpPath, file);

    if (file !== "package.json" && (await fs.pathExists(localFilePath))) {
      console.log(chalk.yellow(`🗑️ Removing existing file: ${localFilePath}`));
      await fs.remove(localFilePath);
    }

    if (file === "package.json") {
      await mergePackageJson(`${templateUrl}/${file}`, localQdpPath);
    } else {
      await downloadFile(`${templateUrl}/${file}`, localFilePath);
    }
  }

  const templateInfoPath = path.join(localQdpPath, ".template-info.json");
  await fs.writeJson(
    templateInfoPath,
    {
      name: templateName,
      installed: new Date().toISOString(),
    },
    { spaces: 2 }
  );
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

    if (fileUrl.includes("api.github.com")) {
      const response = await axios.get(fileUrl, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (response.data.encoding === "base64") {
        const decodedContent = Buffer.from(response.data.content, "base64");
        await fs.writeFile(localPath, decodedContent);
      } else if (response.data.download_url) {
        await downloadBinaryFile(response.data.download_url, localPath);
      }
    } else {
      await downloadBinaryFile(fileUrl, localPath);
    }

    console.log(chalk.green(`✅ Downloaded ${path.basename(localPath)}`));
  } catch (error) {
    console.warn(
      chalk.yellow(`⚠️ Could not download ${fileUrl}: ${error.message}`)
    );
  }
}

// MODIFICAÇÃO: Agora trabalha na pasta local
async function mergePackageJson(packageJsonUrl, localQdpPath) {
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
      throw new Error("⚠️ Template package.json doesn't contain valid data.");
    }

    const localPackagePath = path.join(localQdpPath, "package.json");
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

    console.log(chalk.green(`✅ package.json merged successfully!`));
  } catch (error) {
    console.error(chalk.red(`❌ Error merging package.json: ${error.message}`));
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

// NOVA FUNÇÃO: Instala dependências automaticamente sem cache
async function installDependencies(localQdpPath) {
  const { default: ora } = await import("ora");
  
  const installSpinner = ora("Installing template dependencies...").start();
  
  try {
    // Verifica qual gerenciador de pacotes usar
    const hasYarnLock = await fs.pathExists(path.join(localQdpPath, 'yarn.lock'));
    const hasPnpmLock = await fs.pathExists(path.join(localQdpPath, 'pnpm-lock.yaml'));
    
    if (hasPnpmLock) {
      installSpinner.text = "Installing with pnpm (no cache)...";
      await runInstallCommand('pnpm', ['install', '--no-frozen-lockfile'], localQdpPath);
    } else if (hasYarnLock) {
      await runInstallCommand('yarn', ['install', '--no-lockfile'], localQdpPath);
    } else {
      installSpinner.text = "Installing with npm (no cache)...";
      await runInstallCommand('npm', ['install', '--no-package-lock'], localQdpPath);
    }
    
    installSpinner.succeed("Dependencies installed successfully!");
    
  } catch (error) {
    installSpinner.fail("Failed to install dependencies automatically");
    
    console.log(chalk.yellow('\n⚠️ Automatic installation failed.'));
    console.log(chalk.blue('Please install dependencies manually:'));
    console.log(chalk.white(`   cd ${path.relative(process.cwd(), localQdpPath)}`));
    console.log(chalk.white('   npm install  # or yarn install'));
    
    throw error;
  }
}

module.exports = configureTemplates;