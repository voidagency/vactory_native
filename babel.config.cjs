const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: [path.resolve("./")],
          alias: {
            "@vactory": "./src",
            "@runtime": ["./.runtime"],
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
