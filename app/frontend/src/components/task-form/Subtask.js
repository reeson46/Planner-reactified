import React from 'react'

const Subtask = (props) => {
  return (
    <span className="d-flex subtask-field">
      <input type="text-sub" className="card subtask bg-dark text-light col-10" value={props.value} disabled />
      <div className="delete-subtask delete-icon-task">
        <svg onClick={() => props.removeSubtask(props.idx)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" className="bi bi-x-lg" viewBox="0 0 16 16">
          <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path>
        </svg>
      </div>
    </span>
  )
}

export default Subtask
