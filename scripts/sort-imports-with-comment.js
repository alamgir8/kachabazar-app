// Node.js script to sort imports and add a comment separator for internal imports
const fs = require("fs");
const path = require("path");

const INTERNAL_PREFIXES = ["@/"]; // Add more if needed
const IMPORT_REGEX = /^import\s.+from\s.+;$/gm;

function isInternalImport(importLine) {
  return INTERNAL_PREFIXES.some(
    (prefix) =>
      importLine.includes(`from "${prefix}`) ||
      importLine.includes(`from '${prefix}`)
  );
}

function processFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const imports = code.match(IMPORT_REGEX);
  if (!imports) return;

  const externalImports = imports.filter((line) => !isInternalImport(line));
  const internalImports = imports.filter(isInternalImport);

  externalImports.sort();
  internalImports.sort();

  let newImports = "";
  if (externalImports.length) {
    newImports += externalImports.join("\n") + "\n";
  }
  if (internalImports.length) {
    newImports += "\n// Internal imports\n" + internalImports.join("\n") + "\n";
  }

  // Replace old imports with new imports
  const newCode = code
    .replace(IMPORT_REGEX, "")
    .replace(/^\s*/, "") // Remove old imports and leading whitespace
    .replace(/^/, newImports + "\n");

  fs.writeFileSync(filePath, newCode, "utf8");
  console.log(`Processed: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".jsx") ||
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx")
    ) {
      processFile(fullPath);
    }
  });
}

// Change this to your src directory
const SRC_DIR = path.join(__dirname, "../src");
walkDir(SRC_DIR);
