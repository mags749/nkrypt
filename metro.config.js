const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'sql' to the asset extensions
config.resolver.assetExts.push('sql');

// Tamagui: resolve .native.js before .js for native platforms
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
