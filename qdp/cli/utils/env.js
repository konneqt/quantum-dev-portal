const fs = require("fs-extra");
const path = require("path");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");

const ENV_PATH = path.join(process.cwd(), ".env");

const loadEnv = () => {
  if (fs.existsSync(ENV_PATH)) {
    const envFile = fs.readFileSync(ENV_PATH, "utf-8");
    const envVars = envFile
      .split("\n")
      .filter((line) => line.trim() !== "")
      .reduce((acc, line) => {
        const [key, value] = line.split("=");
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
    return envVars;
  }
  return null;
};

const saveEnv = (envVars) => {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(ENV_PATH, envContent);
};

const isTokenValid = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload) {
      console.log(chalk.yellow("Invalid token format."));
      return false;
    }

    const { exp } = decoded.payload;

    if (exp && Date.now() >= exp * 1000) {
      console.log(chalk.yellow("Token has expired."));
      return false;
    }

    console.log(chalk.green("Token is valid."));
    return true;
  } catch (error) {
    console.error(chalk.red("Error decoding token:"), error);
    return false;
  }
};

module.exports = {
  loadEnv,
  saveEnv,
  isTokenValid,
};