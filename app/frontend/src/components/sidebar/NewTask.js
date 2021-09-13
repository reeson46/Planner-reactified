import React from 'react'
import { setTaskFormVisibility, isEdit } from '../../state/action-creators/taskFormActions'
import { useDispatch, useSelector } from 'react-redux'
import { MyTooltip}  from '../Tooltip'


const NewTask = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.task.items);
  const user = useSelector(state => state.auth.user);

  const handleClick = () => {
    dispatch(setTaskFormVisibility(true));
    dispatch(isEdit(false));
  }

  return (
    <div className="bg-dark mb-3" id="sidebar-new-task-wrapper">
      <div className="text-white fs-4 text-center mt-2 new-task-text">New Task</div>
      <div id="sidebar-new-task">
        <MyTooltip
          title={user && user.is_guest && tasks.length >= 7 ? 
          "As a Guest user, you can have only 7 Tasks. Sign Up for free to add more." : ""}
          placement="right"
        >
          <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" className={`bi bi-plus-square sidebar-add-newtask ${user && user.is_guest && tasks.length >= 7 ? "sidebar-add-task-guest" : "newtask-icon"}`} viewBox="0 0 16 16" data-bs-toggle="tooltip" data-bs-placement="right" title="">
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </MyTooltip>
      </div>
    </div>
  )
}

export default NewTask
