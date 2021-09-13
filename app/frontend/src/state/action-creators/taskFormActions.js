import {TASK_FORM_VISIBILITY, IS_EDIT, GET_TASK_TO_EDIT} from "./types";
import axios from "axios";
import { tokenConfig } from "./authActions";

export const setTaskFormVisibility = (value) => dispatch => {
  dispatch({
    type: TASK_FORM_VISIBILITY,
    payload: value
  })
}

export const isEdit = (value) => dispatch => {
  dispatch({
    type: IS_EDIT,
    payload: value
  });
}

export const getTaskToEdit = (id) => async (dispatch, getState) => {
  const body = JSON.stringify({id});
  const res = await axios.post('/api/get-task/', body, tokenConfig(getState));
  dispatch({
    type: GET_TASK_TO_EDIT,
    payload: res.data
  });
}
