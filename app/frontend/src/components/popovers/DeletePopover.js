import React from 'react'
import { Popover } from '@material-ui/core'

const DeletePopover = (props) => {
  const [value, setValue] = React.useState('');
  
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
        horizontal: props.anchorX,
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: props.transformX,
      }}
    > 
      <div className="card shadow delete-window p-3">
        <div style={{whiteSpace: 'break-spaces'}} className="text-center text-warning fs-4 mb-2 mt-1">
          {`Are you sure you want to delete "${props.name}" ?`}
        </div>
        <div className="text-center text-danger fs-5 mb-3">
          {props.deleteMessage}
        </div>
        <div className="text-center text-white fs-6 mb-1 mb-2">
          To confirm this action, type "DELETE" below and press Enter, or press ESC to cancel
        </div>
        <input autoFocus={true} className="card bg-dark text-light" type="text" 
        placeholder={props.placeholder} 
        value={value} 
        onChange={handleChange}
        onKeyDown={(e) => props.handlePressEnter(e, value, props.id)} />
      </div>
    </Popover>
  )
}

export default DeletePopover