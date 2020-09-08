/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

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
    showPanel: false,
    storySort: storySort(sortOptions)
  },
	viewMode: 'docs'
}

