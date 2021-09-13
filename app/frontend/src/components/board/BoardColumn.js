import React from 'react'
import TaskCard from './taskcard/TaskCard'

const BoardColumn = (props) => {
  var total = 0;
  
  const taskCard = props.tasks && props.tasks.map((task) => {
    if(task.status == props.name){
      total += 1;
      return(
        <TaskCard key={task.id} task={task} />
        )
      }
    });

  return (
    <div className="col-lg-3 col-md-6 col-sm-12">
      <h2 className="text-secondary font-monospace text-center">{props.name} {total}</h2>
      <hr className={props.hr}/>

      <div className="task-col" >
        {taskCard}
      </div>
    </div>
  )
}

export default BoardColumn
