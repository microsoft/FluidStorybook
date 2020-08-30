import { addons } from '@storybook/addons';

export default (getStory, context) => {
  const channel = addons.getChannel();
  const path = context.parameters.defaultSrcFile || context.parameters.fileName;
  channel.emit('sourcecode/selectedStory', path);
  return getStory(context);
}
