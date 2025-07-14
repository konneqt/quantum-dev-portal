
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const chalk = require("chalk");
const { userFeedback } = require("./feedback");

// Função para executar comandos de forma mais robusta
const execCommand = (command, workingDir) => {
  return new Promise((resolve, reject) => {
    
    exec(command, { 
      cwd: workingDir,
      env: { ...process.env, NODE_ENV: 'development' }
    }, (error, stdout, stderr) => {
      
      if (error) {
        console.log(`🔍 Debug: error:`, error.message);
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
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

    // Determina o gerenciador de pacotes
    const useYarn = fs.existsSync(path.join(rootDir, 'yarn.lock'));
    const pkgManager = useYarn ? 'yarn' : 'npm run';

    // Processa cada arquivo de API
    for (const apiFile of apiFiles) {
      const apiName = path.parse(apiFile).name;
      

      try {
        // Limpa cache se existe
        const docusaurusDir = path.join(rootDir, '.docusaurus');
        if (fs.existsSync(docusaurusDir)) {
          await execCommand(`${pkgManager} docusaurus clear`, rootDir).catch(() => {
            console.log('Note: Could not clear cache, continuing...');
          });
        }

        // Limpa docs existentes (opcional, pode ignorar erros)
        await execCommand(`${pkgManager} docusaurus clean-api-docs ${apiName}`, rootDir).catch(() => {
          console.log(`Note: Could not clean existing docs for ${apiName}, continuing...`);
        });

        await execCommand(`${pkgManager} docusaurus gen-api-docs ${apiName}`, rootDir);
        

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
    
    return false;
  }
};
module.exports = {
  runRebuildDocsScript: runRebuildDocsScript,
};
