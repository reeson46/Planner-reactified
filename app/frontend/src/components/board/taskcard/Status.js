import React from 'react'
import { useDispatch } from 'react-redux';
import { setTaskStatus } from '../../../state/action-creators/taskActions';

const Status = (props) => {
  const dispatch = useDispatch();
  const statuses = ['Planned', 'In Progress', 'Testing', 'Completed'];

  const handleStatusChange = (e) => {
    const status = e.target.getAttribute('data-value');
    const id = e.target.getAttribute('data-id');
    const current = e.target.getAttribute('data-current');

    if(status != current) {
      dispatch(setTaskStatus(status, id));
    }
  }

  const status = statuses.map((stat, idx) => {
    return(
      <li onClick={handleStatusChange} className={`taskcard-status ${props.task.status == stat && "current-status" }`} data-value={stat} data-id={props.task.id} key={idx} data-current={props.task.status} >
        {stat}
      </li>
    )
  })

  return (
    <div className="dropdown">
      <button data-display="static" className="btn dropdown-toggle task-status-button" type="button"
        id={`dropdownMenuButton${props.task.id}`} data-bs-toggle="dropdown" aria-expanded="false">
        Move to
      </button>
      <ul className="dropdown-menu dropdown-menu-taskcard bg-dark" aria-labelledby={`dropdownMenuButton${props.task.id}`}>
        {status}
      </ul>
    </div>
  )
}

export default Status
