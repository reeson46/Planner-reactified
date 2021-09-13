import React from 'react'
import { useEffect, useState } from 'react';

const StatusSelection = (props) => {
  const statuses = ['Planned', 'In Progress', 'Testing', 'Completed'];
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(props.currentStatus);
    props.handleStatusSelect(props.currentStatus)
  }, [props.currentStatus])

  const status = statuses.map((stat, idx) => {
    return(
      <option key={idx} value={stat}>{stat}</option>
    )
  })

  const handleChange = (e) => {
    setValue(e.target.value);
    props.handleStatusSelect(e.target.value);
  }

  return (
    <div className="task-status">
      <label className="text-white mb-1">Status</label>
      <select 
      name="status" 
      className="card bg-dark text-light task-statusSelect" id="id_status"
      value={value}
      onChange={handleChange}
      >
        {status}
      </select>
    </div>
)
}

export default StatusSelection
