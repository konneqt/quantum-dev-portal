const chalk = require("chalk");

const templates = [
  "Chaos Mesh",
  "Dyte",
  "Homarr",
  "Default"
];

const listTemplates = () => {
  console.log(chalk.green("\n📜 Templates available:\n"));
  templates.forEach((template, index) => {
    console.log(chalk.blue(`${index + 1}. ${template}`));
  });

  console.log("\n");
};

module.exports = listTemplates;
module.exports.templates = templates;