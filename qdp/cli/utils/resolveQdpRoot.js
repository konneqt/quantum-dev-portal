const path = require("path");
const fs = require("fs-extra");

const resolveQdpRoot = () => {
  try {
    return path.dirname(require.resolve("@RaianeCoimbra/qdp/package.json"));
  } catch {
    // Tenta subir até encontrar o package.json com qdp
    let dir = __dirname;
    let depth = 0;

    while (depth < 10) {
      const potentialRoot = path.resolve(dir, "../".repeat(depth));
      const pkgPath = path.join(potentialRoot, "package.json");

      if (fs.existsSync(pkgPath)) {
        const pkg = fs.readJsonSync(pkgPath);
        if (pkg.name === "@RaianeCoimbra/qdp" || (pkg.dependencies && pkg.dependencies["@RaianeCoimbra/qdp"])) {
          return potentialRoot;
        }
      }

      depth++;
    }

    throw new Error("Unable to resolve QDP root path.");
  }
};

module.exports = { resolveQdpRoot };
