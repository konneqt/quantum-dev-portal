#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { copyLocalQDP } = require("./utils/copyLocalQdp");

const runCommandVisible = async (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: true,
      stdio: 'inherit'
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code) => {
      code === 0
        ? resolve()
        : reject(new Error(`Command failed with exit code ${code}`));
    });
  });
};

// Garante que exista um docusaurus.config.* no diretório atual
const ensureDocusaurusConfig = async () => {
  const configCandidates = [
    "docusaurus.config.ts",
    "docusaurus.config.js",
    "docusaurus.config.cjs",
    "docusaurus.config.mjs"
  ];

  const found = configCandidates.some(file =>
    fs.existsSync(path.join(process.cwd(), file))
  );

  if (!found) {
    console.log(chalk.yellow("⚠️ Nenhum arquivo docusaurus.config.* encontrado. Copiando estrutura local do QDP..."));
    await copyLocalQDP();
  }
};

const startServer = async () => {
  try {
    const { default: ora } = await import("ora");
    const spinner = ora("Starting documentation server...").start();

    // garante que a estrutura existe
    await ensureDocusaurusConfig();

    spinner.succeed("Environment prepared successfully!");

    console.log(chalk.green(`\n🚀 Starting documentation server...`));
    console.log(chalk.gray('Press Ctrl+C to stop the server\n'));

    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping documentation server...'));
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\n🛑 Stopping documentation server...'));
      process.exit(0);
    });

    // tenta iniciar o servidor
    try {
      await runCommandVisible('npm', ['start'], { cwd: process.cwd() });
    } catch {
      console.log(chalk.yellow('Trying alternative method...'));
      try {
        await runCommandVisible('yarn', ['start'], { cwd: process.cwd() });
      } catch {
        try {
          await runCommandVisible('npx', ['docusaurus', 'start'], { cwd: process.cwd() });
        } catch {
          try {
            await runCommandVisible('node', ['node_modules/.bin/docusaurus', 'start'], { cwd: process.cwd() });
          } catch {
            throw new Error('All startup methods failed');
          }
        }
      }
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Error starting documentation server:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

startServer();
