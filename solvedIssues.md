# Error Loading MDX: Cannot read property 'path' of undefined

The `@mdx-js` version has a breaking change (should be short-term).

https://github.com/mdx-js/mdx/issues/1153

## Modifying output to be used in Hugo

.storybook/main.js webpack entrypoint is for the preview, not for the manager

manager = broader UI
preview = inner guy

## How to add a container around a story

import { addons } from '@storybook/addons';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';

export const containerParams = {
  docs: {
    container: ({ children, context }) => {
      const channel = addons.getChannel();
      channel.emit('sourcecode/selectedStory', context.parameters.fileName);
      return (
        <DocsContainer context={context}>
          <div>{children}</div>
        </DocsContainer>
      );
    }
  }
};

{/* <Meta parameters={{
  docs: {
    container: ({ children, context }) => {
      const channel = addons.getChannel();
      channel.emit('sourcecode/selectedStory', context.parameters.fileName);
      return (
        <DocsContainer context={context}>
          <div>{children}</div>
        </DocsContainer>
      );
    }
  }
}} /> */}