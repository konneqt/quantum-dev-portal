#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

// Função para verificar se um comando existe
const commandExists = (command) => {
  return new Promise((resolve) => {
    exec(`which ${command}`, (error) => {
      resolve(!error);
    });
  });
};

// Função para executar comandos de forma mais robusta
const runCommand = async (command, args, options) => {
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

const ensureLocalQdpExists = async () => {
  const currentDir = process.cwd();
  const localQdpPath = path.join(currentDir, 'qdp');
  
  if (!fs.existsSync(localQdpPath)) {
    
    try {
      
      const globalQdpPath = path.dirname(require.resolve('qdp/package.json'));
      
      setupSpinner.text = `Copying from: ${globalQdpPath}`;
      
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
      console.error(chalk.red('Failed to setup local environment'));
      throw error;
    }
  }
  
  return localQdpPath;
};

const startServer = async () => {
  try {
    const { default: ora } = await import("ora");
    
    // Garante que o ambiente local existe (integração com o novo sistema)
    const localQdpPath = await ensureLocalQdpExists();
    
    // Verifica se existem APIs na pasta local
    const apisPath = path.join(localQdpPath, 'cli', 'apis');
    const docsPath = path.join(localQdpPath, 'docs');
    
    if (fs.existsSync(apisPath)) {
      const apiFiles = fs.readdirSync(apisPath).filter(file => 
        file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml')
      );
      
      if (apiFiles.length > 0) {
        console.log(chalk.green(`Installing dependencies for ${apiFiles.length} API files...`));
      } else {
        console.log(chalk.yellow('⚠️  No API files found in local environment.'));
        console.log(chalk.blue('💡 Run "qdp" first to upload and generate documentation.'));
      }
    }
    
    // Verifica se existem docs gerados
    if (fs.existsSync(docsPath) && fs.readdirSync(docsPath).length > 0) {
      console.log(chalk.green('📄 Documentation found.'));
    } else {
      console.log(chalk.yellow('⚠️  No documentation found.'));
      console.log(chalk.blue('💡 Run "qdp" to generate documentation from your API files.'));
    }
    
    // Verifica se node_modules existe
    const nodeModulesPath = path.join(localQdpPath, 'node_modules');
    if (!await fs.pathExists(nodeModulesPath)) {
      const installSpinner = ora("Installing dependencies...").start();
      
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
        
        installSpinner.succeed("Dependencies installed!");
        
      } catch (error) {
        installSpinner.fail("Failed to install dependencies automatically");
        
        console.log(chalk.yellow('\n⚠️  Automatic installation failed.'));
        console.log(chalk.blue('Please install dependencies manually:'));
        console.log(chalk.white(`   cd ${path.relative(process.cwd(), localQdpPath)}`));
        console.log(chalk.white('   npm install  # or yarn install'));
        console.log(chalk.white('   npm start    # or yarn start'));
        console.log(chalk.yellow('\nThen run qdp-start again.'));
        return;
      }
    } else {
      console.log(chalk.green('✅ Dependencies already installed.'));
    }
    
    // Inicia o servidor
    console.log(chalk.green(`\n🚀 Starting documentation server...`));
    console.log(chalk.gray('Press Ctrl+C to stop the server\n'));
    
    // Tratamento de sinais para encerramento limpo
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Stopping documentation server...'));
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\n🛑 Stopping documentation server...'));
      process.exit(0);
    });
    
    // Tenta diferentes comandos para iniciar
    try {
      await runCommand('npm', ['start'], { cwd: localQdpPath });
    } catch (npmError) {
      console.log(chalk.yellow('npm start failed, trying yarn...'));
      try {
        await runCommand('yarn', ['start'], { cwd: localQdpPath });
      } catch (yarnError) {
        console.log(chalk.yellow('yarn start failed, trying npx...'));
        try {
          await runCommand('npx', ['docusaurus', 'start'], { cwd: localQdpPath });
        } catch (npxError) {
          console.log(chalk.yellow('npx failed, trying direct approach...'));
          try {
            await runCommand('node', ['node_modules/.bin/docusaurus', 'start'], { cwd: localQdpPath });
          } catch (nodeError) {
            throw new Error('All start methods failed');
          }
        }
      }
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error starting documentation server:'));
    console.error(chalk.red(error.message));
    
    const localQdpPath = path.join(process.cwd(), 'qdp');
    if (await fs.pathExists(localQdpPath)) {
      console.log(chalk.yellow('\n💡 Troubleshooting:'));
      console.log(chalk.white('1. Make sure you have generated documentation:'));
      console.log(chalk.white('   qdp'));
      console.log(chalk.white('\n2. Try manual start:'));
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