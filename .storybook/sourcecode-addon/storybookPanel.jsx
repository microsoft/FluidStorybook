import React, { useEffect, useState } from 'react';
import Highlighter from './storybookHighlighter';
import path from 'path';
import SourceCodePanelControls from './storybookPanel.controls';

const SourceCodePanel = props => {
  const { channel, rawSources: rawSourcesFromProps } = props;
  const [fileState, setFileState] = useState({ history: [], idx: 0 });
  const [filteredFiles, setFilteredFiles] = useState([]);
  const filePath = fileState.history[fileState.idx] || '';
  const [rawSources, setRawSources] = useState(rawSourcesFromProps);
  const [showCompiled, setShowCompiled] = useState(false);
  const handleFileChange = (path, rs) => {
    if (rs) {
      const actualPath = matchPathToSource(path, rs);
      if (actualPath && actualPath !== filePath) {
        const newHistory = fileState.history
          .slice(0, fileState.idx + 1)
          .concat(actualPath);
        const newIdx = newHistory.length - 1;
        setFileState({ history: newHistory, idx: newIdx });
      } else {
        console.warn(
          'WARNING! Selected source path not found among rawSources',
          path
        )
      }
    }
  }
  
  const handleToggleCompiled = () => setShowCompiled(!showCompiled);

  useEffect(() => {
    channel.on('sourceCode/rawSources', newRawSources => {
      channel.removeListener('sourceCode/rawSources')
      setRawSources(newRawSources)
      if (filePath) {
        handleFileChange(filePath, newRawSources)
      }
    })
    return () => channel.removeListener('sourceCode/rawSources')
  }, [setRawSources]);

  useEffect(() => {
    channel.on('sourcecode/selectedStory', path => {
      if (rawSources) {
        handleFileChange(path, rawSources);

        // Filter files shown in drop-down to files associated with the files in the same base folder as "path"
        if (rawSources) {
          const filteredPaths = Object.keys(rawSources).filter((file, index) => {
            // Grab first part of path
            let firstOfPath = path.split('/').slice(2,4).join('/').toLowerCase();
            return file.toLowerCase().startsWith(firstOfPath);
          });
          setFilteredFiles(filteredPaths);
        }
      }
    })
    return () => channel.removeListener('sourcecode/selectedStory')
  }, [rawSources]);

  if (!props.active) return null;
  if (!rawSources) return <span>...loading...</span>;

  const files = Object.keys(rawSources).sort();
  const handleLinkClick = p => {
    const rel = path.join(filePath.replace(/\/[^/]*$/, '/'), p);
    const found = ['/index.jsx', '/index.js', '.jsx', '.js', '/index.tsx', '/index.ts', '.tsx', '.ts', '.css', '']
      .map(suff => rel + suff)
      .find(p => !!rawSources[p]);
    if (found) {
      handleFileChange(found, rawSources);
    } else {
      console.warn('WARNING - could not find corresponding file in list', rel);
    }
  }

  return (
    <div style={{ padding: '5px' }} className="sourcePanel">
      <SourceCodePanelControls
        filePath={filePath}
        fileState={fileState}
        setFileState={setFileState}
        files={filteredFiles}
        handleToggleCompiled={handleToggleCompiled}
        handleFileChange={i => handleFileChange(i, rawSources)}
        showCompiled={showCompiled}
      />
      <Highlighter
        language={
          !showCompiled && filePath.match(/.css$/) ? 'css' : 'javascript'
        }
        code={
          (rawSources[filePath] || {})[showCompiled ? 'compiled' : 'raw'] || ''
        }
        onLinkClick={handleLinkClick}
      />
    </div>
  )
}

export default SourceCodePanel

function matchPathToSource(path, rawSources) {
  const files = Object.keys(rawSources)
  return files.find(file => file.includes(path) || path.includes(file))
}
