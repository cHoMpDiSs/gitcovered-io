/* eslint-disable */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  webpack: {
    configure: (config) => {
      // Silences third-party source-map warnings from Radix Themes
      config.ignoreWarnings = [
        (warning) =>
          typeof warning.message === 'string' &&
          warning.message.includes('Failed to parse source map') &&
          warning.message.includes('@radix-ui/themes'),
      ];
      // Replace CssMinimizerPlugin with one that disables calc optimization
      if (config.optimization && Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer = config.optimization.minimizer.map((minimizer) => {
          if (minimizer.constructor && minimizer.constructor.name === 'CssMinimizerPlugin') {
            return new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  'default',
                  {
                    calc: false,
                  },
                ],
              },
            });
          }
          return minimizer;
        });
      }
      return config;
    },
  },
};


