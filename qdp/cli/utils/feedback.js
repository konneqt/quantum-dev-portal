const chalk = require("chalk");

const userFeedback = {
  info: (message) => console.log(chalk.blue(`ℹ️ `), message),
  success: (message) => console.log(chalk.green(`✔`), message),
  warning: (message) => console.log(chalk.yellow(`⚠️ `), message),
  error: (message) => console.log(chalk.red(`✖`), message),
  tip: (message) => console.log(chalk.cyan(`💡`), message),
  section: (title) => console.log(chalk.magenta(`\n== ${title} ==`)),
  list: (items, prefix = "-") =>
    items.forEach((item) => console.log(`  ${prefix} ${item}`)),
};


const handleHelp = () => {
  console.log(chalk.green("\nHelp Section:"));
  console.log(
    chalk.cyan(
      "1. Generate Docs: Creates documentation based on OpenAPI files."
    )
  );
  console.log(
    chalk.cyan(
      "2. Generate from URI: Fetches OpenAPI specs from a provided URI."
    )
  );
  console.log(
    chalk.cyan(
      "3. Generate from QAP: Fetches API specs from Quantum API Platform."
    )
  );
  console.log(chalk.magenta("\nUse the tool wisely!\n"));
};

module.exports = {
  userFeedback,
  handleHelp,
};