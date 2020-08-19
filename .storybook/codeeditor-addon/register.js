import { addons, types } from '@storybook/addons';
import Panel from './storybookPanel';
import React from 'react';

// Called from the `addons.js` setup file
addons.register('fluid/codeeditor-addon', storybookAPI => {
  const channel = addons.getChannel();
  
  // adding the tab with the sourcecode
  addons.add('fluid/codeeditor-addon/panel', {
    type: types.TAB,
    title: 'Code Editor',
    route: ({ storyId }) => `/codeeditor/${storyId}`,
    match: ({ viewMode }) => viewMode === 'codeeditor',
    // eslint-disable-next-line react/display-name
    render: ({ active }) => {
      return React.createElement(Panel, {
        channel: addons.getChannel(),
        storybookAPI,
        active
      })
    },
  });

})
