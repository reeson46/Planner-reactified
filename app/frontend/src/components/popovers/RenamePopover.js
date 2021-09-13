import { Popover } from '@material-ui/core'
import React from 'react'

const RenamePopover = (props) => {
  const [value, setValue] = React.useState(props.name);
  
  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
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
      onKeyDown={(e) => props.handlePressEnter(e, value, props.id)} />
    </Popover>
  )
}

export default RenamePopover
