module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          alias: {
            '@app': './src/app',
            '@context': './src/context',
            '@features': './src/features',
            '@infra': './src/infra',
            '@shared': './src/shared',
          },
        },
      ],
      'react-native-reanimated/plugin',
      ["inline-import", { extensions: [".sql"] }],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: false,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
    ],
  };
};
