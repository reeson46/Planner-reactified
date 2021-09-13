import { Popover } from '@material-ui/core'
import React from 'react'
import { useState } from 'react';

const AddPopover = (props) => {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const resetInput = (e, value) => {
    if(e.keyCode === 13 && value != '') {
      setValue('');
    }
  }

  const onClose = () => {
    setValue('');
  }

  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={() => {
        props.onClose();
        onClose();
      }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: props.horizontal,
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
    >
      <input autoFocus={true} className="card bg-dark text-light add-input" type="text" 
      placeholder={props.placeholder} 
      value={value} 
      onChange={handleChange}
      onKeyDown={
        (e) => {
          props.handlePressEnter(e, value);
          resetInput(e, value);
        }}
      />
    </Popover>
  )
}

export default AddPopover
