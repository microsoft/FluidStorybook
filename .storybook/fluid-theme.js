/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  // UI
  appBg: '#404049',
  appBorderColor: '#fff',
  appBorderRadius: 0,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#fff',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#fff',
  barSelectedColor: '#1EA7FD',
  barBg: '#404049',

  // Form colors
  inputBg: '#fff',
  inputBorder: 'yellow',
  inputTextColor: '#fff',
  inputBorderRadius: 4,

  brandTitle: 'Fluid Playground',
  brandUrl: 'https://www.fluidframework.com/',
  brandImage: '',
});