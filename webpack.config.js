/*
 * Copyright 2018 dialog LLC <info@dlg.im>
 */

const fs = require('fs');
const path = require('path');

function resolve(...paths) {
  return fs.realpathSync(path.join(__dirname, ...paths));
}

const whitelist = [
  resolve('src'),
  resolve('node_modules/@dlghq/markdown'),
  resolve('node_modules/@dlghq/react-l10n'),
  resolve('node_modules/@dlghq/dialog-types'),
  resolve('node_modules/@dlghq/dialog-utils'),
  resolve('node_modules/@dlghq/country-codes'),
];

const globalStyles = [
  resolve('src/styles/global.css'),
  resolve('src/components/MessageMediaInteractive/example/CodeMirror.css'),
  resolve('src/styleguide/styles.css'),
];

const postcssOptions = {
  env: {
    features: {
      'all-property': false,
    },
  },
};

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: whitelist,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: true,
          presets: [
            [
              '@dlghq/babel-preset-dialog',
              {
                modules: false,
                runtime: false,
                development: true,
              },
            ],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return require('@dlghq/postcss-dialog')(postcssOptions);
              },
            },
          },
        ],
        include: globalStyles,
      },
      {
        test: /\.css$/,
        include: whitelist,
        exclude: globalStyles,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return require('@dlghq/postcss-dialog')(postcssOptions);
              },
            },
          },
        ],
      },
      {
        test: /\.yml$/,
        include: whitelist,
        use: ['yml-loader'],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        exclude: resolve('src/components/Icon/svg'),
        use: ['file-loader'],
      },
      {
        test: /\.(svg)$/,
        include: resolve('src/components/Icon/svg'),
        use: ['svg-sprite-loader'],
      },
      {
        test: /\.txt$/,
        include: whitelist,
        use: ['raw-loader'],
      },
    ],
  },
};
