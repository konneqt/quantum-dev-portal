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

const buildDocs = async () => {
  const projectPath = process.cwd();
  console.log(chalk.cyan('\n🛠️  Building Docusaurus project...\n'));

  try {
    await runCommand('npx', ['docusaurus', 'build'], projectPath);
    console.log(chalk.green('\n✅ Build completed successfully.\n'));
  } catch (err) {
    console.error(chalk.red(`\n❌ Failed to build project:\n${err.message}\n`));
    process.exit(1);
  }
};

buildDocs();
