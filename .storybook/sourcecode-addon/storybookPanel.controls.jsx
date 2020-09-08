/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState, useCallback } from 'react'

import {
  MenuItem,
  Classes,
  Icon,
  Button,
  ControlGroup,
} from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'

import '@blueprintjs/core/lib/css/blueprint.css'
import './storybookPanel.css'

const SourceCodePanelControls = props => {
  const {
    filePath,
    fileState,
    setFileState,
    files,
    handleToggleCompiled,
    handleFileChange,
    showCompiled,
  } = props

  const [query, setQuery] = useState('')

  const handleBack = () =>
    setFileState({
      history: fileState.history,
      idx: Math.max(0, fileState.idx - 1),
    })
  const handleForward = () =>
    setFileState({
      history: fileState.history,
      idx: Math.min(fileState.idx + 1, fileState.history.length - 1),
    })

  const renderItem = useCallback(
    (option, { modifiers, handleClick }) => {
      const currentlySelected = filePath === option
      return (
        <MenuItem
          className={`${Classes.TEXT_SMALL} Editor_Menu_Item`}
          key={option}
          icon={
            <Icon icon={currentlySelected ? 'tick' : 'blank'} iconSize={12} />
          }
          active={currentlySelected}
          text={option}
          shouldDismissPopover={false}
          onClick={handleClick}
        />
      )
    },
    [filePath]
  )

  return (
    <ControlGroup>
      <Button
        disabled={fileState.idx === 0}
        icon="step-backward"
        onClick={handleBack}
      />
      <Button
        disabled={fileState.idx === fileState.history.length - 1}
        icon="step-forward"
        onClick={handleForward}
      />
      <Select
        items={files.filter(option =>
          option.toLowerCase().includes(query.toLowerCase())
        )}
        itemRenderer={renderItem}
        onItemSelect={handleFileChange}
        popoverProps={{ minimal: true }}
        onQueryChange={setQuery}
      >
        <Button
          text={filePath || 'Select a file'}
          rightIcon="double-caret-vertical"
        />
      </Select>
      {/* <Button
        active={showCompiled}
        text="Compiled"
        onClick={handleToggleCompiled}
      /> */}
    </ControlGroup>
  )
}

export default SourceCodePanelControls
