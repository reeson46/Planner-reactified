import React from 'react';
import Subtask from './Subtask'
import Status from './Status'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskFormVisibility, isEdit, getTaskToEdit } from '../../../state/action-creators/taskFormActions';
import { setTaskExtendState, setSubtaskState } from '../../../state/action-creators/taskActions';

function convertDateAndTime(date_created) {
  var date = new Date(date_created)
  var sign = Math.sign(date.getTimezoneOffset())
  var offset = Math.abs(date.getTimezoneOffset() / 60)
  var hours = date.getHours();

  if (sign == 1) {
    date.setHours(hours + offset)
  } else if (sign == -1) {
    date.setHours(hours - offset)
  }

  var date_options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  var time_options = {
    hour: 'numeric',
    minute: '2-digit'
  }
  var time = date.toLocaleTimeString('en-US', time_options).toLowerCase();
  var a = time.split(" ")[0];
  var b = time.split(" ")[1];
  var formatted_time = a + ' ' + b.split('').join('.') + '.'

  return date.toLocaleDateString(undefined, date_options) + ', ' + formatted_time;
}

const useStyles = makeStyles({
  determinate: {
    color: '#00A62F',  
  },
  determinate1: {
    color: 'orange'
  },
  root: {
    position: 'absolute',
    left: '0',
  },
  circle: {
    transition: "all 0.4s ease-in-out"
  }
});



const TaskCard = ({task}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user)
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    getProgress();
    
  }, [task])
  
  const handleProgress = (state, id) => {
    
    if(state) {
      setCompleted(completed + 1)
      var result = Math.round(((completed + 1) / task.subtask.length) * 100)
      setProgress(result);
    }
    else {
      setCompleted(completed - 1)
      var result = Math.round(((completed - 1) / task.subtask.length) * 100)
      setProgress(result);
    }

    animateValue(progress, result, 400);
    
    dispatch(setSubtaskState(state, id));

  }
  
  const subtask = task.subtask.map((sub) => {
    return(
      <Subtask key={sub.id} sub={sub} handleProgress={handleProgress} />
    )
  })

  function getProgress() {
    let qs = task.subtask.filter(({is_complete}) => is_complete === true);
    let result = Math.round((qs.length / task.subtask.length) * 100);
    setProgress(result);
    setValue(result);
    setCompleted(qs.length);
  }

  const animateValue = (start, end, duration) => {
    if(start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var timer = setInterval(function () {
      current += increment;
      setValue(current);
      if (current == end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  const onTaskClick = id => {
    dispatch(setTaskExtendState(id));
  }

  const onClickEdit = (id) => {
    dispatch(getTaskToEdit(id));
    dispatch(isEdit(true));
    dispatch(setTaskFormVisibility(true));
  }

  return (
    <div className="card text-white task shadow" id={`panelsStayOpen-heading${task.id}`}>
      <div onClick={() => onTaskClick(task.id)} className="card-header task-card-header-wrapper task-extend p-0" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse${task.id}`}
        aria-expanded="true" aria-controls={`panelsStayOpen-collapse${task.id}`}>
        <div className="d-flex justify-content-between task-card-header">
          <div className="card-subtitle fs-3 task-title-text">{task.name}</div>
          
          {task.subtask.length !== 0 ? (
            <div className="subtask-circular-progress">

              <CircularProgress
              classes={{
                determinate: classes.determinate1
              }}
                variant='determinate'
                value={100}
                thickness={4}
                size={57}
              />
              <CircularProgress 
                classes={{
                  determinate: classes.determinate,
                  root: classes.root,
                  circle: classes.circle
                }}
                variant="determinate"
                value={progress}
                thickness={4}
                size={57}
              />
              <div className="number">{`${value}%`}</div>

            </div>
          ) : ''}

        </div>
      </div>
      <div id={`panelsStayOpen-collapse${task.id}`}
        className={`accordion-collapse collapse ${task.extend_state && "show"}`}
        aria-labelledby={`panelsStayOpen-collapse${task.id}`}>
        <div className="card-body">
          <div className="task-card-description"> 

            {task.description ? (
              <div>
                <div className="task-description-text fs-5 mb-2">Description:</div>
                <div className="card-text">{task.description}</div>
                <hr/>
              </div>
            ) : ""}
            
          </div>
          <div className="task-card-subtasks">

            {task.subtask.length ? 
            (
              <div>
                <div className="task-subtask-text fs-5 mb-2">Subtasks:</div>
                {subtask}
              </div>
            ):""
            }

          </div>
        </div>
        <div className="card-footer">
          <h6 className="card-subtitle fw-light mt-1">Created by {user && !user.is_guest ? task.created_by : 'Guest'} , on {convertDateAndTime(task.date_created)}</h6>
          <hr/>
          <div className="d-flex justify-content-between">
            <div>
              <button onClick={() => onClickEdit(task.id)} className="btn btn-block fw500 w-100" id="edit-task">Edit</button>
            </div>
            <div>
              <Status task={task} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
