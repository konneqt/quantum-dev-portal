const chalk = require("chalk");

const templates = [
  "Chaos Mesh",
  "Dyte",
  "Homarr",
  "Default"
];

// URL da página que mostra todos os templates
const templatesGalleryUrl = "http://localhost:3002/quantum-dev-portal";

const listTemplates = () => {
  console.log(chalk.green("\n📜 Templates available:\n"));
  templates.forEach((template, index) => {
    console.log(chalk.blue(`${index + 1}. ${template}`));
  });
  
  console.log(chalk.yellow("\n🖼️  View all templates:"));
  console.log(chalk.cyan(`   ${templatesGalleryUrl}`));
  console.log("\n");
};

module.exports = listTemplates;
module.exports.templates = templates;