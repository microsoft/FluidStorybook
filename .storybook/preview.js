import sourceCodeDecorator from './sourcecode-addon/sourceCodeDecorator';
import { storySort } from './storySort';

export const decorators = [sourceCodeDecorator];

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
	viewMode: 'docs'
}

