import { addDecorator } from '@storybook/react'
import sourceCodeDecorator from './sourcecode-addon/storybookDecorator';
import codeEditorDecorator from './codeeditor-addon/codeeditorDecorator';
import { storySort } from './storySort';

addDecorator(sourceCodeDecorator);
addDecorator(codeEditorDecorator);

const sortOptions = {
  order: [
  'Welcome',
  'React Demos', ['Brainstorm', 'Draft-JS', 'Sudoku', 'Table', 'Image Gallery', 'ProseMirror', 'Dice Roller', 'Badge', 'Clicker'],
  'JS Demos',
  ]
};

export const parameters = {
  options: {
    /**
     * display the top-level grouping as a "root" in the sidebar
     * @type {Boolean}
     */
    showRoots: true,
    showPanel: false,
    storySort: storySort(sortOptions)
  },
	// viewMode: 'docs'
}

