import { addons, types } from '@storybook/addons';
import Panel from './storybookPanel';
import React from 'react';

let currentId;

// Called from the `addons.js` setup file
addons.register('fluid/sourcecode-addon', storybookAPI => {
  const channel = addons.getChannel();
  let rawSources;
  // making the source code available
  function fetchSources() {
    fetch('./rawSources.json')
      .then(response => response.json())
      .then(data => {
        if (!rawSources || currentId !== data.id) {
          currentId = data.id;
          rawSources = data.files;
          channel.emit('sourceCode/rawSources', data.files);
        }
      });
  }

  fetchSources();

  // setInterval(fetchSources, 1000);

  // adding the tab with the sourcecode
  addons.add('fluid/sourcecode-addon/panel', {
    type: types.TAB,
    title: 'Source',
    route: ({ storyId }) => `/sourceCode/${storyId}`,
    match: ({ viewMode }) => viewMode === 'sourcecode',
    // eslint-disable-next-line react/display-name
    render: ({ active }) => {
      return React.createElement(Panel, {
        channel: addons.getChannel(),
        storybookAPI,
        active,
        rawSources,
      })
    },
  });

})
