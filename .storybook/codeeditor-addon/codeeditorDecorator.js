import { addons, makeDecorator } from '@storybook/addons'

export default makeDecorator({
  name: 'withSourceInfo',
  parameterName: 'codeeditor',
  wrapper: (getStory, context) => {
    const channel = addons.getChannel();
    channel.emit('codeeditor/selectedStory', context);
    return getStory(context);
  },
})