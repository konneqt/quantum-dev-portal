#!/usr/bin/env node

const { init, askMenuOptions, askQapOptions, askTemplateOptions } = require('./utils/ui');
const { handleHelp } = require('./utils/feedback');
const { uploadOpenAPIFiles } = require('./services/openApiUploader');
const { generateDocsFromFiles, generateDocsFromURI } = require('./services/docsGenerator');
const { configureAccessInfo, cleanAccessInfo, useConfiguredAccessInfo } = require('./services/qapService');
const templates = require('./configureTemplates/listTemplates');
const configureTemplates = require('./configureTemplates/index');
const chalk = require('chalk');

// Função principal do QAP
const generateDocsFromQAP = async () => {
  try {
    init();
    const { option } = await askQapOptions();

    switch (option) {
      case "Configure Access Info":
        await configureAccessInfo();
        break;
      case "Clean stored Access Info":
        await cleanAccessInfo();
        break;
      case "Use configured stored Access Info":
        await useConfiguredAccessInfo();
        break;
      case "Back":
        await run();
        break;
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(chalk.red("An error occurred"));
  }
};

const handleTemplate = async () => {
  try {
    init();
    const { option } = await askTemplateOptions();

    switch (option) {
      case "List Templates":
        await templates();
        break;
      case "Use Templates":
        await configureTemplates();
        break;
      case "Back":
        await run();
        break;
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    console.error(
      chalk.red("An error occurred when configuring the template"),
      error
    );
  }
};

const run = async () => {
  try {
    init();
    const { option } = await askMenuOptions();

    switch (option) {
      case "Help":
        handleHelp();
        break;
      case "Upload OpenAPI Files":
        await uploadOpenAPIFiles();
        break;
      case "Generate Docs based on OpenAPIs Files":
        await generateDocsFromFiles();
        break;
      case "Generate Docs from OpenAPI URI":
        await generateDocsFromURI();
        break;
      case "Generate Docs from QAP Control Plane Instance":
        await generateDocsFromQAP();
        break;
      case "Choose a Template":
        await handleTemplate();
        break;
      case "Exit":
        console.log(chalk.green("Exiting application!"));
        process.exit(0);
      default:
        console.log(chalk.red("Invalid option selected."));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(chalk.red(`${error.response.data.message}`));
    } else {
      console.error(chalk.red("An error ocurred", error));
    }
  }
};

run();