const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'sql' to the asset extensions
config.resolver.assetExts.push('sql');

module.exports = config;