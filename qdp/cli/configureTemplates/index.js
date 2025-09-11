const inquirer = require("inquirer");
const listTemplatesModule = require("./listTemplates");
const chalk = require("chalk");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { spawn } = require("child_process");

// Base de operação: diretório atual (independe de 'qdp')
const getTargetDir = () => process.cwd();

const runInstallCommand = (command, args, workingDir) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workingDir,
      shell: true,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed: ${command} ${args.join(" ")} (code ${code})`))
    );
  });

const configureTemplates = async () => {
  const targetDir = getTargetDir();
  await fs.ensureDir(targetDir);

  const templates = listTemplatesModule.templates ?? [];
  const currentTemplateInfo = await getCurrentTemplateInfo(targetDir);

  const choices = [
    { name: "0. Exit", value: "exit" },
    ...templates.map((template, index) => ({
      name: `${index + 1}. ${template}${
        template.toLowerCase() === (currentTemplateInfo.name || "").toLowerCase() ? " (Current)" : ""
      }`,
      value: template,
    })),
    new inquirer.Separator(),
    new inquirer.Separator(
      "🖼️  View templates: https://konneqt.github.io/qdp-documentation/docs/templates/"
    ),
  ];

  const { selectedTemplate } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTemplate",
      message: "Select a template (or 0 to go back):",
      choices,
      default: "exit",
    },
  ]);

  if (selectedTemplate === "exit") {
    console.log(chalk.yellow("Exiting..."));
    return;
  }

  // Aviso de sobrescrita no diretório atual
  const riskPaths = ["src", "static"].map((p) => path.join(targetDir, p));
  const existing = (await Promise.all(riskPaths.map((p) => fs.pathExists(p))))
    .map((exists, i) => (exists ? riskPaths[i] : null))
    .filter(Boolean);

  if (existing.length) {
    const { confirmApply } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmApply",
        default: false,
        message:
          `This will replace the following paths in "${targetDir}":\n` +
          existing.map((p) => ` - ${path.relative(targetDir, p)}`).join("\n") +
          `\nContinue?`,
      },
    ]);
    if (!confirmApply) {
      console.log(chalk.yellow("Canceled."));
      return;
    }
  }

  console.log(chalk.green(`✅ Template "${selectedTemplate}" selected!`));

  try {
    await downloadTemplateFiles(selectedTemplate, targetDir);
    console.log(chalk.green(`✅ Template "${selectedTemplate}" configured successfully!`));

    const templateInfoPath = path.join(targetDir, ".template-info.json");
    await fs.writeJson(
      templateInfoPath,
      { name: selectedTemplate, installed: new Date().toISOString() },
      { spaces: 2 }
    );

    await installDependencies(targetDir);

    console.log(chalk.green("🎉 Template configured and dependencies installed successfully!"));
    console.log(chalk.blue("🚀 You can now run your Docusaurus scripts (e.g., npm run start)."));
  } catch (error) {
    console.error(chalk.red(`Error configuring template: ${error.message}`));
  }
};

async function getCurrentTemplateInfo(targetDir) {
  const templateInfoPath = path.join(targetDir, ".template-info.json");
  try {
    if (await fs.pathExists(templateInfoPath)) {
      return await fs.readJson(templateInfoPath);
    }
  } catch (error) {
    console.warn(chalk.yellow(`⚠️ Error reading template info: ${error.message}`));
  }
  const defaultInfo = { name: "default", installed: null };
  await fs.writeJson(templateInfoPath, defaultInfo, { spaces: 2 });
  return defaultInfo;
}

async function downloadTemplateFiles(templateName, targetDir) {
  const repoBaseUrl =
    "https://api.github.com/repos/konneqt/templates-dev-portal/contents/templates";

  let foldersToDownload;
  let filesToDownload;
  let templateDir;

  const t = templateName.toLowerCase();
  if (t === "dyte") {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts", "tsconfig.ui-kit.json"];
    templateDir = "dyte";
  } else if (t === "chaos mesh" || t === "chaos-mesh") {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts", "styles.config.json"];
    templateDir = "chaos-mesh";
  } else if (t === "homarr") {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts"];
    templateDir = "homarr";
  } else {
    foldersToDownload = ["static", "src"];
    filesToDownload = ["package.json", "docusaurus.config.ts", "sidebars.ts"];
    templateDir = "default";
  }

  const templateUrl = `${repoBaseUrl}/${templateDir}`;
  console.log(chalk.blue(`📦 Downloading template files from ${templateUrl}...`));

  // Limpa e recria pastas alvo
  for (const folder of foldersToDownload) {
    const localFolderPath = path.join(targetDir, folder);
    if (await fs.pathExists(localFolderPath)) {
      console.log(chalk.yellow(`🗑️ Removing existing folder: ${localFolderPath}`));
      await fs.remove(localFolderPath);
    }
    await fs.ensureDir(localFolderPath);
  }

  for (const folder of foldersToDownload) {
    await downloadFolder(`${templateUrl}/${folder}`, path.join(targetDir, folder));
  }

  for (const file of filesToDownload) {
    const localFilePath = path.join(targetDir, file);

    if (file !== "package.json" && (await fs.pathExists(localFilePath))) {
      console.log(chalk.yellow(`🗑️ Removing existing file: ${localFilePath}`));
      await fs.remove(localFilePath);
    }

    if (file === "package.json") {
      await mergePackageJson(`${templateUrl}/${file}`, targetDir);
    } else {
      await downloadFile(`${templateUrl}/${file}`, localFilePath);
    }
  }

  const templateInfoPath = path.join(targetDir, ".template-info.json");
  await fs.writeJson(
    templateInfoPath,
    { name: templateName, installed: new Date().toISOString() },
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
    console.warn(chalk.yellow(`⚠️ Could not access ${folderUrl}: ${error.message}`));
  }
}

async function downloadFile(fileUrl, localPath) {
  try {
    console.log(chalk.blue(`⬇️ Downloading ${fileUrl} to ${localPath}...`));
    if (fileUrl.includes("api.github.com")) {
      const response = await axios.get(fileUrl, { headers: { Accept: "application/vnd.github.v3+json" } });
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
    console.warn(chalk.yellow(`⚠️ Could not download ${fileUrl}: ${error.message}`));
  }
}

async function mergePackageJson(packageJsonUrl, targetDir) {
  try {
    console.log(chalk.blue(`🔄 Merging package.json from ${packageJsonUrl}...`));

    const templatePackageResponse = await axios.get(packageJsonUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    let templatePackage;
    if (templatePackageResponse.data.content) {
      const decodedContent = Buffer.from(templatePackageResponse.data.content, "base64").toString("utf8");
      templatePackage = JSON.parse(decodedContent);
    } else {
      throw new Error("⚠️ Template package.json doesn't contain valid data.");
    }

    const localPackagePath = path.join(targetDir, "package.json");
    let localPackage = {};
    if (await fs.pathExists(localPackagePath)) {
      const localContent = await fs.readFile(localPackagePath, "utf8");
      localPackage = JSON.parse(localContent);
    }

    const mergedPackage = {
      ...localPackage,
      scripts: {
        ...(localPackage.scripts || {}),
        // não sobrescreve scripts existentes; só adiciona os que faltam do template
        ...(templatePackage.scripts
          ? Object.fromEntries(
              Object.entries(templatePackage.scripts).filter(([k]) => !(localPackage.scripts || {})[k])
            )
          : {}),
      },
      dependencies: {
        ...(localPackage.dependencies || {}),
        ...(templatePackage.dependencies || {}),
      },
      devDependencies: {
        ...(localPackage.devDependencies || {}),
        ...(templatePackage.devDependencies || {}),
      },
    };

    await fs.writeFile(localPackagePath, JSON.stringify(mergedPackage, null, 2));
    console.log(chalk.green(`✅ package.json merged successfully!`));
  } catch (error) {
    console.error(chalk.red(`❌ Error merging package.json: ${error.message}`));
  }
}

async function downloadBinaryFile(url, localPath) {
  const response = await axios({ method: "get", url, responseType: "arraybuffer" });
  await fs.writeFile(localPath, response.data);
}

async function installDependencies(targetDir) {
  const { default: ora } = await import("ora");
  const installSpinner = ora("Installing template dependencies...").start();

  try {
    const hasYarnLock = await fs.pathExists(path.join(targetDir, "yarn.lock"));
    const hasPnpmLock = await fs.pathExists(path.join(targetDir, "pnpm-lock.yaml"));

    installSpinner.text = "Installing template dependencies";
    if (hasPnpmLock) {
      await runInstallCommand("pnpm", ["install", "--no-frozen-lockfile"], targetDir);
    } else if (hasYarnLock) {
      await runInstallCommand("yarn", ["install", "--no-lockfile"], targetDir);
    } else {
      await runInstallCommand("npm", ["install", "--no-package-lock"], targetDir);
    }

    installSpinner.succeed("Dependencies installed successfully!");
  } catch (error) {
    installSpinner.fail("Failed to install dependencies automatically");
    console.log(chalk.yellow("\n⚠️ Automatic installation failed."));
    console.log(chalk.blue("Please install dependencies manually:"));
    console.log(chalk.white(`   cd ${path.relative(process.cwd(), targetDir) || "."}`));
    console.log(chalk.white("   npm install  # or yarn / pnpm"));
    throw error;
  }
}

module.exports = configureTemplates;
