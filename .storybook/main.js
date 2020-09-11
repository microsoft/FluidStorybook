/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.*'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs', // Enables MDX
    './sourcecode-addon/register'
  ],
  webpack: async (baseConfig, options) => {
    const isProd = options.configType === "PRODUCTION";
    baseConfig.mode = options.configType.toLowerCase();
    baseConfig.optimization.minimize = isProd;
    baseConfig.devtool = isProd ? undefined : "inline-source-map";

    // Add hook to run src viewer builder (creates rawSources.json)
    // Used for local builds to keep files in-sync
    baseConfig.plugins.push(new HookShellScriptPlugin({
      afterEmit: ['node src-viewer-build.js']
    }));
    
    return baseConfig;
  }
};