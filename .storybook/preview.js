import { configure, addDecorator } from '@storybook/react'
import { addParameters } from '@storybook/react';
// import { withConsole } from '@storybook/addon-console';
import sourceCodeDecorator from './sourcecode-addon/storybookDecorator';
import codeEditorDecorator from './codeeditor-addon/codeeditorDecorator';

addDecorator(sourceCodeDecorator);
addDecorator(codeEditorDecorator);

addParameters({
  options: {
    /**
     * display the top-level grouping as a "root" in the sidebar
     * @type {Boolean}
     */
    showRoots: true,
    showPanel: false
  },
});