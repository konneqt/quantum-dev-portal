#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: true,
      stdio: 'inherit'
    });

    child.on('error', reject);
    child.on('close', code => {
      code === 0
        ? resolve()
        : reject(new Error(`Command "${command} ${args.join(' ')}" failed with exit code ${code}`));
    });
  });
};

const deployDocs = async () => {
  const projectPath = process.cwd();
  console.log(chalk.cyan('\n🚀 Building and deploying Docusaurus project...\n'));

  try {
    await runCommand('npx', ['docusaurus', 'build'], projectPath);
    await runCommand('npx', ['docusaurus', 'deploy'], projectPath);
    console.log(chalk.green('\n✅ Deployment completed successfully.\n'));
  } catch (err) {
    console.error(chalk.red(`\n❌ Failed to deploy project:\n${err.message}\n`));
    process.exit(1);
  }
};

deployDocs();
