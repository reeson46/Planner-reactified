import React from 'react'
import Subtask from './Subtask';
import ExistingSubtask from './ExistingSubtask';

const Subtasks = (props) => {

  const handleChange = (e) => {
    props.setSubtaskInput(e.target.value);
  }

  const addSubtask = (e, value) => {
    if(e.keyCode === 13 && value != '') {
      let array = props.subtasks;
      array.push(value)
      props.setSubtasks(array);
      props.setSubtaskInput('')
    }
  }

  const removeSubtask = (idx) => {
    let array = props.subtasks;
    array.splice(idx, 1);
    props.setSubtasks([...array]);
  }

  const subtaskToRemoveList = (idx, id) => {
    let array = props.existingSubtasks;
    array.splice(idx, 1);
    props.setExistingSubtasks([...array]);
    props.setRemovedSubtaskIds([...props.removedSubtaskIds, id]);
  }

  return (
    <div id="subtask-div">
      <div className="row m-0">
        <label className="text-white mb-1 p-0" htmlFor="subtask-lb">Subtasks</label>
        <input
          type="text" 
          id="subtask-input" 
          className="taskForm-field card subtask-lb bg-dark text-light col-10 p-0"
          placeholder="Enter subtask...and press Enter"
          value={props.subtaskInput}
          onChange={handleChange}
          onKeyDown={(e) => addSubtask(e, props.subtaskInput)}
        />
      </div>
      <br/>

      <div id="individual-subtask">

        {props.isEdit && (
          props.existingSubtasks && props.existingSubtasks.map((subtask, idx) => (
            <ExistingSubtask key={idx+subtask.id} subtask={subtask} subtaskToRemoveList={subtaskToRemoveList} idx={idx} />
          ))
        )}

        {props.subtasks.map((subtask, idx) => (
            <Subtask key={idx} value={subtask} removeSubtask={removeSubtask} idx={idx} />
        ))}
        
      </div>

    </div>
  )
}

export default Subtasks
