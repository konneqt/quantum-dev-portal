#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { resolveQdpRoot } = require("../utils/resolveQdpRoot");

// Função para verificar se um comando existe
const commandExists = (command) => {
  return new Promise((resolve) => {
    exec(`which ${command}`, (error) => {
      resolve(!error);
    });
  });
};

// Função para executar comandos de forma silenciosa
const runCommand = async (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      shell: true,
      stdio: 'pipe' // Captura saída em vez de mostrar
    });
    
    let stdout = '';
    let stderr = '';
    
    if (child.stdout) {
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }
    
    if (child.stderr) {
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('error', (error) => {
      reject(error);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
      }
    });
  });
};

// Função para executar comandos com saída visível (apenas para o servidor)
const runCommandVisible = async (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
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

const ensureLocalQdpExists = async (spinner) => {
  const currentDir = process.cwd();
  const localQdpPath = path.join(currentDir, "qdp");
  const globalQdpPath = resolveQdpRoot();

  // Se o QDP global NÃO estiver dentro de node_modules, assume que veio de repositório (evita cópia)
  if (!globalQdpPath.includes("node_modules")) {
    return globalQdpPath;
  }

  // Se já existir localmente, não precisa copiar
  if (fs.existsSync(localQdpPath)) {
    return localQdpPath;
  }

  spinner.text = "Setting up local qdp environment...";

  try {
    await fs.copy(globalQdpPath, localQdpPath, {
      filter: (src) => {
        const relativePath = path.relative(globalQdpPath, src);
        return (
          !relativePath.startsWith("node_modules") &&
          !relativePath.startsWith(".git") &&
          !relativePath.startsWith("build") &&
          !relativePath.startsWith(".next")
        );
      },
    });

    const necessaryDirs = ["cli/apis", "docs", "src/pages"];
    for (const dir of necessaryDirs) {
      await fs.ensureDir(path.join(localQdpPath, dir));
    }

    spinner.succeed("Local QDP environment ready!");
  } catch (err) {
    spinner.fail("Failed to setup local QDP environment.");
    throw err;
  }

  return localQdpPath;
};


const checkEnvironment = async (localQdpPath) => {
  const apisPath = path.join(localQdpPath, 'cli', 'apis');
  const docsPath = path.join(localQdpPath, 'docs');
  
  let hasApis = false;
  let hasDocs = false;
  
  if (fs.existsSync(apisPath)) {
    const apiFiles = fs.readdirSync(apisPath).filter(file => 
      file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml')
    );
    hasApis = apiFiles.length > 0;
  }
  
  if (fs.existsSync(docsPath) && fs.readdirSync(docsPath).length > 0) {
    hasDocs = true;
  }
  
  return { hasApis, hasDocs };
};

const setupDependencies = async (localQdpPath, spinner) => {
  const nodeModulesPath = path.join(localQdpPath, 'node_modules');
  
  if (!await fs.pathExists(nodeModulesPath)) {
    spinner.text = 'Preparing required components...';
    
    try {
      // Tenta diferentes abordagens para instalar
      const hasNpm = await commandExists('npm');
      const hasYarn = await commandExists('yarn');
      const hasPnpm = await commandExists('pnpm');
      
      if (hasNpm) {
        await runCommand('npm', ['install'], { cwd: localQdpPath });
      } else if (hasYarn) {
        await runCommand('yarn', ['install'], { cwd: localQdpPath });
      } else if (hasPnpm) {
        await runCommand('pnpm', ['install'], { cwd: localQdpPath });
      } else {
        throw new Error('No package manager found (npm, yarn, or pnpm)');
      }
      
    } catch (error) {
      spinner.fail("Failed to prepare components");
      
      console.log(chalk.yellow('\n⚠️  Could not prepare automatically.'));
      console.log(chalk.blue('Please run manually:'));
      console.log(chalk.white(`   cd ${path.relative(process.cwd(), localQdpPath)}`));
      console.log(chalk.white('   npm install  # or yarn install'));
      console.log(chalk.white('   npm start    # or yarn start'));
      console.log(chalk.yellow('\nThen run qdp-start again.'));
      return false;
    }
  }
  
  return true;
};

const startServer = async () => {
  let setupSpinner; 
  try {
    const { default: ora } = await import("ora");
    
    setupSpinner = ora("Starting documentation server...").start();
    
    const localQdpPath = await ensureLocalQdpExists(setupSpinner);
    
    const { hasApis, hasDocs } = await checkEnvironment(localQdpPath);
    
    const dependenciesReady = await setupDependencies(localQdpPath, setupSpinner);
    
    if (!dependenciesReady) {
      return;
    }
    
    setupSpinner.succeed("Environment prepared successfully!");
    
    if (!hasApis && !hasDocs) {
      console.log(chalk.yellow('\n⚠️  No content found.'));
      console.log(chalk.blue('💡 Run "qdp" first to generate documentation.'));
    } else {
      if (hasApis) {
        console.log(chalk.green('✅ APIs found.'));
      }
      if (hasDocs) {
        console.log(chalk.green('✅ Documentation found.'));
      }
    }
    
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
    
    try {
      await runCommandVisible('npm', ['start'], { cwd: localQdpPath });
    } catch (npmError) {
      console.log(chalk.yellow('Trying alternative method...'));
      try {
        await runCommandVisible('yarn', ['start'], { cwd: localQdpPath });
      } catch (yarnError) {
        try {
          await runCommandVisible('npx', ['docusaurus', 'start'], { cwd: localQdpPath });
        } catch (npxError) {
          try {
            await runCommandVisible('node', ['node_modules/.bin/docusaurus', 'start'], { cwd: localQdpPath });
          } catch (nodeError) {
            throw new Error('All startup methods failed');
          }
        }
      }
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error starting documentation server:'));
    console.error(chalk.red(error.message));
    
    const localQdpPath = path.join(process.cwd(), 'qdp');
    if (await fs.pathExists(localQdpPath)) {
      console.log(chalk.yellow('\n💡 Solutions:'));
      console.log(chalk.white('1. Make sure you have generated documentation:'));
      console.log(chalk.white('   qdp'));
      console.log(chalk.white('\n2. Try starting manually:'));
      console.log(chalk.white(`   cd ${path.relative(process.cwd(), localQdpPath)}`));
      console.log(chalk.white('   npm install && npm start'));
      console.log(chalk.white('\n3. Alternative methods:'));
      console.log(chalk.white('   yarn install && yarn start'));
      console.log(chalk.white('   npx docusaurus start'));
    } else {
      console.log(chalk.yellow('\n💡 Local environment not found.'));
      console.log(chalk.white('Run "qdp" first to set up the environment and generate documentation.'));
    }
    
    process.exit(1);
  }
};

startServer();