/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const SourcePlugin = require('./sourcecode-addon/webpackPlugin');
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.*'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs', // Enables MDX
    './sourcecode-addon/register'
  ],
  webpackFinal: async (config) => {
    // Used by sourcecode-addon. Add loader that registers raw source code in a cache and display it in the Source tab.'
    config.module.rules.push({
      test: /\.jsx$|\.tsx$|\.css$|\.ts$|\.js$|\.mdx$/,
      use: [
        {
          loader: path.resolve(__dirname, 'sourcecode-addon/webpackLoader.js'),
          options: { root: path.resolve(__dirname, '../src') },
        },
      ],
    });

    // Breaks some packages (such as @fluidframework/test-runtime-utils) so pulling out since
    // getting the compiled code is low priority
    // // Used by sourcecode-addon. Add loader that registers compiled source code in a cache and display it in the Source tab.
    // config.module.rules.unshift({
    //   test: /\.jsx$|\.tsx$|\.css$|\.ts$|\.js$|\.mdx$/,
    //   use: [
    //     {
    //       loader: path.resolve(__dirname, 'sourcecode-addon/webpackLoader.js'),
    //       options: {
    //         root: path.resolve(__dirname, '../src'),
    //         compiled: true,
    //       },
    //     },
    //   ],
    // });

    // Used by sourcecode-addon. Add plugin that collects the source code.
    config.plugins.push(new SourcePlugin());

    // prevent filename mangling (which b0rks source file switching)
    config.mode = 'development';

    // prevent minification
    config.optimization.minimizer = [];

    return config;
  }
};