import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  // UI
  appBg: 'white',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#000',
  barSelectedColor: '#1AA8E6',
  barBg: '#efefef',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'Fluid Playground',
  brandUrl: 'https://www.fluidframework.com/',
  brandImage: '',
});