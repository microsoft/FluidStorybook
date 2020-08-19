import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './storybookPanel.css';

const CodeEditorPanel = props => {
  const { channel, rawSources: rawSourcesFromProps } = props

  useEffect(() => {
    channel.on('codeeditor/selectedStory', p => {
       // console.log(p);
    })
    return () => channel.removeListener('codeeditor/selectedStory');
  }, []);

  let wrapperClasses = classNames({
    'code-editor': true,
    'code-editor-hidden': !props.active
  });
  // if (!props.active) return null;

  return (
    <div className={wrapperClasses}>
      <iframe src="https://codesandbox.io/s/heuristic-shamir-l70q4"></iframe>
    </div>
  )
}

export default CodeEditorPanel;
