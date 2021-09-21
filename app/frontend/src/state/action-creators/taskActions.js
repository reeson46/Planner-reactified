import { 
  GET_TASKS, 
  ADD_TASK, 
  SET_TASK_STATUS, 
  UPDATE_TASK, 
  DELETE_TASK,
  SET_TASK_EXTEND_STATE,
  SET_SUBTASK_STATE,
  IS_LOADING_TASKS,
  IS_LOADING_TASKS_DONE
} from "./types";
import { tokenConfig } from "./authActions";
import axios from "axios";


export const getTasks = () => async (dispatch, getState) => { 
  dispatch({type: IS_LOADING_TASKS});
  const res = await axios.get('/api/get-tasks/', tokenConfig(getState));
  dispatch({
    type: GET_TASKS, 
    payload: res.data 
  });
};

export const createTask = (task) => async (dispatch, getState) => {
  const body = JSON.stringify(task);
  const res = await axios.post('/api/create-task/', body, tokenConfig(getState));
  dispatch({
    type: ADD_TASK,
    payload: res.data
  });
}

export const updateTask = (task) => async (dispatch, getState) => {
  const body = JSON.stringify(task);
  const res = await axios.patch('/api/update-task/', body, tokenConfig(getState));
  dispatch({
    type: UPDATE_TASK,
    payload: {
      task: res.data.task,
      activeCategory: res.data.activeCategory
    }
  });
}

export const deleteTask = (id) => async (dispatch, getState) => {
  const config = tokenConfig(getState);
  config.headers['id'] = id;
  const res = await axios.delete('/api/delete-task/', config);
  dispatch({
    type: DELETE_TASK,
    payload: res.data
  });
  
}

export const setTaskStatus = (status, id) => async (dispatch, getState) => {
  const body = JSON.stringify({status, id})
  const res = await axios.patch('/api/set-status/', body, tokenConfig(getState));
  dispatch({
    type: SET_TASK_STATUS,
    payload: {
      status: res.data.status,
      id: res.data.id
    }
  });
}


export const setTaskExtendState = id => async (dispatch, getState) => {
  const body = JSON.stringify({id});
  const res = await axios.patch('/api/set-extend/', body, tokenConfig(getState));
  dispatch({
    type: SET_TASK_EXTEND_STATE,
    payload: {
      id: res.data.id,
      extend: res.data.extend
    }
  });
}

export const setSubtaskState = (state, id) => async (dispatch, getState) => {
  const body = JSON.stringify({state, id});
  const res = await axios.patch('/api/subtask-state/', body, tokenConfig(getState));
  dispatch({
    type: SET_SUBTASK_STATE,
    payload: {
      taskId: res.data.task_id,
      subId: res.data.sub_id,
      subState: res.data.sub_state
    }
  });
}