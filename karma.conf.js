const path = require('path');
const webpack = require('webpack');

module.exports = (config) => {
  config.set({
    browsers: ['Chrome'],
    files: [
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      { pattern: '**/*.spec.ts', watched: false }
    ],
    frameworks: ['jasmine'],
    mime: { 'text/x-typescript': ['ts'] },
    preprocessors: {
      '*.js': ['sourcemap'],
      '**/*.spec.ts': ['sourcemap', 'webpack']
    },
    reporters: ['spec'],
    webpack: {
      devtool: 'sourcemap',
      module: {
        rules: [
          {
            test: /\.html$/,
            loaders: ['raw-loader']
          },
          {
            test: /\.scss$/,
            loaders: ['raw-loader', 'sass-loader']
          },
          {
            test: /\.ts$/,
            loaders: ['awesome-typescript-loader', 'angular2-template-loader']
          }
        ]
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        })
      ],
      resolve: {
        extensions: ['.ts', '.js']
      }
    }
  });
};
