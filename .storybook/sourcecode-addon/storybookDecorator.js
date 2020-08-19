import { addons, makeDecorator } from '@storybook/addons'

export default makeDecorator({
  name: 'withSourceInfo',
  parameterName: 'sourcecode',
  wrapper: (getStory, context) => {
    const channel = addons.getChannel();
    channel.emit('sourcecode/selectedStory', context.parameters.fileName);
    return getStory(context);
  },
})
