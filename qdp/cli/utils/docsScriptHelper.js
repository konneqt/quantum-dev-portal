const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const chalk = require("chalk");
const { userFeedback } = require("./feedback");

// Função para verificar se um comando está disponível
const commandExists = (command) => {
  return new Promise((resolve) => {
    exec(`which ${command}`, (error) => {
      resolve(!error);
    });
  });
};

// Função para executar comandos de forma mais robusta
const execCommand = (command, workingDir) => {
  return new Promise((resolve, reject) => {
    
    exec(command, { 
      cwd: workingDir,
      env: { ...process.env, NODE_ENV: 'development' }
    }, (error, stdout, stderr) => {
      
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

// Função para detectar o gerenciador de pacotes disponível
const detectPackageManager = async (rootDir) => {
  // Verifica se yarn está realmente disponível
  const yarnExists = await commandExists('yarn');
  const npmExists = await commandExists('npm');
  
  if (!npmExists) {
    throw new Error('npm is not available on the system');
  }

  // Se yarn existe e há yarn.lock, usa yarn
  if (yarnExists && fs.existsSync(path.join(rootDir, 'yarn.lock'))) {
    return 'yarn';
  }
  
  // Caso contrário, usa npm
  return 'npm run';
};

// Função para executar comandos do docusaurus
const runDocusaurusCommand = async (command, apiName, rootDir, pkgManager) => {
  let fullCommand;
  
  if (pkgManager === 'yarn') {
    fullCommand = apiName ? `yarn docusaurus ${command} ${apiName}` : `yarn docusaurus ${command}`;
  } else {
    fullCommand = apiName ? `npm run docusaurus -- ${command} ${apiName}` : `npm run docusaurus -- ${command}`;
  }
  
  return execCommand(fullCommand, rootDir);
};

// Função principal que substitui o script bash
const runRebuildDocsScript = async (workingDir = null) => {
  const { default: ora } = await import("ora");

  const docsSpinner = ora({
    text: "Generating documentation...",
    spinner: "dots",
  }).start();

  // Usa o diretório especificado ou o padrão
  const rootDir = workingDir || path.dirname(__dirname);
  const apisDir = path.join(rootDir, 'cli', 'apis');
  const docsDir = path.join(rootDir, 'docs');

  try {
    // Verifica se a pasta apis existe e tem arquivos
    if (!fs.existsSync(apisDir)) {
      throw new Error(`APIs directory not found: ${apisDir}`);
    }

    // Lista arquivos de API
    const apiFiles = fs.readdirSync(apisDir).filter(file => 
      file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')
    );

    if (apiFiles.length === 0) {
      throw new Error('No OpenAPI files found in apis directory');
    }

    // Garante que a pasta docs existe
    await fs.ensureDir(docsDir);

    // Detecta o gerenciador de pacotes disponível
    const pkgManager = await detectPackageManager(rootDir);
    
    // Verifica se o docusaurus está instalado
    const nodeModulesPath = path.join(rootDir, 'node_modules', '.bin', 'docusaurus');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('Installing Docusaurus and required packages...');
      await execCommand('npm install @docusaurus/core @docusaurus/preset-classic docusaurus-plugin-openapi-docs', rootDir);
    }

    // Processa cada arquivo de API
    for (const apiFile of apiFiles) {
      const apiName = path.parse(apiFile).name;
      console.log(`Processing API: ${apiName}`);

      try {
        // Limpa cache se existe
        const docusaurusDir = path.join(rootDir, '.docusaurus');
        if (fs.existsSync(docusaurusDir)) {
          await runDocusaurusCommand('clear', null, rootDir, pkgManager).catch(() => {
            console.log('Note: Could not clear cache, continuing...');
          });
        }

        // Limpa docs existentes (opcional, pode ignorar erros)
        await runDocusaurusCommand('clean-api-docs', apiName, rootDir, pkgManager).catch(() => {
          console.log(`Note: Could not clean existing docs for ${apiName}, continuing...`);
        });

        // Gera nova documentação
        await runDocusaurusCommand('gen-api-docs', apiName, rootDir, pkgManager);
        console.log(`✅ Documentation generated successfully for ${apiName}`);

      } catch (apiError) {
        console.log(`⚠️ Warning: Failed to generate docs for ${apiName}: ${apiError.message}`);
        // Continua com os outros arquivos em vez de falhar completamente
        continue;
      }
    }

    docsSpinner.succeed("Documentation generated successfully!");
    
    console.log(chalk.green("\n✅ All operations completed successfully!"));
    console.log(chalk.blue("🚀 To start the documentation server, run: ") + chalk.bold.yellow("qdp-start"));
    
    return true;

  } catch (error) {
    docsSpinner.fail("Documentation generation failed");
    console.error(`❌ Error: ${error.message}`);
    
    // Oferece alternativas
    console.log(chalk.yellow('\n💡 Troubleshooting options:'));
    console.log(chalk.white('1. Check if your OpenAPI files are valid'));
    console.log(chalk.white('2. Try running manually:'));
    console.log(chalk.white(`   cd ${rootDir}`));
    console.log(chalk.white('   npm install'));
    console.log(chalk.white('   npm run docusaurus gen-api-docs [api-name]'));
    console.log(chalk.white('3. Check the docusaurus.config.ts configuration'));
    console.log(chalk.white('4. Ensure you have a "docusaurus": "docusaurus" script in package.json'));
    
    return false;
  }
};

module.exports = {
  runRebuildDocsScript: runRebuildDocsScript,
};