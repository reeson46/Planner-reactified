import { GET_BOARDS, ADD_BOARD, DELETE_BOARD, SET_ACTIVE_BOARD, RENAME_BOARD, GET_SESSION, INIT_CATEGORIES, INIT_TASKS, IS_LOADING_BOARDS  } from "./types";
import { tokenConfig } from "./authActions";
import axios from "axios";

export const getSession = () => async (dispatch, getState) => {
  await axios.get('/api/get-session/', tokenConfig(getState));
  dispatch({
    type: GET_SESSION
  })
}

export const getBoards = () => async (dispatch, getState) => {
  dispatch({type: IS_LOADING_BOARDS});
  const res = await axios.get('/api/get-boards/', tokenConfig(getState));
  dispatch({
    type: GET_BOARDS,
    payload: res.data.boards
  });
  dispatch({
    type: SET_ACTIVE_BOARD,
    payload: res.data.active
  });
}

export const createBoard = (name) => async (dispatch, getState) => {
  const body = JSON.stringify({name});
  const res = await axios.post('/api/manage-board/', body,tokenConfig(getState));
  dispatch({
    type: ADD_BOARD,
    payload: res.data.board
  });
  dispatch({
    type: SET_ACTIVE_BOARD,
    payload: res.data.active
  });
  dispatch({
    type: INIT_CATEGORIES
  });
  dispatch({
    type: INIT_TASKS
  });
}

export const deleteBoard = (id) => async (dispatch, getState) => {
  const config = tokenConfig(getState);
  config.headers['id'] = id
  const res = await axios.delete('/api/manage-board/', config);
  dispatch({
    type: DELETE_BOARD,
    payload: res.data.board_id
  });
  dispatch({
    type: SET_ACTIVE_BOARD,
    payload: res.data.active
  })

}

export const renameBoard = (name, id) => async (dispatch, getState) => {
  const body = JSON.stringify({id, name})
  const res = await axios.patch('/api/manage-board/', body, tokenConfig(getState));
  dispatch({
    type: RENAME_BOARD,
    payload: {
      id: res.data.id,
      name: res.data.name
    }
  });
  
}

export const setActiveBoard = (id) => async dispatch => {
  const body = JSON.stringify({id});
  const res = await axios.post('/api/set-active-board/', body, {
    headers: {
      'Content-type': 'application/json'
    }
  });
  dispatch({
      type: SET_ACTIVE_BOARD,
      payload: res.data
  });
 
}