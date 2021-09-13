import React from 'react'
import BoardColumn from './BoardColumn';
import { useSelector } from "react-redux";

const Board = () => {
  const tasks = useSelector(state => state.task.items);
  
  return (
    <div className="row accordion">

      <BoardColumn tasks={tasks} name={'Planned'} hr={'new1'} />

      <BoardColumn tasks={tasks} name={'In Progress'} hr={'new2'} />

      <BoardColumn tasks={tasks} name={'Testing'} hr={'new3'} />

      <BoardColumn tasks={tasks} name={'Completed'} hr={'new4'} />
      
    </div>
  )
}

export default Board
