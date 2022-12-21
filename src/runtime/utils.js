const glob = require("glob");
const babylon = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const chalk = require("chalk");
const Log = require("./log");
const _find = require("lodash.find");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

const babylonOptions = {
  sourceType: `unambigious`,
  allowImportExportEverywhere: true,
  plugins: [
    `jsx`,
    `flow`,
    `doExpressions`,
    `objectRestSpread`,
    [
      `decorators`,
      {
        decoratorsBeforeExport: true,
      },
    ],
    `classProperties`,
    `classPrivateProperties`,
    `classPrivateMethods`,
    `exportDefaultFrom`,
    `exportNamespaceFrom`,
    `asyncGenerators`,
    `functionBind`,
    `functionSent`,
    `dynamicImport`,
    `numericSeparator`,
    `optionalChaining`,
    `importMeta`,
    `bigInt`,
    `optionalCatchBinding`,
    `throwExpressions`,
    // `pipelineOperator`,
    `nullishCoalescingOperator`,
  ],
};

const createMapping = (srcDirPattern) => {
  Log.event(`Creating mapping for ${srcDirPattern}.`);

  const watchedFiles = new Set();
  // Find files by pattern.
  const paths = glob.sync(`${srcDirPattern}`);

  // Load files content (code.)
  const files = paths.map((filePath) => {
    return {
      code: loadNodeContent(filePath),
      filePath,
    };
  });

  // let pathsList = [] // Holds a list of  be used as watch list.
  let configs = []; // Will hold extracted config object & path to file.

  files.forEach(({ code, filePath }) => {
    let config = {};

    watchedFiles.add(filePath);

    // Parse code & extract exported config metadata from files.
    try {
      const ast = babylon.parse(code, babylonOptions);
      config = findConfig(ast);

      if (config?.id) {
        configs.push({
          config,
          filePath,
        });
      } else {
        Log.warn(
          chalk.bold(
            `You are using a mapping file component without declaring "export const config = { }" in ${filePath}.`
          ) // @todo: add link to docs.
        );
      }
    } catch (e) {
      console.log(e);
      Log.error(chalk.bold(`Failed to parse ast ${filePath}.`));
    }
  });

  return configs;
};

const parseConfig = function parseConfig(node) {
  let value;

  if (node.type === `TemplateLiteral`) {
    // Experimental basic support for template literals:
    // Extract and join any text content; ignore interpolations
    value = node.quasis.map((quasi) => quasi.value.cooked).join(``);
  } else if (node.type === `ObjectExpression`) {
    value = {};
    node.properties.forEach((elem) => {
      value[elem?.key?.name || elem.key.value] = parseConfig(elem.value);
    });
  } else if (node.type === `ArrayExpression`) {
    value = node.elements.map((elem) => parseConfig(elem));
  } else if (node.type === `FunctionExpression`) {
    value = generator(node, { retainFunctionParens: true }).code;
  } else {
    value = node.value;
  }

  return value;
};

const findConfig = (ast) => {
  let config = {};
  traverse(ast, {
    AssignmentExpression: function AssignmentExpression(astPath) {
      if (
        astPath.node.left.type === `MemberExpression` &&
        astPath.node.left.property.name === `config`
      ) {
        astPath.node.right.properties.forEach((node) => {
          config[node.key.name] = parseConfig(node.value);
        });
      }
    },
    ExportNamedDeclaration: function ExportNamedDeclaration(astPath) {
      const { declaration } = astPath.node;
      if (declaration && declaration.type === `VariableDeclaration`) {
        const dataVariableDeclarator = _find(
          declaration.declarations,
          (d) => d.id.name === `config`
        );

        if (dataVariableDeclarator && dataVariableDeclarator.init) {
          dataVariableDeclarator.init.properties.forEach((node) => {
            config[node.key.name] = parseConfig(node.value);
          });
        }
      }
    },
  });
  return config;
};

function loadNodeContent(filePath) {
  return fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
}

const getWorkingDirectory = () => {
  return path.resolve(__dirname, process.cwd());
};

const createMappingFile = (exportPath, code) => {
  fse.ensureFileSync(exportPath);
  fs.writeFileSync(exportPath, code);
};

module.exports = {
  createMapping,
  getWorkingDirectory,
  createMappingFile,
};
