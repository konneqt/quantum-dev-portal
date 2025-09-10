const path = require("path");
const fs = require("fs-extra");
const { resolveQdpRoot } = require("./resolveQdpRoot");

/**
 * Copia apenas o conteúdo de dentro do QDP para o diretório local (sem criar a pasta ./qdp).
 *
 * @param {object} spinner
 * @returns {Promise<string>}
 */
async function copyLocalQDP(spinner) {
  const currentDir = process.cwd();
  const globalQdpPath = resolveQdpRoot();

  if (!globalQdpPath.includes("node_modules")) {
    return globalQdpPath;
  }

  // ✅ Verifica se já existe o docusaurus.config.ts na raiz local
  const configPath = path.join(currentDir, "docusaurus.config.ts");
  if (await fs.pathExists(configPath)) {
    if (spinner) spinner.succeed("Local QDP environment already exists!");
    return currentDir;
  }

  if (spinner) spinner.text = "Setting up local QDP environment...";

  try {
    // Copia **somente o conteúdo interno** da pasta QDP para a raiz do projeto
    const files = await fs.readdir(globalQdpPath);

    for (const file of files) {
      const src = path.join(globalQdpPath, file);
      const dest = path.join(currentDir, file);

      await fs.copy(src, dest, {
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
    }

    if (spinner) spinner.succeed("Local QDP environment ready!");
  } catch (err) {
    if (spinner) spinner.fail("Failed to setup local QDP environment.");
    throw err;
  }

  return currentDir;
}

module.exports = { copyLocalQDP };
