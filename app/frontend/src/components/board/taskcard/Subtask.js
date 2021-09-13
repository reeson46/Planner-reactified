import React from 'react'
import { useState } from "react";

const Subtask = (props) => {
  const [isChecked, setIsChecked] = useState(props.sub.is_complete)

  const handleCheckboxChange = (id) => {
    setIsChecked(!isChecked);
    props.handleProgress(!isChecked, id);
  }

  return (
    <span className="d-flex justify-content-between mb-3">
        <li className="card-subtitle card-subtask">{props.sub.name}</li>
        <div className="checkbox-div">
          <input type="checkbox" className="form-check-input custom-subtask-checkbox m-0" checked={isChecked}
          onChange={() => handleCheckboxChange(props.sub.id)} />
        </div>
    </span>
  )
}

export default Subtask
