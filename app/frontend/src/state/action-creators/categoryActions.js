import { GET_CATEGORIES, ADD_CATEGORY, GET_ACTIVE_CATEGORY, SET_ACTIVE_CATEGORY, DELETE_CATEGORY, RENAME_CATEGORY, INIT_TASKS, IS_LOADING_CATEGORIES } from "./types";
import axios from "axios";
import { tokenConfig } from "./authActions";


export const getCategories = () => async (dispatch, getState) => {
  dispatch({type: IS_LOADING_CATEGORIES});
  const res = await axios.get('/api/get-categories/', tokenConfig(getState));
  dispatch({
    type: GET_CATEGORIES,
    payload: res.data.categories
  });
  dispatch({
    type: SET_ACTIVE_CATEGORY,
    payload: res.data.active
  })
}

export const createCategory = (name, sender) => async (dispatch, getState) => {
  const body = JSON.stringify({name, sender});
  const res = await axios.post('/api/manage-category/', body, tokenConfig(getState));
  dispatch({
    type: ADD_CATEGORY,
    payload: res.data.category
  });

  if(sender === 'TASK_FORM') {
    dispatch({
      type: SET_ACTIVE_CATEGORY,
      payload: res.data.active
    })
    dispatch({
      type: INIT_TASKS
    })
  }
  }

export const deleteCategory = (id) => async (dispatch, getState) => {
  const config = tokenConfig(getState);
  config.headers['id'] = id;

  const res = await axios.delete('/api/manage-category/', config);
  dispatch({
    type: DELETE_CATEGORY,
    payload: res.data
  });
}

export const renameCategory = (name, id) => async (dispatch, getState) => {
  const body = JSON.stringify({name, id})
  const res = await axios.patch('/api/manage-category/', body, tokenConfig(getState));
  dispatch({
    type: RENAME_CATEGORY,
    payload: {
      id: res.data.id,
      name: res.data.name
    }
  });
}

export const setActiveCategory = (id) => async dispatch => {
  const body = JSON.stringify({id});
  const res = await axios.post('/api/set-active-category/', body, {
    headers: {
      'Content-type': 'application/json'
    }
  });
  dispatch({
    type: SET_ACTIVE_CATEGORY,
    payload: res.data
  });

}