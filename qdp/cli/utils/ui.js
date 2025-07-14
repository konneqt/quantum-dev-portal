const inquirer = require("inquirer");
const figlet = require("figlet");
const clear = require("clear");
const chalk = require("chalk");
const pjson = require("../../package.json");

const OPTIONS = [
  "Help",
  "Upload OpenAPI Files",
  "Generate Docs based on OpenAPIs Files",
  "Generate Docs from OpenAPI URI",
  "Generate Docs from QAP Control Plane Instance",
  "Choose a Template",
  "Exit",
];

const QAP_OPTIONS = [
  "Configure Access Info",
  "Clean stored Access Info",
  "Use configured stored Access Info",
  "Back",
];

const TEMPLATE_OPTIONS = ["List Templates", "Use Templates", "Back"];

const MENU_LOGO = `
===================================================================    
     Quantum API Dev Portal -  ${pjson.version} 
===================================================================
    `;

const init = () => {
  clear();
  console.log(chalk.magenta(figlet.textSync("Konneqt", { font: "Ogre" })));
  console.log(chalk.magenta(MENU_LOGO));
};

const askMenuOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: OPTIONS,
    },
  ]);
};

const askQapOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: QAP_OPTIONS,
    },
  ]);
};

const askTemplateOptions = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Choose an option:",
      choices: TEMPLATE_OPTIONS,
    },
  ]);
};

module.exports = {
  init,
  askMenuOptions,
  askQapOptions,
  askTemplateOptions,
};