import React from 'react'
import Sidebar from "./sidebar/Sidebar";
import Board from "./board/Board";
import TaskForm from './task-form/TaskForm';
import LoadingCircle from './LoadingCircle';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useTransition, animated } from 'react-spring';
import { getBoards, getSession } from '../state/action-creators/boardActions';
import { getCategories } from '../state/action-creators/categoryActions';
import { getTasks } from '../state/action-creators/taskActions';
import { getOrCreateUser } from '../state/action-creators/authActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [menuToggle, setMenuToggle] = useState(0);
  const is_taskFormVisible = useSelector((state) => state.taskForm.isTaskFormVisible);
  const isReload = useSelector(state => state.utils.isReload);
  const isLoadingTasks = useSelector(state => state.task.isLoading);

  const taskFormTransition = useTransition(is_taskFormVisible, {
    from: {y: -835, opacity: 0},
    enter: {y: 0, opacity: 1},
    leave: {y: -835, opacity: 0},
  });

  useEffect(async () => {
    await dispatch(getOrCreateUser());
    await dispatch(getSession());
    dispatch(getBoards());
    dispatch(getCategories());
    dispatch(getTasks());

  }, [isReload]);


  const toggleMenu = () => {
    var toggle = 1 - menuToggle;
    setMenuToggle(toggle);
  }

  return (
    <div id="wrapper" className={`mt-2 ${menuToggle ? "menuDisplayed" : ""}`}>

      <div className="" id="sidebar-wrapper">
        <Sidebar />
      </div>

      <div id="page-content-wrapper">
        <div className="container-fluid">

            <div onClick={toggleMenu} className={`bg-dark ${menuToggle ? "menu-arrow-rot" : ""}`} id="menu-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-arrow-left-square menu-arrow" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
            </div>

          <div className="row">
            <div className="col-lg-12 pt-3">
              {taskFormTransition((style, item) => 
                item ? 
                (<animated.div style={style} className="new-task-wrapper">
                  <TaskForm />
                </animated.div>) : ''
              )}
              
              {isLoadingTasks ? 
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%"
                  }}>
                  <LoadingCircle size={100} thickness={3} />
                </div>
                :
                ""
              }

              <Board />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
