/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

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
    return baseConfig;
  }
};