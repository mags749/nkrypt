const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add 'sql' to the asset extensions
config.resolver.assetExts.push("sql");

// Tamagui: resolve .native.js before .js for native platforms
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = config;
