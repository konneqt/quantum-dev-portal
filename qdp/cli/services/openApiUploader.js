const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { userFeedback } = require("../utils/feedback");
const validateOpenAPISpec = require("../../utils/validateOpenApiFile.js");
const { generateDocsFromFiles } = require("./docsGenerator");

// Função auxiliar que garante que a pasta local qdp existe
const ensureLocalQdpExists = async () => {
  const currentDir = process.cwd();
  const localQdpPath = path.join(currentDir, 'qdp');
  
  if (!fs.existsSync(localQdpPath)) {
    const { default: ora } = await import("ora");
    
    try {
      
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
      
      
    } catch (error) {
      setupSpinner.fail("Failed to setup local environment");
      userFeedback.error('Failed to setup local environment');
      throw error;
    }
  }
  
  return localQdpPath;
};

const uploadOpenAPIFiles = async () => {
  const { default: ora } = await import("ora");
  const { default: chalk } = await import("chalk");
  const inquirer = require("inquirer");
  const fs = require("fs-extra");
  const path = require("path");

  // MODIFICAÇÃO: Usa pasta local em vez da global
  const localQdpPath = await ensureLocalQdpExists();
  const targetDir = path.join(localQdpPath, "cli", "apis");

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
            const validation = validateOpenAPISpec(p);
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
    if (!results) return;
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
    if (!results) return; 
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

const processFiles = async (files, targetDir) => {
  const { default: ora } = await import("ora");
  const { default: chalk } = await import("chalk");
  const fs = require("fs-extra");
  const path = require("path");

  await fs.ensureDir(targetDir);

  const spinner = ora("Processing OpenAPI files...").start();
  const results = { success: [], failed: [], criticalErrors: [] };

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const targetPath = path.join(targetDir, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const extension = path.extname(filePath).toLowerCase();
      const validation = validateOpenAPISpec(fileContent, extension);

      if (validation.valid) {
        fs.copySync(filePath, targetPath);
        results.success.push({
          name: fileName,
          path: targetPath,
          warnings: validation.warnings || [],
        });
        spinner.text = `Processed: ${fileName} ✅`;
      } else {
        results.failed.push({ name: fileName, error: validation.message });

        if (validation.message.includes("Missing required 'openapi' field")) {
          results.criticalErrors.push(fileName);
        }

        spinner.text = `Skipped: ${fileName} ❌`;
      }
    } catch (error) {
      results.failed.push({ name: fileName, error: error.message });
      spinner.text = `Error processing: ${fileName} ❌`;
    }
  }

  spinner.stop();

  if (results.success.length > 0) {
    console.log(
      chalk.green(`\nSuccessfully imported ${results.success.length} OpenAPI files:`)
    );
    results.success.forEach((file) => {
      console.log(chalk.green(`  - ${file.name}`));
      if (file.warnings?.length) {
        file.warnings.forEach((w) =>
          console.log(chalk.yellow(`    ⚠️ Warning: ${w}`))
        );
      }
    });
    
  }

  if (results.failed.length > 0) {
    console.log(chalk.red(`\nIssues found in ${results.failed.length} files:`));
    results.failed.forEach((file) => {
      console.log(chalk.red(`  - ${file.name}: ${file.error}`));
    });
  }

  if (
    results.success.length === 0 &&
    results.criticalErrors.length === results.failed.length
  ) {
    console.log(
      chalk.red(
        "\nAll files failed due to critical errors (e.g., missing 'openapi' field). Cannot proceed."
      )
    );
    return null;
  }

  return results;
};

module.exports = {
  uploadOpenAPIFiles,
  processFiles,
  ensureLocalQdpExists // Exporta para usar em outros arquivos
};